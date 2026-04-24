package com.herirahmat.portfolio.repository;

import com.herirahmat.portfolio.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
}
