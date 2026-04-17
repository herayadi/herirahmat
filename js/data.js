/* ============================================
   DATA — All CV Data (Dummy)
   Replace with real data later
   ============================================ */

const DATA = {
  personal: {
    name: "Heri Rahmat",
    role: "Middleware Developer",
    tagline:
      "Driving performance and scalability with clean integration, smart automation, and solid architecture",
    email: "herir1497@gmail.com",
    linkedin: "https://www.linkedin.com/in/heri-rahmat-suryadi/",
    github: "https://github.com/herayadi",
    location: "Jakarta, Indonesia",
    avatar: "assets/images/heri.webp",
    cvFile: "assets/files/HeriRahmat_CV.pdf",
  },

  about: {
    bio: [
      "A passionate Middleware Developer with 5+ years of experience designing and implementing scalable integration solutions across enterprise systems.",
      "Specialized in building robust APIs, message-driven architectures, and high-throughput data pipelines that connect complex systems seamlessly.",
    ],
    philosophy: [
      {
        icon: "🔗",
        title: "Reliability",
        description:
          "Building fault-tolerant systems that operate 24/7 with graceful degradation and self-healing capabilities.",
      },
      {
        icon: "⚡",
        title: "Scalability",
        description:
          "Designing architectures that scale horizontally, handling millions of transactions without breaking a sweat.",
      },
      {
        icon: "📊",
        title: "Observability",
        description:
          "Implementing comprehensive monitoring, logging, and tracing for complete system visibility.",
      },
    ],
    stats: [
      { value: 5, suffix: "+", label: "Years Experience" },
      { value: 10, suffix: "+", label: "Projects Delivered" },
      { value: 1, suffix: "M+", label: "Requests/Day Handled" },
      { value: 99.9, suffix: "%", label: "System Uptime" },
    ],
  },

  experience: [
    {
      company: "PT Bank Rakyat Indonesia (BRI) | PT Karya Sarana Sejahtera",
      role: "IT - Project Officer 1",
      period: "Dec 2025 — Present",
      description:
        "Leading middleware architecture design and implementation for enterprise-grade integration platform.",
      impact: [
        "Improved API response time by 40% through caching optimization",
        "Designed event-driven architecture handling 1M+ requests/day",
        "Reduced system downtime by 60% with circuit breaker implementation",
      ],
      tech: [
        "API Gateway",
        "Integration Server",
        "Kibana",
        "Kafka",
        "Redis",
        "Docker",
      ],
    },
    {
      company:
        "PT Bank Syariah Indonesia (BSI) | PT Indocyber Global Teknologi",
      role: "Junior Software Developer",
      period: "May 2025 — Nov 2025",
      description:
        "Developed and maintained integration services connecting multiple business systems.",
      impact: [
        "Built REST API gateway serving 50+ microservices",
        "Implemented message queue reducing processing time by 35%",
        "Automated deployment pipeline cutting release time from hours to minutes",
      ],
      tech: ["API Gateway", "Integration Server", "Kibana", "Kafka"],
    },
    {
      company: "PT AIA Financial | PT Indocyber Global Teknologi",
      role: "IT Delivery - Webmethods Developer",
      period: "Apr 2024 — Mar 2025",
      description:
        "Started career building backend services and learning integration patterns.",
      impact: [
        "Developed RESTful APIs for internal tools",
        "Contributed to legacy system migration project",
        "Implemented automated testing improving code coverage to 85%",
      ],
      tech: ["Java", "MySQL", "Git", "Jenkins"],
    },
    {
      company: "PT Indocyber Global Teknologi",
      role: "Webmethods Developer",
      period: "Dec 2023 — Mar 2024",
      description:
        "Started career building backend services and learning integration patterns.",
      impact: [
        "Developed RESTful APIs for internal tools",
        "Contributed to legacy system migration project",
        "Implemented automated testing improving code coverage to 85%",
      ],
      tech: ["Java", "MySQL", "Git", "Jenkins"],
    },
  ],

  projects: [
    {
      id: "api-gateway",
      title: "Enterprise API Gateway",
      category: "integration",
      icon: "🏗️",
      brief:
        "Centralized API gateway handling authentication, rate limiting, and routing for 50+ microservices.",
      problem:
        "Multiple microservices exposed directly to clients, causing security vulnerabilities and inconsistent API contracts.",
      solution:
        "Designed a centralized API Gateway with authentication, rate limiting, request transformation, and intelligent routing.",
      architecture:
        "graph LR\n  Client-->|HTTPS|Gateway[API Gateway]\n  Gateway-->|Auth|AuthSvc[Auth Service]\n  Gateway-->|Route|SvcA[Service A]\n  Gateway-->|Route|SvcB[Service B]\n  Gateway-->|Route|SvcC[Service C]\n  Gateway-->|Metrics|Monitor[Monitoring]",
      tech: ["Spring Cloud Gateway", "OAuth2", "Redis", "Prometheus"],
      result:
        "Reduced API latency by 30%, eliminated 95% of unauthorized access attempts.",
    },
    {
      id: "event-driven",
      title: "Event-Driven Order System",
      category: "messaging",
      icon: "🔄",
      brief:
        "Asynchronous order processing system using event sourcing and CQRS pattern.",
      problem:
        "Synchronous order processing caused timeouts during peak hours, losing potential revenue.",
      solution:
        "Implemented event-driven architecture with Kafka for asynchronous processing and CQRS for read/write separation.",
      architecture:
        "graph LR\n  OrderAPI-->|Publish|Kafka[Kafka Broker]\n  Kafka-->|Consume|Inventory[Inventory Svc]\n  Kafka-->|Consume|Payment[Payment Svc]\n  Kafka-->|Consume|Notification[Notification Svc]\n  Inventory-->|Write|DB[(Database)]",
      tech: ["Apache Kafka", "Java", "PostgreSQL", "Docker"],
      result:
        "Handled 1M+ orders/day with 99.9% reliability, zero timeout during peak.",
    },
    {
      id: "data-pipeline",
      title: "Real-time Data Pipeline",
      category: "api",
      icon: "📨",
      brief:
        "Real-time ETL pipeline processing and transforming data from multiple sources.",
      problem:
        "Batch processing of data caused 6-hour delays in business reports and analytics.",
      solution:
        "Built a real-time streaming pipeline using Kafka Streams for continuous data transformation and enrichment.",
      architecture:
        "graph LR\n  Sources[Data Sources]-->|Stream|Kafka[Kafka]\n  Kafka-->|Transform|KStreams[Kafka Streams]\n  KStreams-->|Enrich|Enricher[Enrichment Svc]\n  Enricher-->|Store|ES[(Elasticsearch)]\n  ES-->|Query|Dashboard[Dashboard]",
      tech: ["Kafka Streams", "Elasticsearch", "Grafana", "Python"],
      result: "Reduced data latency from 6 hours to under 30 seconds.",
    },
  ],

  skills: {
    integration: {
      title: "Integration",
      icon: "🔗",
      items: [
        { name: "REST API", level: 90 },
        { name: "GraphQL", level: 65 },
        { name: "gRPC", level: 75 },
        { name: "SOAP/XML", level: 70 },
      ],
    },
    messaging: {
      title: "Messaging",
      icon: "📨",
      items: [
        { name: "Apache Kafka", level: 90 },
        { name: "RabbitMQ", level: 80 },
        { name: "Redis Pub/Sub", level: 75 },
      ],
    },
    backend: {
      title: "Backend",
      icon: "⚙️",
      items: [
        { name: "Java / Spring Boot", level: 90 },
        { name: "Node.js", level: 75 },
        { name: "Python", level: 65 },
        { name: "SQL / NoSQL", level: 80 },
      ],
    },
    devops: {
      title: "DevOps",
      icon: "🚀",
      items: [
        { name: "Docker", level: 85 },
        { name: "Kubernetes", level: 70 },
        { name: "CI/CD", level: 80 },
        { name: "Linux", level: 75 },
      ],
    },
  },
};
