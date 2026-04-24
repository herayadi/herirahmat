package com.herirahmat.portfolio.repository;

import com.herirahmat.portfolio.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    List<BlogPost> findByIsPublishedTrue();
    Optional<BlogPost> findBySlugAndIsPublishedTrue(String slug);
}
