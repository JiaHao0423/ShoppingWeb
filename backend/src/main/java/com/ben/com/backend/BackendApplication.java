package com.ben.com.backend;

import com.ben.com.backend.config.DotenvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

  public static void main(String[] args) {
    DotenvLoader.load();
    SpringApplication.run(BackendApplication.class, args);
  }

}
