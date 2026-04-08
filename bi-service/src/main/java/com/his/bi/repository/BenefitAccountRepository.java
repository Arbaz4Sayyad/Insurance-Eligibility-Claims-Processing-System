package com.his.bi.repository;

import com.his.bi.model.BenefitAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BenefitAccountRepository extends JpaRepository<BenefitAccountEntity, Long> {
    Optional<BenefitAccountEntity> findByAppId(Long appId);
}
