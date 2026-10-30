package com.spendwise.notification.service;

import com.spendwise.notification.dto.NotificationDto;
import com.spendwise.notification.entity.Notification;
import com.spendwise.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * NotificationService - saves notifications to DB, pushes to WebSocket, and sends emails.
 *
 * sendNotification() does THREE things:
 * 1. Saves to database (for notification history panel)
 * 2. Pushes via WebSocket to the frontend in real-time
 * 3. Sends an email notification (async, if enabled)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate  messagingTemplate;  // WebSocket sender
    private final EmailService           emailService;        // Email sender

    /**
     * Create and send a notification.
     * Called by Expense Service via Feign when expense is submitted/approved/rejected.
     *
     * @param userId    The user who receives the notification
     * @param userEmail The user's email address (for email delivery)
     * @param title     Short notification title
     * @param message   Full notification message
     * @param type      Notification type (EXPENSE_APPROVED, BUDGET_WARNING, etc.)
     */
    public void sendNotification(Long userId, String userEmail, String title, String message, String type) {
        // 1. Save to database
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .build();
        notification = notificationRepository.save(notification);

        // 2. Push to WebSocket — frontend listening on /topic/notifications/{userId}
        NotificationDto dto = toDto(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, dto);

        // 3. Send email (async — never blocks, never crashes if it fails)
        if (userEmail != null && !userEmail.isBlank()) {
            emailService.sendNotificationEmail(userEmail, title, type, title, message);
        }

        log.info("Notification sent to user {} ({}): [{}] {}", userId, userEmail, type, title);
    }

    /**
     * Backward-compatible overload without email (called by older code).
     */
    public void sendNotification(Long userId, String title, String message, String type) {
        sendNotification(userId, null, title, message, type);
    }

    /** Get all notifications for a user (paginated) */
    @Transactional(readOnly = true)
    public Page<NotificationDto> getMyNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDto);
    }

    /** Get unread notifications only */
    @Transactional(readOnly = true)
    public List<NotificationDto> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).toList();
    }

    /** Count of unread notifications (for badge icon) */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /** Mark all notifications as read */
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllReadForUser(userId);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId()).userId(n.getUserId())
                .title(n.getTitle()).message(n.getMessage())
                .type(n.getType()).read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
