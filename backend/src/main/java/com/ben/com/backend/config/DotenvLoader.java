package com.ben.com.backend.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

/**
 * 啟動前從專案根目錄載入 .env 到 System properties（IDE / mvn 本機用）。
 */
public final class DotenvLoader {

  private DotenvLoader() {
  }

  public static void load() {
    findEnvFile().ifPresent(DotenvLoader::applyToSystemProperties);
  }

  private static void applyToSystemProperties(Path envFile) {
    try (Stream<String> lines = Files.lines(envFile, StandardCharsets.UTF_8)) {
      lines.map(DotenvLoader::stripBom)
        .map(String::trim)
        .filter(line -> !line.isEmpty() && !line.startsWith("#"))
        .forEach(line -> {
          int eq = line.indexOf('=');
          if (eq <= 0) {
            return;
          }
          String key = line.substring(0, eq).trim();
          String value = unquote(line.substring(eq + 1).trim());
          if (System.getenv(key) != null || System.getProperty(key) != null) {
            return;
          }
          System.setProperty(key, value);
        });
    } catch (IOException ignored) {
      // .env 不存在或無法讀取時略過
    }
  }

  private static String stripBom(String line) {
    if (!line.isEmpty() && line.charAt(0) == '\uFEFF') {
      return line.substring(1);
    }
    return line;
  }

  private static String unquote(String value) {
    if (value.length() >= 2) {
      char first = value.charAt(0);
      char last = value.charAt(value.length() - 1);
      if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
        return value.substring(1, value.length() - 1);
      }
    }
    return value;
  }

  private static java.util.Optional<Path> findEnvFile() {
    String override = System.getenv("DOTENV_PATH");
    if (override != null && !override.isBlank()) {
      Path path = Path.of(override);
      if (Files.isRegularFile(path)) {
        return java.util.Optional.of(path);
      }
    }

    Path dir = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
    while (dir != null) {
      Path envFile = dir.resolve(".env");
      if (Files.isRegularFile(envFile)) {
        return java.util.Optional.of(envFile);
      }
      Path parent = dir.getParent();
      if (parent == null || parent.equals(dir)) {
        break;
      }
      dir = parent;
    }
    return java.util.Optional.empty();
  }
}
