package com.herirahmat.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String content; // Markdown content

    private String author;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPublished = false;

    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        publishedAt = LocalDateTime.now();
    }
}
