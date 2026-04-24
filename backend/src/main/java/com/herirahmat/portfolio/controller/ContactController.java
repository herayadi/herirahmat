package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.ContactMessage;
import com.herirahmat.portfolio.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final MessageSource messageSource;

    @PostMapping
    public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactMessage message) {
        contactMessageRepository.save(message);
        String successMessage = messageSource.getMessage("contact.success", null, LocaleContextHolder.getLocale());
        return ResponseEntity.ok(successMessage);
    }
}
