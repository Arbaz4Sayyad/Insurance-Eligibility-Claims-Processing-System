package com.his.user.payload.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String ssn;
    private Boolean mfaEnabled;
    private String preferences;
    private String username; // Added in case frontend sends it
}
