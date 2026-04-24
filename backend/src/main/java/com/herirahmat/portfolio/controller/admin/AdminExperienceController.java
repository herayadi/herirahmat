package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.Experience;
import com.herirahmat.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/experiences")
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceRepository experienceRepository;

    @GetMapping
    public List<Experience> getAllExperiences() {
        return experienceRepository.findAllByOrderByStartDateDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperience(@PathVariable Long id) {
        return experienceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Experience createExperience(@RequestBody Experience experience) {
        return experienceRepository.save(experience);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @RequestBody Experience updated) {
        return experienceRepository.findById(id)
                .map(existing -> {
                    existing.setCompany(updated.getCompany());
                    existing.setRoleEn(updated.getRoleEn());
                    existing.setRoleId(updated.getRoleId());
                    existing.setStartDate(updated.getStartDate());
                    existing.setEndDate(updated.getEndDate());
                    existing.setCurrent(updated.isCurrent());
                    existing.setDescriptionEn(updated.getDescriptionEn());
                    existing.setDescriptionId(updated.getDescriptionId());
                    existing.setImpact(updated.getImpact());
                    existing.setTech(updated.getTech());
                    return ResponseEntity.ok(experienceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        if (experienceRepository.existsById(id)) {
            experienceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
