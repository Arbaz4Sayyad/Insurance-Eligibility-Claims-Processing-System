package com.his.ed.repository;

import com.his.ed.model.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanRepository extends JpaRepository<PlanEntity, Long> {
    List<PlanEntity> findByActiveTrue();
}
