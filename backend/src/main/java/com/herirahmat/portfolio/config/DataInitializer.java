package com.herirahmat.portfolio.config;

import com.herirahmat.portfolio.entity.*;
import com.herirahmat.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final BlogPostRepository blogPostRepository;
    private final PersonalProfileRepository personalProfileRepository;

    @Override
    public void run(String... args) {
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

    private void seedExperiences() {
        experienceRepository.save(Experience.builder()
                .company("PT Bank Rakyat Indonesia (BRI) | PT Karya Sarana Sejahtera")
                .role("IT - Project Officer 1")
                .period("Dec 2025 — Present")
                .description("Leading middleware architecture design and implementation for enterprise-grade integration platform.")
                .impact(Arrays.asList("Improved API response time by 40% through caching optimization", "Designed event-driven architecture handling 1M+ requests/day", "Reduced system downtime by 60% with circuit breaker implementation"))
                .tech(Arrays.asList("API Gateway", "Integration Server", "Kibana", "Kafka", "Redis", "Docker"))
                .build());

        experienceRepository.save(Experience.builder()
                .company("PT Bank Syariah Indonesia (BSI) | PT Indocyber Global Teknologi")
                .role("Junior Software Developer")
                .period("May 2025 — Nov 2025")
                .description("Developed and maintained integration services connecting multiple business systems.")
                .impact(Arrays.asList("Built REST API gateway serving 50+ microservices", "Implemented message queue reducing processing time by 35%", "Automated deployment pipeline cutting release time from hours to minutes"))
                .tech(Arrays.asList("API Gateway", "Integration Server", "Kibana", "Kafka"))
                .build());
    }

    private void seedProjects() {
        projectRepository.save(Project.builder()
                .title("Enterprise API Gateway")
                .category("integration")
                .icon("🏗️")
                .brief("Centralized API gateway handling authentication, rate limiting, and routing for 50+ microservices.")
                .problem("Multiple microservices exposed directly to clients, causing security vulnerabilities and inconsistent API contracts.")
                .solution("Designed a centralized API Gateway with authentication, rate limiting, request transformation, and intelligent routing.")
                .architecture("graph LR\n  Client-->|HTTPS|Gateway[API Gateway]\n  Gateway-->|Auth|AuthSvc[Auth Service]\n  Gateway-->|Route|SvcA[Service A]\n  Gateway-->|Route|SvcB[Service B]\n  Gateway-->|Route|SvcC[Service C]\n  Gateway-->|Metrics|Monitor[Monitoring]")
                .tech(Arrays.asList("Spring Cloud Gateway", "OAuth2", "Redis", "Prometheus"))
                .result("Reduced API latency by 30%, eliminated 95% of unauthorized access attempts.")
                .build());

        projectRepository.save(Project.builder()
                .title("Event-Driven Order System")
                .category("messaging")
                .icon("🔄")
                .brief("Asynchronous order processing system using event sourcing and CQRS pattern.")
                .problem("Synchronous order processing caused timeouts during peak hours, losing potential revenue.")
                .solution("Implemented event-driven architecture with Kafka for asynchronous processing and CQRS for read/write separation.")
                .architecture("graph LR\n  OrderAPI-->|Publish|Kafka[Kafka Broker]\n  Kafka-->|Consume|Inventory[Inventory Svc]\n  Kafka-->|Consume|Payment[Payment Svc]\n  Kafka-->|Consume|Notification[Notification Svc]\n  Inventory-->|Write|DB[(Database)]")
                .tech(Arrays.asList("Apache Kafka", "Java", "PostgreSQL", "Docker"))
                .result("Handled 1M+ orders/day with 99.9% reliability, zero timeout during peak.")
                .build());
    }

    private void seedSkills() {
        SkillCategory integration = SkillCategory.builder().title("Integration").icon("🔗").build();
        integration.setItems(Arrays.asList(
                SkillItem.builder().name("REST API").level(90).category(integration).build(),
                SkillItem.builder().name("GraphQL").level(65).category(integration).build(),
                SkillItem.builder().name("gRPC").level(75).category(integration).build()
        ));
        skillCategoryRepository.save(integration);

        SkillCategory messaging = SkillCategory.builder().title("Messaging").icon("📨").build();
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
                .build());
    }

    private void seedProfile() {
        personalProfileRepository.save(PersonalProfile.builder()
                .name("Heri Rahmat")
                .role("Middleware Developer")
                .tagline("Driving performance and scalability with clean integration.")
                .bioEn("Passionate Middleware Developer with 5+ years of experience...")
                .bioId("Middleware Developer yang bersemangat dengan pengalaman 5+ tahun...")
                .email("herir1497@gmail.com")
                .linkedin("https://www.linkedin.com/in/heri-rahmat-suryadi/")
                .github("https://github.com/herayadi")
                .build());
    }
}
