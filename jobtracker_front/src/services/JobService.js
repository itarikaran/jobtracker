import axios from "axios";

const API_URL = "http://localhost:8080/api/jobs";

const JobService = {

  // GET all jobs
  getJobs: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // GET one job
  getJob: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // CREATE job
  addJob: async (job) => {
    const response = await axios.post(API_URL, job);
    return response.data;
  },

  // UPDATE job
  updateJob: async (id, job) => {
    const response = await axios.put(`${API_URL}/${id}`, job);
    return response.data;
  },

  // DELETE job
  deleteJob: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default JobService;