package com.his.bi.event;

import com.his.bi.model.BenefitAccountEntity;
import com.his.bi.repository.BenefitAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EligibilityEventListenerTest {

    @Mock
    private BenefitAccountRepository repository;

    @InjectMocks
    private EligibilityEventListener listener;

    private EligibilityDeterminedEvent approvedEvent;

    @BeforeEach
    void setUp() {
        approvedEvent = new EligibilityDeterminedEvent();
        approvedEvent.setAppId(1L);
        approvedEvent.setCitizenName("John Doe");
        approvedEvent.setPlanName("SNAP");
        approvedEvent.setStatus("APPROVED");
        approvedEvent.setBenefitAmount(350.0);
    }

    @Test
    void testEligibilityDetermined_Approved_CreatesAccount() {
        when(repository.findByAppId(1L)).thenReturn(Optional.empty());

        Consumer<EligibilityDeterminedEvent> consumer = listener.eligibilityDetermined();
        consumer.accept(approvedEvent);

        verify(repository).save(any(BenefitAccountEntity.class));
    }

    @Test
    void testEligibilityDetermined_Rejected_NoAction() {
        approvedEvent.setStatus("REJECTED");

        Consumer<EligibilityDeterminedEvent> consumer = listener.eligibilityDetermined();
        consumer.accept(approvedEvent);

        verify(repository, never()).save(any());
    }

    @Test
    void testEligibilityDetermined_Idempotency() {
        when(repository.findByAppId(1L)).thenReturn(Optional.of(new BenefitAccountEntity()));

        Consumer<EligibilityDeterminedEvent> consumer = listener.eligibilityDetermined();
        consumer.accept(approvedEvent);

        // Should not save if account already exists
        verify(repository, never()).save(any());
    }

    @Test
    void testGenerateAccountNumber_Formats() {
        // We can't easily test private methods, but we can verify the saved object's account number
        when(repository.findByAppId(1L)).thenReturn(Optional.empty());

        listener.eligibilityDetermined().accept(approvedEvent);

        verify(repository).save(argThat(account -> 
            account.getAccountNumber().startsWith("6011") && account.getAccountNumber().length() == 16
        ));

        // Test non-SNAP
        approvedEvent.setPlanName("MEDICAID");
        listener.eligibilityDetermined().accept(approvedEvent);
        
        verify(repository).save(argThat(account -> 
            account.getAccountNumber().startsWith("POL-MEDICAID-")
        ));
    }
}
