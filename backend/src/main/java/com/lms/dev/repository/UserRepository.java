package com.lms.dev.repository;

import com.lms.dev.dto.UserProfileResponse;
import com.lms.dev.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.dev.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

	User findByEmail(String email);

    @Query("""
            select new com.lms.dev.dto.UserProfileResponse(
                u.id, u.username, u.email, u.mobileNumber, u.role, u.isActive,
                u.dob, u.gender, u.location, u.profession, u.linkedin_url, u.github_url,
                u.createdAt, u.updatedAt
            )
            from User u
            where u.id = :id
            """)
    Optional<UserProfileResponse> findProfileById(@Param("id") UUID id);

    @Query("""
            select new com.lms.dev.dto.UserProfileResponse(
                u.id, u.username, u.email, u.mobileNumber, u.role, u.isActive,
                u.dob, u.gender, u.location, u.profession, u.linkedin_url, u.github_url,
                u.createdAt, u.updatedAt
            )
            from User u
            order by u.createdAt desc
            """)
    List<UserProfileResponse> findAllProfiles();

    boolean existsByRole(UserRole role);

	User findByEmailAndPassword(String email, String password);
}
