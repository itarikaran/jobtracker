import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import ApplicationDetails from "./pages/ApplicationDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/add" element={<AddApplication />} />
        <Route path="/applications/:id/edit" element={<AddApplication />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
