import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import CourseForm from "./CourseForm";
import {
  fetchAdminCourses,
  fetchTeacherCourses,
  fetchStudentCourses,
} from "./courses.api";

const CoursesPage = () => {
  const { auth } = useAuth();

  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = auth?.role;

  useEffect(() => {
    if (!role) return;

    const loadCourses = async () => {
      setLoading(true);
      try {
        let res;
        if (role === "COLLEGE_ADMIN") res = await fetchAdminCourses();
        else if (role === "TEACHER") res = await fetchTeacherCourses();
        else if (role === "STUDENT") res = await fetchStudentCourses();

        setCourses(res?.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [role]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Courses</h2>

      {/* ───────── ADMIN ACTIONS ───────── */}
      {role === "COLLEGE_ADMIN" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <button onClick={() => setShowForm(true)}>
              Create Course
            </button>
          </div>

          {showForm && (
            <CourseForm
              onClose={() => setShowForm(false)}
              onSuccess={async () => {
                const res = await fetchAdminCourses();
                setCourses(res.data);
                setShowForm(false);
              }}
            />
          )}
        </>
      )}

      {/* ───────── LOADING ───────── */}
      {loading && <p>Loading courses…</p>}

      {/* ───────── EMPTY STATE ───────── */}
      {!loading && courses.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          {role === "STUDENT"
            ? "You are not enrolled in any courses yet."
            : "No courses available."}
        </p>
      )}

      {/* ───────── TABLE ───────── */}
      {!loading && courses.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Code</th>
              <th align="left">Name</th>
              <th align="left">Subject</th>
              {role !== "STUDENT" && <th align="left">Teacher</th>}
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.code}>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.subject_name}</td>
                {role !== "STUDENT" && (
                  <td>{c.teacher_name ?? "—"}</td>
                )}
                <td>{c.is_active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesPage;
