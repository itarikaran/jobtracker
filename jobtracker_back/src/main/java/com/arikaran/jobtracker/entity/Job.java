package com.arikaran.jobtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private String location;

    private String jobRole;

    private String status;

    private LocalDate appliedDate;

    private String salaryRange;

    private String jobType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String jobPostingUrl;

    private String recruiterUrl;
}