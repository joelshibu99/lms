import api from "../../api/axios";

/* ───────── FETCH COURSES ───────── */

export const fetchAdminCourses = () =>
  api.get("/courses/");

export const fetchTeacherCourses = () =>
  api.get("/courses/assigned/");

export const fetchStudentCourses = () =>
  api.get("/courses/enrolled/");

/* ───────── FETCH SUBJECTS (FOR DROPDOWN) ───────── */

export const fetchSubjects = () =>
  api.get("/subjects/");

/* ───────── CREATE COURSE (ADMIN) ───────── */

export const createCourse = (data) =>
  api.post("/courses/", data);

/* ───────── ASSIGN / ENROLL ───────── */

export const assignTeacher = (courseId, teacherId) =>
  api.post(`/courses/${courseId}/assign-teacher/`, {
    teacher_id: teacherId,
  });

export const enrollStudent = (courseId, studentId) =>
  api.post(`/courses/${courseId}/enroll/`, {
    student_id: studentId,
  });
