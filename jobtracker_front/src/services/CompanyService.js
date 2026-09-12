import axios from "axios";

const API_URL = "http://localhost:8080/api/companies";

const getCompanies = () => {
    return axios.get(API_URL);
};

const getCompany = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const addCompany = (company) => {
    return axios.post(API_URL, company);
};

const updateCompany = (id, company) => {
    return axios.put(`${API_URL}/${id}`, company);
};

const deleteCompany = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export default {
    getCompanies,
    getCompany,
    addCompany,
    updateCompany,
    deleteCompany
};