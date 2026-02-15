import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  fetchTeacherMarks,
  createMark,
  updateMark,
} from "../../api/marks.api";

import Page from "../../components/common/Page";

import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Divider,
  Grid,
  Paper,
  Box,
  Snackbar,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const TeacherMarksPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);

  const [form, setForm] = useState({
    student: "",
    subject: "",
    marks_obtained: "",
    remarks: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true);
      try {
        const [studentsRes, subjectsRes, marksRes] =
          await Promise.all([
            axios.get("accounts/teacher-students/"),
            axios.get("academics/teacher-subjects/"),
            fetchTeacherMarks(),
          ]);

        setStudents(studentsRes.data?.results || []);
        setSubjects(subjectsRes.data?.results || []);
        setMarks(marksRes?.results || marksRes || []);
      } catch (error) {
        console.error("Marks page load failed:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const reloadMarks = async () => {
    const res = await fetchTeacherMarks();
    setMarks(res?.results || res || []);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* =========================
     SUBMIT
  ========================== */

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (editingId) {
        await updateMark(editingId, {
          marks_obtained: Number(form.marks_obtained),
          remarks: form.remarks,
        });
        showSnackbar("Marks updated successfully");
      } else {
        await createMark({
          student: Number(form.student),
          subject: Number(form.subject),
          marks_obtained: Number(form.marks_obtained),
          remarks: form.remarks,
        });
        showSnackbar("Marks added successfully");
      }

      setForm({
        student: "",
        subject: "",
        marks_obtained: "",
        remarks: "",
      });
      setEditingId(null);

      await reloadMarks();
    } catch (e) {
      showSnackbar(
        e?.response?.data?.detail || "Failed to save marks",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      student: row.student,
      subject: row.subject,
      marks_obtained: row.marks_obtained,
      remarks: row.remarks || "",
    });
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="Marks Management"
      subtitle="Add and manage student marks"
    >
      <Grid container spacing={4}>
        {/* ---------- FORM ---------- */}
        <Grid item xs={12} md={5}>
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2.5}>
                <TextField
                  select
                  label="Student"
                  value={form.student}
                  onChange={(e) =>
                    setForm({ ...form, student: e.target.value })
                  }
                  fullWidth
                  disabled={editingId !== null}
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.full_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  fullWidth
                  disabled={editingId !== null}
                >
                  {subjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Marks Obtained"
                  value={form.marks_obtained}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // allow digits only

                    if (value === "") {
                      setForm({ ...form, marks_obtained: "" });
                      return;
                    }

                    const numeric = Number(value);

                    if (numeric <= 100) {
                      setForm({ ...form, marks_obtained: numeric });
                    }
                  }}
                  fullWidth
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                />


                <TextField
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !form.student ||
                    !form.subject ||
                    !form.marks_obtained
                  }
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Marks"
                    : "Add Marks"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ---------- MARKS TABLE ---------- */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Marks Entered
          </Typography>

          <Paper elevation={1}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pageLoading ? (
                    [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : marks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography
                          align="center"
                          color="text.secondary"
                        >
                          No marks entered yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    marks.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        onClick={() => handleEdit(row)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{row.student_name}</TableCell>
                        <TableCell>{row.subject_name}</TableCell>
                        <TableCell>{row.marks_obtained}</TableCell>
                        <TableCell>{row.remarks}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar({ ...snackbar, open: false })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default TeacherMarksPage;
