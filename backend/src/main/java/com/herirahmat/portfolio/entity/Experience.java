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
    private String roleEn;
    private String roleId;
    private String period;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionId;

    @ElementCollection
    @CollectionTable(name = "experience_impacts", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "impact")
    private List<String> impact; // We can keep impact as a list for now, or split it if needed.

    @ElementCollection
    @CollectionTable(name = "experience_tech", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "tech_name")
    private List<String> tech;
}
