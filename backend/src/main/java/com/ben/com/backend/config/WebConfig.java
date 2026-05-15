package com.ben.com.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void configurePathMatch(PathMatchConfigurer configurer) {
    configurer.addPathPrefix(
      "/api",
      clazz -> RestController.class.isAssignableFrom(clazz)
        && clazz.getPackageName().startsWith("com.ben.com.backend.controller")
    );
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String uploadsPath = Path.of("uploads").toAbsolutePath().toUri().toString();
    registry.addResourceHandler("/uploads/**")
      .addResourceLocations(uploadsPath);
  }
}
