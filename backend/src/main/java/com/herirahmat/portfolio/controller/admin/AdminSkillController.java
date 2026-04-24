package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.SkillCategory;
import com.herirahmat.portfolio.entity.SkillItem;
import com.herirahmat.portfolio.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {

    private final SkillCategoryRepository skillCategoryRepository;

    @GetMapping
    public List<SkillCategory> getAllCategories() {
        return skillCategoryRepository.findAll();
    }

    @PostMapping
    public SkillCategory createCategory(@RequestBody SkillCategory category) {
        // Link items back to category for JPA cascade
        if (category.getItems() != null) {
            category.getItems().forEach(item -> item.setCategory(category));
        }
        return skillCategoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillCategory> updateCategory(@PathVariable Long id, @RequestBody SkillCategory updated) {
        return skillCategoryRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setIcon(updated.getIcon());

                    // Clear and replace items
                    existing.getItems().clear();
                    if (updated.getItems() != null) {
                        updated.getItems().forEach(item -> {
                            item.setCategory(existing);
                            existing.getItems().add(item);
                        });
                    }

                    return ResponseEntity.ok(skillCategoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (skillCategoryRepository.existsById(id)) {
            skillCategoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
