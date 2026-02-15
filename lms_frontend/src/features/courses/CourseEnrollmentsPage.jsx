import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  fetchCourseEnrollments,
  enrollStudentToCourse,
  removeEnrollment,
} from "../../api/courses.api";

import { fetchCollegeUsers } from "../../api/users.api";


import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const CourseEnrollmentsPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const course = location.state?.course;

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD DATA
  ========================== */

  const loadData = async () => {
    setLoading(true);
    try {
      const [enrollmentRes, usersRes] = await Promise.all([
        fetchCourseEnrollments(courseId),
        fetchCollegeUsers(),
      ]);

      setEnrollments(enrollmentRes.data || []);

      const onlyStudents =
        usersRes.filter((u) => u.role === "STUDENT");

      setStudents(onlyStudents);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load enrollments",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     ENROLL STUDENT
  ========================== */

  const handleEnroll = async () => {
    if (!selectedStudent) return;

    try {
      await enrollStudentToCourse(courseId, {
        student_id: selectedStudent,
      });

      await loadData();
      setSelectedStudent("");

      setSnackbar({
        open: true,
        message: "Student enrolled successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.detail ||
          "Enrollment failed",
        severity: "error",
      });
    }
  };

  /* =========================
     REMOVE ENROLLMENT
  ========================== */

  const handleRemove = async (enrollmentId) => {
    try {
      await removeEnrollment(enrollmentId);

      await loadData();

      setSnackbar({
        open: true,
        message: "Student removed",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to remove student",
        severity: "error",
      });
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Enrollments
      </Typography>

      <Typography color="text.secondary" mb={2}>
        Course: {course?.code} - {course?.name}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* ENROLL FORM */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Select Student"
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(e.target.value)
              }
              fullWidth
            >
              {students.map((student) => (
                <MenuItem
                  key={student.id}
                  value={student.id}
                >
                  {student.full_name || student.email}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={handleEnroll}
            >
              Enroll
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ENROLLED STUDENTS TABLE */}
      <Card>
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : enrollments.length === 0 ? (
            <Typography color="text.secondary">
              No students enrolled.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {enrollments.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        {e.full_name || e.email}
                      </TableCell>
                      <TableCell>{e.email}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemove(e.id)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((s) => ({
            ...s,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseEnrollmentsPage;
