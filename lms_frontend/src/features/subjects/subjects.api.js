import api from "../../api/axios";

export const fetchTeachers = () =>
  api.get("/accounts/users/?role=TEACHER");

export const assignTeacherToSubject = (subjectId, teacherId) =>
  api.post(`/academics/subjects/${subjectId}/assign-teacher/`, {
    teacher_id: teacherId,
  });
