package com.spendwise.expense.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * NotificationClient - Feign client that calls the Notification Service.
 *
 * Called when:
 *  - Employee submits an expense  → EXPENSE_SUBMITTED notification to employee
 *  - Manager approves an expense  → EXPENSE_APPROVED  notification to employee
 *  - Manager rejects an expense   → EXPENSE_REJECTED  notification to employee
 *
 * userEmail is optional — when provided AND mail is enabled in notification-service,
 * the notification is also sent as an email to that address.
 */
@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {

    @PostMapping("/api/notifications/send")
    void sendNotification(
        @RequestParam Long userId,
        @RequestParam(required = false) String userEmail,  // optional: triggers email
        @RequestParam String title,
        @RequestParam String message,
        @RequestParam String type
    );
}
