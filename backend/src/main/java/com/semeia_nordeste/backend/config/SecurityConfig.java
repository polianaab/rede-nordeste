package com.semeia_nordeste.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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
                                        config.setAllowedOriginPatterns(List.of("*"));
                                        config.setAllowedMethods(
                                                        List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                                        config.setAllowedHeaders(List.of("*"));
                                        config.setAllowCredentials(true);
                                        return config;
                                }))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // 1. TUDO QUE É PÚBLICO
                                                .requestMatchers("/api/usuarios/registrar", "/api/usuarios/login",
                                                                "/api/usuarios/refresh")
                                                .permitAll()
                                                .requestMatchers("/api/entregadores/cadastrar").permitAll()
                                                .requestMatchers("/api/frete/simular").permitAll()
                                                .requestMatchers("/ws/**").permitAll()

                                                // Permitindo GET público para produtos e categorias para o front não
                                                // ficar vazio
                                                .requestMatchers(HttpMethod.GET, "/api/produtos/**", "/api/lojas/**",
                                                                "/api/categorias/**")
                                                .permitAll()

                                                // 2. REGRAS DO ADMIN (Para você construir o Admin agora)
                                                // Se quiser testar sem token por enquanto, mude para .permitAll()
                                                .requestMatchers("/api/admin/**", "/api/categorias/admin/**")
                                                .hasAuthority("ADMIN")

                                                // 3. REGRAS DO PRODUTOR
                                                .requestMatchers("/api/produtor/chats/**").hasAuthority("PRODUTOR")
                                                .requestMatchers("/api/produtor/**")
                                                .hasAnyAuthority("PRODUTOR", "ADMIN")

                                                // 4. REGRAS DO COMPRADOR
                                                .requestMatchers("/api/comprador/chats/**").hasAuthority("COMPRADOR")
                                                .requestMatchers("/api/comprador/**")
                                                .hasAnyAuthority("COMPRADOR", "ADMIN")

                                                // 5. GERAL
                                                .requestMatchers("/api/chats/**").authenticated()
                                                .anyRequest().authenticated())
                                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                                .httpBasic(basic -> basic.disable())
                                .formLogin(form -> form.disable());

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}