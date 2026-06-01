package com.semeia_nordeste.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.semeia_nordeste.backend.model.TipoPerfil;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

/**
 * Garante que o usuário ADMIN existe no banco no startup do app.
 *
 * Why: a hash BCrypt precisa ser gerada pelo mesmo encoder que valida (BCryptPasswordEncoder
 * com strength padrão 10) — gerar via SQL "hardcoded" é frágil porque cada hash BCrypt é
 * única (salt aleatório) e qualquer erro de cópia quebra o login.
 *
 * Credenciais default (sobreescrevíveis via .env):
 *   ADMIN_SEED_EMAIL = admin@redenordeste.com
 *   ADMIN_SEED_SENHA = RedeNordeste@2026
 *
 * Comportamento:
 *  - Se NÃO existe usuário com este email: cria como ADMIN.
 *  - Se existe e não é ADMIN: promove para ADMIN + reativa.
 *  - Se existe e a senha não bate: regenera a hash com a senha atual do .env.
 *  - Em produção, mude ADMIN_SEED_SENHA no .env e reinicie. Para desabilitar
 *    a regeneração automática, defina ADMIN_SEED_FORCAR_RESET=false.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${ADMIN_SEED_EMAIL:admin@redenordeste.com}")
    private String adminEmail;

    @Value("${ADMIN_SEED_SENHA:RedeNordeste@2026}")
    private String adminSenha;

    @Value("${ADMIN_SEED_NOME:Equipe Rede Nordeste}")
    private String adminNome;

    @Value("${ADMIN_SEED_FORCAR_RESET:true}")
    private boolean forcarReset;

    public AdminSeeder(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        usuarioRepository.findByEmail(adminEmail).ifPresentOrElse(
                this::atualizarSeNecessario,
                this::criar
        );
    }

    private void criar() {
        Usuario admin = new Usuario();
        admin.setNomeCompleto(adminNome);
        admin.setEmail(adminEmail);
        admin.setSenhaHash(passwordEncoder.encode(adminSenha));
        admin.setTipoPerfil(TipoPerfil.ADMIN);
        admin.setContaAtiva(true);
        // CPF/telefone placeholders únicos — schema exige UNIQUE em ambos
        admin.setCpfCnpj("00000000000");
        admin.setTelefone("79000000000");
        usuarioRepository.save(admin);
        log.info("[AdminSeeder] ADMIN criado: {}", adminEmail);
    }

    private void atualizarSeNecessario(Usuario existente) {
        boolean precisaSalvar = false;

        if (existente.getTipoPerfil() != TipoPerfil.ADMIN) {
            existente.setTipoPerfil(TipoPerfil.ADMIN);
            precisaSalvar = true;
            log.info("[AdminSeeder] {} promovido a ADMIN", adminEmail);
        }
        if (Boolean.FALSE.equals(existente.getContaAtiva())) {
            existente.setContaAtiva(true);
            precisaSalvar = true;
            log.info("[AdminSeeder] {} reativado", adminEmail);
        }
        if (forcarReset && !passwordEncoder.matches(adminSenha, existente.getSenhaHash())) {
            existente.setSenhaHash(passwordEncoder.encode(adminSenha));
            precisaSalvar = true;
            log.info("[AdminSeeder] Senha do ADMIN regenerada a partir do .env");
        }
        if (precisaSalvar) {
            usuarioRepository.save(existente);
        } else {
            log.info("[AdminSeeder] ADMIN já está OK: {}", adminEmail);
        }
    }
}
