package com.his.ar.repository;

import com.his.ar.model.CitizenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CitizenRepository extends JpaRepository<CitizenEntity, Long> {
    Optional<CitizenEntity> findBySsn(String ssn);
}
