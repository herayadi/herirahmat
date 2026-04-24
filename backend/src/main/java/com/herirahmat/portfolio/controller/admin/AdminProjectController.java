package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.Project;
import com.herirahmat.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll(); // Admin sees all including drafts
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updated) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setCategory(updated.getCategory());
                    existing.setIcon(updated.getIcon());
                    existing.setBriefEn(updated.getBriefEn());
                    existing.setBriefId(updated.getBriefId());
                    existing.setProblemEn(updated.getProblemEn());
                    existing.setProblemId(updated.getProblemId());
                    existing.setSolutionEn(updated.getSolutionEn());
                    existing.setSolutionId(updated.getSolutionId());
                    existing.setArchitecture(updated.getArchitecture());
                    existing.setTech(updated.getTech());
                    existing.setResultEn(updated.getResultEn());
                    existing.setResultId(updated.getResultId());
                    existing.setIsPublished(updated.getIsPublished());
                    return ResponseEntity.ok(projectRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
