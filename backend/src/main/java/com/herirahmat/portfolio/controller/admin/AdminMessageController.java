package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.ContactMessage;
import com.herirahmat.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/messages")
@RequiredArgsConstructor
public class AdminMessageController {

    private final ContactMessageRepository contactMessageRepository;

    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    @GetMapping("/count")
    public Map<String, Long> getMessageCount() {
        return Map.of("count", contactMessageRepository.count());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
