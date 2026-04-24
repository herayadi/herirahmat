package com.herirahmat.portfolio.config;

import com.herirahmat.portfolio.entity.*;
import com.herirahmat.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final BlogPostRepository blogPostRepository;
    private final PersonalProfileRepository personalProfileRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            seedAdminUser();
        }
        if (experienceRepository.count() == 0) {
            seedExperiences();
        }
        if (projectRepository.count() == 0) {
            seedProjects();
        }
        if (skillCategoryRepository.count() == 0) {
            seedSkills();
        }
        if (blogPostRepository.count() == 0) {
            seedBlogPosts();
        }
        if (personalProfileRepository.count() == 0) {
            seedProfile();
        }
    }

    private void seedAdminUser() {
        adminUserRepository.save(AdminUser.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .build());
        System.out.println("[DataInitializer] Default admin user created (admin/admin123)");
    }

    private void seedExperiences() {
        experienceRepository.save(Experience.builder()
                .company("PT Bank Rakyat Indonesia (BRI) | PT Karya Sarana Sejahtera")
                .roleEn("IT - Project Officer 1")
                .roleId("IT - Project Officer 1")
                .period("Dec 2025 — Present")
                .descriptionEn("Leading middleware architecture design and implementation for enterprise-grade integration platform.")
                .descriptionId("Memimpin desain arsitektur dan implementasi middleware untuk platform integrasi kelas perusahaan.")
                .impact(Arrays.asList("Improved API response time by 40% through caching optimization", "Designed event-driven architecture handling 1M+ requests/day", "Reduced system downtime by 60% with circuit breaker implementation"))
                .tech(Arrays.asList("API Gateway", "Integration Server", "Kibana", "Kafka", "Redis", "Docker"))
                .build());

        experienceRepository.save(Experience.builder()
                .company("PT Bank Syariah Indonesia (BSI) | PT Indocyber Global Teknologi")
                .roleEn("Junior Software Developer")
                .roleId("Software Developer Junior")
                .period("May 2025 — Nov 2025")
                .descriptionEn("Developed and maintained integration services connecting multiple business systems.")
                .descriptionId("Mengembangkan dan memelihara layanan integrasi yang menghubungkan berbagai sistem bisnis.")
                .impact(Arrays.asList("Built REST API gateway serving 50+ microservices", "Implemented message queue reducing processing time by 35%", "Automated deployment pipeline cutting release time from hours to minutes"))
                .tech(Arrays.asList("API Gateway", "Integration Server", "Kibana", "Kafka"))
                .build());
    }

    private void seedProjects() {
        projectRepository.save(Project.builder()
                .title("Enterprise API Gateway")
                .category("integration")
                .icon("\uD83C\uDFD7\uFE0F")
                .briefEn("Centralized API gateway handling authentication, rate limiting, and routing for 50+ microservices.")
                .briefId("API Gateway terpusat yang menangani otentikasi, pembatasan rate, dan routing untuk 50+ microservices.")
                .problemEn("Multiple microservices exposed directly to clients, causing security vulnerabilities and inconsistent API contracts.")
                .problemId("Banyak microservices terpapar langsung ke klien, menyebabkan kerentanan keamanan dan kontrak API yang tidak konsisten.")
                .solutionEn("Designed a centralized API Gateway with authentication, rate limiting, request transformation, and intelligent routing.")
                .solutionId("Mendesain API Gateway terpusat dengan otentikasi, pembatasan rate, transformasi permintaan, dan routing cerdas.")
                .architecture("graph LR\n  Client-->|HTTPS|Gateway[API Gateway]\n  Gateway-->|Auth|AuthSvc[Auth Service]\n  Gateway-->|Route|SvcA[Service A]\n  Gateway-->|Route|SvcB[Service B]\n  Gateway-->|Route|SvcC[Service C]\n  Gateway-->|Metrics|Monitor[Monitoring]")
                .tech(Arrays.asList("Spring Cloud Gateway", "OAuth2", "Redis", "Prometheus"))
                .resultEn("Reduced API latency by 30%, eliminated 95% of unauthorized access attempts.")
                .resultId("Mengurangi latensi API sebesar 30%, menghilangkan 95% upaya akses tidak sah.")
                .isPublished(true)
                .build());

        projectRepository.save(Project.builder()
                .title("Event-Driven Order System")
                .category("messaging")
                .icon("\uD83D\uDD04")
                .briefEn("Asynchronous order processing system using event sourcing and CQRS pattern.")
                .briefId("Sistem pemrosesan pesanan asinkron menggunakan pola event sourcing dan CQRS.")
                .problemEn("Synchronous order processing caused timeouts during peak hours, losing potential revenue.")
                .problemId("Pemrosesan pesanan sinkron menyebabkan timeout selama jam sibuk, kehilangan potensi pendapatan.")
                .solutionEn("Implemented event-driven architecture with Kafka for asynchronous processing and CQRS for read/write separation.")
                .solutionId("Mengimplementasikan arsitektur event-driven dengan Kafka untuk pemrosesan asinkron dan CQRS untuk pemisahan baca/tulis.")
                .architecture("graph LR\n  OrderAPI-->|Publish|Kafka[Kafka Broker]\n  Kafka-->|Consume|Inventory[Inventory Svc]\n  Kafka-->|Consume|Payment[Payment Svc]\n  Kafka-->|Consume|Notification[Notification Svc]\n  Inventory-->|Write|DB[(Database)]")
                .tech(Arrays.asList("Apache Kafka", "Java", "PostgreSQL", "Docker"))
                .resultEn("Handled 1M+ orders/day with 99.9% reliability, zero timeout during peak.")
                .resultId("Menangani 1 juta+ pesanan/hari dengan keandalan 99,9%, nol timeout selama puncak.")
                .isPublished(true)
                .build());
    }

    private void seedSkills() {
        SkillCategory integration = SkillCategory.builder().title("Integration").icon("\uD83D\uDD17").build();
        integration.setItems(Arrays.asList(
                SkillItem.builder().name("REST API").level(90).category(integration).build(),
                SkillItem.builder().name("GraphQL").level(65).category(integration).build(),
                SkillItem.builder().name("gRPC").level(75).category(integration).build()
        ));
        skillCategoryRepository.save(integration);

        SkillCategory messaging = SkillCategory.builder().title("Messaging").icon("\uD83D\uDCE8").build();
        messaging.setItems(Arrays.asList(
                SkillItem.builder().name("Apache Kafka").level(90).category(messaging).build(),
                SkillItem.builder().name("RabbitMQ").level(80).category(messaging).build()
        ));
        skillCategoryRepository.save(messaging);
    }

    private void seedBlogPosts() {
        blogPostRepository.save(BlogPost.builder()
                .title("The Future of Middleware in 2024")
                .slug("future-of-middleware-2024")
                .summary("Exploring trends in event-driven architecture and cloud-native integration.")
                .content("# The Future of Middleware\n\nMiddleware is evolving fast. From simple ESBs to complex **Event-Driven Architectures (EDA)**...\n\n### Key Trends\n- Cloud-Native Integration\n- Serverless Middleware\n- AI-Powered Monitoring")
                .author("Heri Rahmat")
                .isPublished(true)
                .build());
    }

    private void seedProfile() {
        personalProfileRepository.save(PersonalProfile.builder()
                .name("Heri Rahmat")
                .role("Middleware Developer")
                .tagline("Driving performance and scalability with clean integration.")
                .bioEn("Passionate Middleware Developer with 5+ years of experience in architecting and implementing robust integration solutions.")
                .bioId("Middleware Developer yang bersemangat dengan pengalaman 5+ tahun dalam merancang dan mengimplementasikan solusi integrasi yang kuat.")
                .email("herir1497@gmail.com")
                .linkedin("https://www.linkedin.com/in/heri-rahmat-suryadi/")
                .github("https://github.com/herayadi")
                .build());
    }
}
