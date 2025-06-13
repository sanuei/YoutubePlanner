package com.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@SpringBootApplication
@RestController
public class TestApp {

    public static void main(String[] args) {
        System.out.println("=== 启动应用程序 ===");
        System.out.println("PORT 环境变量: " + System.getenv("PORT"));
        System.out.println("server.port 系统属性: " + System.getProperty("server.port"));
        
        SpringApplication.run(TestApp.class, args);
    }

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "测试应用程序正在运行");
        response.put("port_env", System.getenv("PORT"));
        response.put("server_port_prop", System.getProperty("server.port"));
        response.put("timestamp", java.time.Instant.now().toString());
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", java.time.Instant.now().toString());
        return response;
    }
} 