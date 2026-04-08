package com.his.analytics.controller;

import com.his.analytics.model.AnalyticsEntity;
import com.his.analytics.model.SystemLogEntity;
import com.his.analytics.repository.AnalyticsRepository;
import com.his.analytics.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private SystemLogRepository logRepository;

    @GetMapping("/history")
    public ResponseEntity<List<AnalyticsEntity>> getHistory() {
        // Fetch last 24 hours of events for dashboard initialization
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return ResponseEntity.ok(analyticsRepository.findByTimestampAfterOrderByTimestampDesc(since));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SystemLogEntity>> getLogs() {
        return ResponseEntity.ok(logRepository.findTop50ByOrderByTimestampDesc());
    }

    @PostMapping("/logs")
    public ResponseEntity<SystemLogEntity> recordLog(@RequestBody SystemLogEntity log) {
        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }
        return ResponseEntity.ok(logRepository.save(log));
    }
}
