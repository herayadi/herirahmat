package com.herirahmat.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "skill_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SkillItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer level; // percentage

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private SkillCategory category;
}
