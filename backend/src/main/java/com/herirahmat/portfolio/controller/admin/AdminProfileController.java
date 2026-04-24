package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.PersonalProfile;
import com.herirahmat.portfolio.repository.PersonalProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final PersonalProfileRepository personalProfileRepository;

    @GetMapping
    public PersonalProfile getProfile() {
        return personalProfileRepository.findAll().stream().findFirst().orElse(null);
    }

    @PutMapping
    public ResponseEntity<PersonalProfile> updateProfile(@RequestBody PersonalProfile updated) {
        return personalProfileRepository.findAll().stream().findFirst()
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setRole(updated.getRole());
                    existing.setTagline(updated.getTagline());
                    existing.setBioEn(updated.getBioEn());
                    existing.setBioId(updated.getBioId());
                    existing.setAvatarUrl(updated.getAvatarUrl());
                    existing.setCvUrl(updated.getCvUrl());
                    existing.setEmail(updated.getEmail());
                    existing.setLinkedin(updated.getLinkedin());
                    existing.setGithub(updated.getGithub());
                    return ResponseEntity.ok(personalProfileRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.ok(personalProfileRepository.save(updated)));
    }
}
