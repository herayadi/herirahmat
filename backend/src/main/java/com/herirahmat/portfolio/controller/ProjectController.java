package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.Project;
import com.herirahmat.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getPublishedProjects() {
        return projectRepository.findByIsPublishedTrue();
    }
}
