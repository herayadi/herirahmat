package com.herirahmat.portfolio.repository;

import com.herirahmat.portfolio.entity.PersonalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalProfileRepository extends JpaRepository<PersonalProfile, Long> {
}
