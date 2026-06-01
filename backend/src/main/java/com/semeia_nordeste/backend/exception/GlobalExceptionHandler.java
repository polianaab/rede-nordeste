package com.semeia_nordeste.backend.exception;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 — erros de validação (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> erros.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.badRequest().body(body(400, "Dados inválidos",
                Map.of("campos", erros)));
    }

    // 401 — token ausente, expirado, refresh inválido
    @ExceptionHandler({ UnauthorizedException.class, SecurityException.class, AuthenticationException.class })
    public ResponseEntity<Map<String, Object>> handleUnauthorized(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body(401, ex.getMessage()));
    }

    // 403 — usuário autenticado mas sem permissão
    @ExceptionHandler({ ForbiddenException.class, AccessDeniedException.class })
    public ResponseEntity<Map<String, Object>> handleForbidden(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body(403, ex.getMessage()));
    }

    // 404 — recurso não existe
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body(404, ex.getMessage()));
    }

    // 422 — regra de negócio violada (estoque, carrinho vazio, área fora de SE...)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body(422, ex.getMessage()));
    }

    // 400 — fallback para qualquer RuntimeException não-tipada
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body(400, ex.getMessage()));
    }

    private Map<String, Object> body(int status, String message) {
        return body(status, message, Map.of());
    }

    private Map<String, Object> body(int status, String message, Map<String, Object> extras) {
        Map<String, Object> out = new HashMap<>();
        out.put("status", status);
        out.put("message", message);
        out.put("erro", message); // compat com front antigo
        out.put("timestamp", OffsetDateTime.now().toString());
        out.putAll(extras);
        return out;
    }
}
