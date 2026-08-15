import { Routes, Route } from "react-router-dom";

import CertificateDashboard from "./pages/admin/CertificateDashboard";
import CertificateVerification from "./pages/public/CertificateVerification";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/volunteer/Profile";

function App() {
  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route
        path="/"
        element={<CertificateDashboard />}
      />

      {/* Public Certificate Verification */}
      <Route
        path="/verify/:hash"
        element={<CertificateVerification />}
      />

      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
