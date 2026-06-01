package com.semeia_nordeste.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByAtivoTrueOrderByOrdemAscDataCriacaoDesc();

    List<Banner> findAllByOrderByOrdemAscDataCriacaoDesc();
}
