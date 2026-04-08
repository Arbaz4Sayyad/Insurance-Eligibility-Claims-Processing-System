package com.his.ar.repository;

import com.his.ar.model.ApplicationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
    Page<ApplicationEntity> findByCaseStatus(String caseStatus, Pageable pageable);
    long countByCaseStatus(String caseStatus);
    List<ApplicationEntity> findByCitizen_Id(Long citizenId);
}
