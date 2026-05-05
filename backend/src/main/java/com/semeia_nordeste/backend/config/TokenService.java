package com.semeia_nordeste.backend.config;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.semeia_nordeste.backend.model.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenService {

    private final Key key;

    private final long ACCESS_TOKEN_EXPIRATION = 900_000; // 15 min
    private final long REFRESH_TOKEN_EXPIRATION = 86_400_000; // 24h

    public TokenService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String gerarAccessToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("perfil", usuario.getTipoPerfil().name())
                .claim("tipo", "access")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String gerarRefreshToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("tipo", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validarToken(String token) {
        try {
            Claims claims = parsear(token);
            if (!"access".equals(claims.get("tipo")))
                return null;
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public String validarRefreshToken(String token) {
        try {
            Claims claims = parsear(token);
            if (!"refresh".equals(claims.get("tipo"))) {
                throw new SecurityException("Token inválido para refresh.");
            }
            return claims.getSubject();
        } catch (JwtException e) {
            throw new SecurityException("Refresh token inválido ou expirado.");
        }
    }

    private Claims parsear(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}