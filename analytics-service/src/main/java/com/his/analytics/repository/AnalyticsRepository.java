package com.his.analytics.repository;

import com.his.analytics.model.AnalyticsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<AnalyticsEntity, Long> {
    List<AnalyticsEntity> findByTimestampAfterOrderByTimestampDesc(LocalDateTime timestamp);
}
