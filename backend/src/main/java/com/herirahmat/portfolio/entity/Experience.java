package com.herirahmat.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "experiences")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;
    private String period;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "experience_impacts", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "impact")
    private List<String> impact;

    @ElementCollection
    @CollectionTable(name = "experience_tech", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "tech_name")
    private List<String> tech;
}
