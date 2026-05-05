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
                    config.setAllowedOrigins(List.of(
                            "http://localhost:5173",
                            "http://127.0.0.1:5173",
                            "http://localhost:8080"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Auth pública
                        .requestMatchers(
                                "/api/usuarios/registrar",
                                "/api/usuarios/login",
                                "/api/usuarios/refresh")
                        .permitAll()

                        // Marketplace público (leitura)
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/produtos/**",
                                "/api/lojas/**",
                                "/api/categorias")
                        .permitAll()

                        // Admin - Acesso exclusivo
                        .requestMatchers("/api/categorias/admin/**").hasAuthority("ADMIN")

                        // Rotas por perfil - ADMIN pode gerenciar ambos
                        .requestMatchers("/api/produtor/**").hasAnyAuthority("PRODUTOR", "ADMIN")
                        .requestMatchers("/api/comprador/**").hasAnyAuthority("COMPRADOR", "ADMIN")

                        // Qualquer outra rota exige login
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