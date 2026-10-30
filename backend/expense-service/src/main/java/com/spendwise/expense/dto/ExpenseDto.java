package com.spendwise.expense.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ExpenseDto - data transfer object returned by the API.
 * Contains all expense fields including merchant, notes, and status tracking.
 */
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private String expenseNumber;      // e.g. EXP-2026-00001
    private Long employeeId;
    private String employeeName;
    private String department;
    private BigDecimal amount;
    private String currency;           // Default: INR
    private String description;
    private Long categoryId;
    private String categoryName;
    private LocalDate expenseDate;
    private String receiptUrl;
    private String merchantName;       // e.g. IndiGo Airlines
    private String notes;              // Additional details
    private String status;             // DRAFT, SUBMITTED, APPROVED, REJECTED
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
    private String approvedByName;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
