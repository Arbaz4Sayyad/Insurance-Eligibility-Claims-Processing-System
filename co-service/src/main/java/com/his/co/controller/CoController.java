package com.his.co.controller;

import com.his.co.model.CoNoticeEntity;
import com.his.co.repository.CoNoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class CoController {

    @Autowired
    private CoNoticeRepository noticeRepository;

    @GetMapping
    public ResponseEntity<List<CoNoticeEntity>> getAllNotifications() {
        return ResponseEntity.ok(noticeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoNoticeEntity> getNotification(@PathVariable Long id) {
        return noticeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return noticeRepository.findById(id).map(notice -> {
            notice.setRead(true);
            noticeRepository.save(notice);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
