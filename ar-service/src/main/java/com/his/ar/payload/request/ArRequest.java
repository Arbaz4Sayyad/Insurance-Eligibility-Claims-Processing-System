package com.his.ar.payload.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ArRequest {
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String ssn;
}
