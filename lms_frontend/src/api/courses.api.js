import api from "./axios";

/* ─────────────────────────────────────────
   COURSES – ADMIN / TEACHER / STUDENT
───────────────────────────────────────── */

// College Admin – List Courses
export const fetchAdminCourses = () =>
  api.get("/courses/");

// Teacher – Assigned Courses (if implemented backend)
export const fetchTeacherCourses = () =>
  api.get("/courses/assigned/");

// Student – Enrolled Courses
export const fetchStudentCourses = () =>
  api.get("/courses/enrolled/");

// Create Course (Admin)
export const createCourse = (data) =>
  api.post("/courses/", data);

// Update Course (Admin)
export const updateCourse = (courseId, data) =>
  api.patch(`/courses/${courseId}/`, data);


/* ─────────────────────────────────────────
   SUBJECTS
───────────────────────────────────────── */

// Fetch Subjects (if needed globally)
export const fetchSubjects = () =>
  api.get("/subjects/");

// Assign Teacher to Subject (Academics module)
export const assignTeacherToSubject = (subjectId, teacherId) =>
  api.post(`/subjects/${subjectId}/assign-teacher/`, {
    teacher_id: teacherId,
  });


/* ─────────────────────────────────────────
   ENROLLMENTS
───────────────────────────────────────── */

// List Enrolled Students in Course
export const fetchCourseEnrollments = (courseId) =>
  api.get(`/courses/${courseId}/enrollments/`);

// Enroll Student
export const enrollStudentToCourse = (courseId, data) =>
  api.post(`/courses/${courseId}/enroll/`, data);

// Remove Student from Course
export const removeEnrollment = (enrollmentId) =>
  api.delete(`/enrollments/${enrollmentId}/remove/`);
