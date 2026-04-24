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
public class BlogController {

    private final BlogPostRepository blogPostRepository;

    @GetMapping
    public List<BlogPost> getPublishedPosts() {
        return blogPostRepository.findByIsPublishedTrue();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        return blogPostRepository.findBySlugAndIsPublishedTrue(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
