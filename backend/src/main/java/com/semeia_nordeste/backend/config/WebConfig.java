package com.semeia_nordeste.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

/**
 * Estabiliza o JSON de Page&lt;T&gt; em endpoints REST.
 *
 * Sem isso, o Spring serializa PageImpl direto e emite WARN no startup
 * ("Serializing PageImpl instances as-is is not supported"). VIA_DTO envolve
 * a página num wrapper estável { content, page: { number, size, totalElements,
 * totalPages } } — formato que o frontend já consome no campo `.content`.
 */
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class WebConfig {
}
