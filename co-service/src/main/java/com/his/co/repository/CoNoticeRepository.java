package com.his.co.repository;

import com.his.co.model.CoNoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CoNoticeRepository extends JpaRepository<CoNoticeEntity, Long> {
    Optional<CoNoticeEntity> findByAppId(Long appId);
}
