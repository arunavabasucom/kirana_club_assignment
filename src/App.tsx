import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContestPage from "./pages/ContestPage";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

const App: React.FC = () => {
  return (
    <AppProvider i18n={en}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contest/:id" element={<ContestPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
