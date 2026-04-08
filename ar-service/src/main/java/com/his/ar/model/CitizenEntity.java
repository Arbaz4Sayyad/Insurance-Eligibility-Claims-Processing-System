package com.his.ar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "citizens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;

    @Column(unique = true, nullable = false)
    private String ssn; // Encrypted
}
