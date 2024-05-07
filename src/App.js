import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import SuccessPage from "./SuccessPage";
import NearestSeaPage from "./NearestSeaPage"; // New Page
import DistanceToSunPage from "./DistanceToSunPage"; // New Page
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/nearest-sea"
        element={
          <ProtectedRoute>
            <NearestSeaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/distance-to-sun"
        element={
          <ProtectedRoute>
            <DistanceToSunPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
