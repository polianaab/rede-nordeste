package com.semeia_nordeste.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.BannerResponse;
import com.semeia_nordeste.backend.service.BannerService;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    // Público — usado na home pública e nas dos perfis
    @GetMapping
    public ResponseEntity<List<BannerResponse>> listar() {
        return ResponseEntity.ok(bannerService.listarAtivos());
    }
}
