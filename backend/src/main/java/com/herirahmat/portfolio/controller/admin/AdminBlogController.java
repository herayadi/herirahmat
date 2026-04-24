package com.herirahmat.portfolio.controller.admin;

import com.herirahmat.portfolio.entity.BlogPost;
import com.herirahmat.portfolio.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminBlogController {

    private final BlogPostRepository blogPostRepository;

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll(); // Admin sees all including drafts
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPost(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BlogPost createPost(@RequestBody BlogPost post) {
        return blogPostRepository.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost updated) {
        return blogPostRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setSlug(updated.getSlug());
                    existing.setSummary(updated.getSummary());
                    existing.setContent(updated.getContent());
                    existing.setAuthor(updated.getAuthor());
                    existing.setIsPublished(updated.getIsPublished());
                    return ResponseEntity.ok(blogPostRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (blogPostRepository.existsById(id)) {
            blogPostRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
