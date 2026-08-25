package com.arikaran.jobtracker.service;

import com.arikaran.jobtracker.entity.Job;
import com.arikaran.jobtracker.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // CREATE
    public Job addJob(Job job) {
        return jobRepository.save(job);
    }

    // READ ALL
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // READ ONE
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    // UPDATE
    public Job updateJob(Long id, Job job) {

        Job existingJob = getJobById(id);

        existingJob.setCompanyName(job.getCompanyName());
        existingJob.setLocation(job.getLocation());
        existingJob.setJobRole(job.getJobRole());
        existingJob.setStatus(job.getStatus());
        existingJob.setAppliedDate(job.getAppliedDate());
        existingJob.setSalaryRange(job.getSalaryRange());
        existingJob.setJobType(job.getJobType());
        existingJob.setNotes(job.getNotes());
        existingJob.setJobPostingUrl(job.getJobPostingUrl());
        existingJob.setRecruiterUrl(job.getRecruiterUrl());

        return jobRepository.save(existingJob);
    }

    // DELETE
    public void deleteJob(Long id) {
        Job existingJob = getJobById(id);
        jobRepository.delete(existingJob);
    }
}