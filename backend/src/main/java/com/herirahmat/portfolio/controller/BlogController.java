package com.herirahmat.portfolio.controller;

import com.herirahmat.portfolio.entity.BlogPost;
import com.herirahmat.portfolio.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogPostRepository blogPostRepository;

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        return blogPostRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
