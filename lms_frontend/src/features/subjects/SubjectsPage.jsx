import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import api from "../../api/axios";
import {
  fetchTeachers,
  assignTeacherToSubject,
} from "./subjects.api";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
} from "@mui/material";

/*
  SubjectsPage
  - Lists subjects under a course
  - Admin: create subjects, assign teacher
*/

const SubjectsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const isAdmin = auth?.role === "COLLEGE_ADMIN";

  // ✅ FASTEST: course from navigation state
  const [course] = useState(location.state?.course || null);

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD SUBJECTS
  ========================== */

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/academics/courses/${courseId}/subjects/`
      );
      setSubjects(res.data?.results || []);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load subjects",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD TEACHERS (ADMIN ONLY)
  ========================== */

  useEffect(() => {
  if (!isAdmin) return;

  fetchTeachers().then((res) => {
    const allUsers = res.data?.results || [];

    // ✅ ONLY TEACHERS
    const onlyTeachers = allUsers.filter(
      (u) => u.role === "TEACHER"
    );

    setTeachers(onlyTeachers);
  });
}, [isAdmin]);

  useEffect(() => {
    loadSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  /* =========================
     CREATE SUBJECT (ADMIN)
  ========================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await api.post(
        `/academics/courses/${courseId}/subjects/create/`,
        form
      );

      setSnackbar({
        open: true,
        message: "Subject created successfully",
        severity: "success",
      });

      setForm({ name: "", code: "" });
      loadSubjects();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.detail ||
          "Failed to create subject",
        severity: "error",
      });
    }
  };

  /* =========================
     ASSIGN TEACHER (ADMIN)
  ========================== */

  const handleAssignTeacher = async (subjectId, teacherId) => {
    try {
      await assignTeacherToSubject(subjectId, teacherId);
      loadSubjects();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to assign teacher",
        severity: "error",
      });
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Box p={3}>
      {/* ---------- BREADCRUMBS ---------- */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/courses")}
        >
          Courses
        </Link>
        <Typography color="text.primary">
          Subjects
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" mb={2}>
        Subjects
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* ---------- CREATE SUBJECT (ADMIN ONLY) ---------- */}
      {isAdmin && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Add Subject to Course
              </Typography>

              {/* ✅ COURSE CONTEXT (DISABLED) */}
              <TextField
                label="Course"
                value={
                  course
                    ? `${course.code} — ${course.name}`
                    : `Course ID: ${courseId}`
                }
                fullWidth
                disabled
              />

              <TextField
                label="Subject Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Subject Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                fullWidth
                required
              />

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={!form.name || !form.code}
                >
                  Create Subject
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ---------- SUBJECT LIST ---------- */}
      <Card>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">
              Loading subjects…
            </Typography>
          ) : subjects.length === 0 ? (
            <Typography color="text.secondary">
              No subjects added for this course yet.
            </Typography>
          ) : (
            <Paper elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Teacher</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {subjects.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>{s.code}</TableCell>
                      <TableCell>{s.name}</TableCell>

                      <TableCell>
                        {isAdmin ? (
                          <Select
                            size="small"
                            value={s.teacher || ""}
                            displayEmpty
                            onChange={(e) =>
                              handleAssignTeacher(
                                s.id,
                                e.target.value
                              )
                            }
                            sx={{ minWidth: 180 }}
                          >
                            <MenuItem value="">
                              <em>Unassigned</em>
                            </MenuItem>
                            {teachers.map((t) => (
                              <MenuItem key={t.id} value={t.id}>
                                {t.full_name || t.email}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          s.teacher_name || "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* ---------- SNACKBAR ---------- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((s) => ({ ...s, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((s) => ({ ...s, open: false }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubjectsPage;
