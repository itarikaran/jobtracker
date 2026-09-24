import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/companies" replace />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/add" element={<AddCompany />} />
        <Route path="/companies/:id/edit" element={<AddCompany />} />
        <Route path="*" element={<Navigate to="/companies" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
