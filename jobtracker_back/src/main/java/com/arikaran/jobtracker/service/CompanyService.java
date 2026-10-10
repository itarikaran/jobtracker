package com.arikaran.jobtracker.service;

import com.arikaran.jobtracker.entity.Company;
import com.arikaran.jobtracker.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company addCompany(Company company) {
        return companyRepository.save(company);
    }

    public List<Company> getCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompany(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    public Company updateCompany(Long id, Company company) {

        Company existingCompany = getCompany(id);

        existingCompany.setCompanyName(company.getCompanyName());
        existingCompany.setDistrict(company.getDistrict());
        existingCompany.setCity(company.getCity());
        existingCompany.setAddress(company.getAddress());
        existingCompany.setNotes(company.getNotes());
        existingCompany.setWebsite(company.getWebsite());

        return companyRepository.save(existingCompany);
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }
}