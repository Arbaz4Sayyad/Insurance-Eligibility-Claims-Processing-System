package com.his.ed.repository;

import com.his.ed.model.EligibilityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EligibilityResultRepository extends JpaRepository<EligibilityResult, Long> {
    List<EligibilityResult> findByAppId(Long appId);
    long countByStatusAndDeterminedAtBetween(String status, LocalDateTime start, LocalDateTime end);
}
