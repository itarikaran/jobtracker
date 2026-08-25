package com.arikaran.jobtracker.repository;

import com.arikaran.jobtracker.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}