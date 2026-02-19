import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";

import {
  fetchAdminCourses,
  fetchTeacherCourses,
  fetchStudentCourses,
} from "../../api/courses.api";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Skeleton,
  Divider,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

/* =========================
   COMPONENT
========================== */

const CoursesPage = () => {
  const { auth } = useAuth();
  const role = auth?.role;
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  /* =========================
     LOAD COURSES
  ========================== */

  const loadCourses = async () => {
    
    if (!role) return;

    setLoading(true);
    try {
      let res;

      if (role === "COLLEGE_ADMIN") {
        res = await fetchAdminCourses();
      } else if (role === "TEACHER") {
        res = await fetchTeacherCourses();
      } else if (role === "STUDENT") {
        res = await fetchStudentCourses();
      }
        console.log("Student API response:", res.data);
      const coursesData =
  Array.isArray(res?.data)
    ? res.data
    : res?.data?.results || [];

setCourses(coursesData);

    } catch {
      setCourses([]);
      setSnackbar({
        open: true,
        message: "Failed to load courses",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  /* =========================
     RENDER
  ========================== */

  return (
    <Box p={3}>
      {/* ---------- HEADER ---------- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Courses</Typography>

        {role === "COLLEGE_ADMIN" && (
          <Button
            variant="contained"
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
          >
            Create Course
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* ---------- CREATE / EDIT COURSE ---------- */}
      {showForm && role === "COLLEGE_ADMIN" && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <CourseForm
              course={editingCourse}
              onClose={() => {
                setShowForm(false);
                setEditingCourse(null);
              }}
              onSuccess={async () => {
                await loadCourses();
                setShowForm(false);
                setEditingCourse(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* ---------- COURSE LIST ---------- */}
      <Card>
        <CardContent>
          {loading ? (
            <Stack spacing={1}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={32} />
              ))}
            </Stack>
          ) : courses.length === 0 ? (
            <Typography color="text.secondary" align="center">
              {role === "STUDENT"
                ? "You are not enrolled in any courses yet."
                : "No courses available."}
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>

                    <TableCell align="right">
                      {role === "STUDENT" ? "My Tools" : "Actions"}
                    </TableCell>


                  </TableRow>
                </TableHead>

                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} hover>
                      <TableCell>{course.code}</TableCell>

                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() =>
                            navigate(`/courses/${course.id}`)
                          }
                        >
                          {course.name}
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={course.is_active ? "Active" : "Inactive"}
                          color={course.is_active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          {/* ================= ADMIN ================= */}
                          {role === "COLLEGE_ADMIN" && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingCourse(course);
                                  setShowForm(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(`/courses/${course.id}/subjects`, {
                                    state: { course },
                                  })
                                }
                              >
                                Subjects
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(`/courses/${course.id}/enrollments`, {
                                    state: { course },
                                  })
                                }
                              >
                                Enrollments
                              </Button>
                            </>
                          )}

                          {/* ================= TEACHER ================= */}
                          {role === "TEACHER" && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(`/teacher/courses/${course.id}/students`)
                                }
                              >
                                Students
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(`/teacher/courses/${course.id}/marks`)
                                }
                              >
                                Marks
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(`/teacher/courses/${course.id}/attendance`)
                                }
                              >
                                Attendance
                              </Button>

                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  navigate("/teacher/ai-reports")
                                }
                              >
                                AI Reports
                              </Button>
                            </>
                          )}

                          {/* ================= STUDENT ================= */}
                          {role === "STUDENT" && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  navigate(`/courses/${course.id}/subjects`)
                                }
                              >
                                Subjects
                              </Button>

                              
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default CoursesPage;
