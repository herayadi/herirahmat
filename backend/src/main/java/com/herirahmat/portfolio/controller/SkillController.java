package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.SkillCategory;
import com.herirahmat.portfolio.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillCategoryRepository skillCategoryRepository;

    @GetMapping
    public List<SkillCategory> getAllSkills() {
        return skillCategoryRepository.findAll();
    }
}
