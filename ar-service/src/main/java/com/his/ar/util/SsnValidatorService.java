package com.his.ar.util;

import org.springframework.stereotype.Service;

@Service
public class SsnValidatorService {

    /**
     * Mock SSN validation logic.
     * In a real-world system, this would call a SSA API.
     * For this mock, we assume SSNs starting with '9' are invalid.
     */
    public boolean isValid(String ssn) {
        if (ssn == null || ssn.length() != 9) {
            return false;
        }
        return !ssn.startsWith("9");
    }
}
