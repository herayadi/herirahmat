package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.PersonalProfile;
import com.herirahmat.portfolio.repository.PersonalProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final PersonalProfileRepository personalProfileRepository;

    @GetMapping
    public PersonalProfile getProfile() {
        // Return the first profile found
        return personalProfileRepository.findAll().stream().findFirst().orElse(null);
    }
}
