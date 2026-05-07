package com.semeia_nordeste.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private SecurityFilter securityFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(request -> {
                                        CorsConfiguration config = new CorsConfiguration();
                                        config.setAllowedOriginPatterns(List.of("*")); // aceita qualquer origem em dev
                                        config.setAllowedMethods(
                                                        List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                                        config.setAllowedHeaders(List.of("*"));
                                        config.setAllowCredentials(true);
                                        return config;
                                }))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // 1. TUDO QUE É PÚBLICO (Acesso livre)
                                                .requestMatchers("/api/entregadores/cadastrar").permitAll()
                                                .requestMatchers("/api/frete/simular").permitAll()
                                                .requestMatchers("/api/usuarios/registrar", "/api/usuarios/login",
                                                                "/api/usuarios/refresh")
                                                .permitAll()
                                                .requestMatchers("/ws/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/produtos/**", "/api/lojas/**",
                                                                "/api/categorias")
                                                .permitAll()

                                                // 2. REGRAS ESPECÍFICAS DE PERFIL (Authorities)
                                                .requestMatchers("/api/admin/**", "/api/categorias/admin/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers("/api/comprador/chats/**").hasAuthority("COMPRADOR")
                                                .requestMatchers("/api/produtor/chats/**").hasAuthority("PRODUTOR")

                                                // 3. REGRAS COMPOSTAS (Permite perfil específico OU Admin)
                                                .requestMatchers("/api/produtor/**")
                                                .hasAnyAuthority("PRODUTOR", "ADMIN")
                                                .requestMatchers("/api/comprador/**")
                                                .hasAnyAuthority("COMPRADOR", "ADMIN")

                                                // 4. QUALQUER COISA AUTENTICADA (Logado, independente do perfil)
                                                .requestMatchers("/api/chats/**").authenticated()

                                                // 5. O FILTRO FINAL (A regra de ouro: sempre por último)
                                                .anyRequest().authenticated())
                                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                                .httpBasic(basic -> basic.disable())
                                .formLogin(form -> form.disable());

                return http.build();
        }

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}