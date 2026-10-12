
const API_BASE_URL = "http://localhost:8080/api/companies";

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed: ${response.status}`
    );
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getCompanies() {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
}

export async function getCompanyById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function addCompany(company) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });

  return handleResponse(response);
}

export async function updateCompany(id, company) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });

  return handleResponse(response);
}

export async function deleteCompany(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}
