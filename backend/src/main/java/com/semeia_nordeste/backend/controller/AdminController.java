package com.semeia_nordeste.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.BannerRequest;
import com.semeia_nordeste.backend.dto.BannerResponse;
import com.semeia_nordeste.backend.dto.CategoriaRequest;
import com.semeia_nordeste.backend.dto.CategoriaResponse;
import com.semeia_nordeste.backend.dto.LojaAdminResponse;
import com.semeia_nordeste.backend.dto.MetricasAdminResponse;
import com.semeia_nordeste.backend.dto.NoticiaRequest;
import com.semeia_nordeste.backend.dto.NoticiaResponse;
import com.semeia_nordeste.backend.dto.UsuarioAdminResponse;
import com.semeia_nordeste.backend.dto.UsuarioAdminUpdateRequest;
import com.semeia_nordeste.backend.service.AdminService;
import com.semeia_nordeste.backend.service.BannerService;
import com.semeia_nordeste.backend.service.CategoriaService;
import com.semeia_nordeste.backend.service.NoticiaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final CategoriaService categoriaService;
    private final BannerService bannerService;
    private final NoticiaService noticiaService;

    public AdminController(AdminService adminService,
            CategoriaService categoriaService,
            BannerService bannerService,
            NoticiaService noticiaService) {
        this.adminService = adminService;
        this.categoriaService = categoriaService;
        this.bannerService = bannerService;
        this.noticiaService = noticiaService;
    }

    // ── DASHBOARD ───────────────────────────────────────────────
    @GetMapping("/metricas")
    public ResponseEntity<MetricasAdminResponse> metricas() {
        return ResponseEntity.ok(adminService.metricas());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Bem-vinda, Admin! Painel liberado.");
    }

    // ── USUÁRIOS ────────────────────────────────────────────────
    @GetMapping("/usuarios")
    public ResponseEntity<Page<UsuarioAdminResponse>> usuarios(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(
                adminService.listarUsuarios(pageable).map(UsuarioAdminResponse::fromEntity));
    }

    @PatchMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioAdminResponse> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioAdminUpdateRequest req) {
        return ResponseEntity.ok(
                UsuarioAdminResponse.fromEntity(adminService.atualizarUsuario(id, req)));
    }

    // ── LOJAS ───────────────────────────────────────────────────
    @GetMapping("/lojas")
    public ResponseEntity<Page<LojaAdminResponse>> lojas(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(
                adminService.listarTodasLojas(pageable).map(LojaAdminResponse::fromEntity));
    }

    @GetMapping("/lojas/pendentes")
    public ResponseEntity<Page<LojaAdminResponse>> lojasPendentes(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(
                adminService.listarLojasPendentes(pageable).map(LojaAdminResponse::fromEntity));
    }

    @PatchMapping("/lojas/{id}/verificar")
    public ResponseEntity<LojaAdminResponse> verificarLoja(@PathVariable Long id) {
        return ResponseEntity.ok(LojaAdminResponse.fromEntity(adminService.verificarLoja(id)));
    }

    @PatchMapping("/lojas/{id}/suspender")
    public ResponseEntity<LojaAdminResponse> suspenderLoja(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        return ResponseEntity.ok(LojaAdminResponse.fromEntity(adminService.suspenderLoja(id, motivo)));
    }

    @PatchMapping("/lojas/{id}/reativar")
    public ResponseEntity<LojaAdminResponse> reativarLoja(@PathVariable Long id) {
        return ResponseEntity.ok(LojaAdminResponse.fromEntity(adminService.reativarLoja(id)));
    }

    // ── CATEGORIAS ──────────────────────────────────────────────
    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> criarCategoria(@Valid @RequestBody CategoriaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CategoriaResponse.fromEntity(categoriaService.criar(req)));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<CategoriaResponse> atualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest req) {
        return ResponseEntity.ok(CategoriaResponse.fromEntity(categoriaService.atualizar(id, req)));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ── BANNERS ─────────────────────────────────────────────────
    @GetMapping("/banners")
    public ResponseEntity<List<BannerResponse>> listarBanners() {
        return ResponseEntity.ok(bannerService.listarTodos());
    }

    @PostMapping("/banners")
    public ResponseEntity<BannerResponse> criarBanner(@Valid @RequestBody BannerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.criar(req));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<BannerResponse> atualizarBanner(
            @PathVariable Long id, @Valid @RequestBody BannerRequest req) {
        return ResponseEntity.ok(bannerService.atualizar(id, req));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<Void> deletarBanner(@PathVariable Long id) {
        bannerService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ── NOTÍCIAS ────────────────────────────────────────────────
    @GetMapping("/noticias")
    public ResponseEntity<Page<NoticiaResponse>> listarNoticias(
            @PageableDefault(size = 20, sort = "dataCriacao") Pageable pageable) {
        return ResponseEntity.ok(noticiaService.listarTodas(pageable));
    }

    @PostMapping("/noticias")
    public ResponseEntity<NoticiaResponse> criarNoticia(@Valid @RequestBody NoticiaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noticiaService.criar(req));
    }

    @PutMapping("/noticias/{id}")
    public ResponseEntity<NoticiaResponse> atualizarNoticia(
            @PathVariable Long id, @Valid @RequestBody NoticiaRequest req) {
        return ResponseEntity.ok(noticiaService.atualizar(id, req));
    }

    @DeleteMapping("/noticias/{id}")
    public ResponseEntity<Void> deletarNoticia(@PathVariable Long id) {
        noticiaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
