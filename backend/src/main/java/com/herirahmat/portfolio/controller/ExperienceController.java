package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.Experience;
import com.herirahmat.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceRepository experienceRepository;

    @GetMapping
    public List<Experience> getAllExperiences() {
        return experienceRepository.findAllByOrderByStartDateDesc();
    }
}
