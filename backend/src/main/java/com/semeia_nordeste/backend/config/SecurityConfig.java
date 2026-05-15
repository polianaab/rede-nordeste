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
                                // Agora o .cors() busca automaticamente o Bean corsConfigurationSource() abaixo
                                .cors(cors -> cors.configure(http))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // 1. PÚBLICO
                                                .requestMatchers("/api/usuarios/registrar", "/api/usuarios/login",
                                                                "/api/usuarios/refresh")
                                                .permitAll()
                                                .requestMatchers("/api/entregadores/cadastrar", "/api/frete/simular",
                                                                "/ws/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/produtos/**", "/api/lojas/**",
                                                                "/api/categorias/**")
                                                .permitAll()

                                                // 2. ADMIN
                                                .requestMatchers("/api/admin/**", "/api/categorias/admin/**")
                                                .hasAuthority("ADMIN")

                                                // 3. PRODUTOR
                                                .requestMatchers("/api/produtor/chats/**").hasAuthority("PRODUTOR")
                                                .requestMatchers("/api/produtor/**")
                                                .hasAnyAuthority("PRODUTOR", "ADMIN")

                                                // 4. COMPRADOR
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
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Permite o endereço do Front delas
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
                configuration.setAllowCredentials(true); // Importante para o navegador não barrar

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
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