import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import ApplicationDetails from "./pages/ApplicationDetails";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/add" element={<AddApplication />} />
        <Route path="/applications/:id/edit" element={<AddApplication />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />

        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/add" element={<AddCompany />} />
        <Route path="/companies/:id/edit" element={<AddCompany />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
