package com.his.ed.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.time.LocalDate;

@FeignClient(name = "ar-service", url = "${ed.client.ar.url}")
public interface ArClient {
    
    @GetMapping("/api/ar/applications/{appId}")
    ArAppResponse getApplication(@PathVariable("appId") Long appId);

    class ArAppResponse {
        private Long id;
        private Citizen citizen;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Citizen getCitizen() { return citizen; }
        public void setCitizen(Citizen citizen) { this.citizen = citizen; }
    }

    class Citizen {
        private String firstName;
        private String lastName;
        private LocalDate dob;
        private String gender;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public LocalDate getDob() { return dob; }
        public void setDob(LocalDate dob) { this.dob = dob; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
    }
}
