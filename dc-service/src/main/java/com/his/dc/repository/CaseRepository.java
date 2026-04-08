package com.his.dc.repository;

import com.his.dc.model.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<CaseEntity, Long> {
    Optional<CaseEntity> findByAppId(Long appId);
}
