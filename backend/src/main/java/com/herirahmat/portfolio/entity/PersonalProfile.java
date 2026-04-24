package com.herirahmat.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "personal_profile")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PersonalProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private String tagline;
    
    @Column(columnDefinition = "TEXT")
    private String bioEn;
    
    @Column(columnDefinition = "TEXT")
    private String bioId;

    private String avatarUrl;
    private String cvUrl;
    private String email;
    private String linkedin;
    private String github;
}
