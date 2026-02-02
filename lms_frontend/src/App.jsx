import { Routes, Route } from "react-router-dom";

import AppHeader from "./components/common/AppHeader";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./features/auth/Login";
import TeacherDashboard from "./features/dashboards/TeacherDashboard";
import StudentDashboard from "./features/dashboards/StudentDashboard";

function App() {
  return (
    <>
      <AppHeader />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
