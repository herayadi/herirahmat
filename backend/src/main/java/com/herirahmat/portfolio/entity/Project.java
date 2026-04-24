package com.herirahmat.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String icon;
    
    @Column(columnDefinition = "TEXT")
    private String brief;
    
    @Column(columnDefinition = "TEXT")
    private String problem;
    
    @Column(columnDefinition = "TEXT")
    private String solution;
    
    @Column(columnDefinition = "TEXT")
    private String architecture; // Mermaid diagram string

    @ElementCollection
    @CollectionTable(name = "project_tech", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech_name")
    private List<String> tech;

    private String result;
}
