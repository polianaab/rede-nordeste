package com.semeia_nordeste.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import com.semeia_nordeste.backend.model.Usuario;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenService {

    // CHAVE SECRETA: Em produção, isso deve vir de uma variável de ambiente!
    private static final String SECRET_KEY = "sua_chave_muito_secreta_e_longa_para_o_projeto_semeia_nordeste";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Tempo de expiração (15 minutos para o Access Token)
    private final long ACCESS_TOKEN_EXPIRATION = 900_000;
    // Tempo de expiração (24 horas para o Refresh Token)
    private final long REFRESH_TOKEN_EXPIRATION = 86_400_000;

    public String gerarAccessToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("perfil", usuario.getTipoPerfil().name()) // Adiciona a Role no token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String gerarRefreshToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validarToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}