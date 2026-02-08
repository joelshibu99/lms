import { useEffect, useState } from "react";
import { createCourse, fetchSubjects } from "./courses.api";

import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Snackbar,
  Alert,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const CourseForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    subject: "",
    is_active: true,
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD SUBJECTS
  ========================== */

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetchSubjects();
        setSubjects(res.data || []);
      } catch {
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  /* =========================
     HANDLERS
  ========================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCourse({
        ...form,
        subject: Number(form.subject), // IMPORTANT
      });

      setSnackbar({
        open: true,
        message: "Course created successfully",
        severity: "success",
      });

      onSuccess?.();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.detail ||
          "Failed to create course",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Typography variant="h6">
            Create New Course
          </Typography>

          <TextField
            label="Course Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Course Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* ---------- SUBJECT DROPDOWN ---------- */}
          <TextField
            select
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            fullWidth
            disabled={loadingSubjects}
          >
            {loadingSubjects ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : subjects.length === 0 ? (
              <MenuItem value="" disabled>
                No subjects available
              </MenuItem>
            ) : (
              subjects.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name}
                </MenuItem>
              ))
            )}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
            }
            label="Active"
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={
                loading ||
                !form.code ||
                !form.name ||
                !form.subject
              }
            >
              {loading ? "Saving…" : "Save Course"}
            </Button>
          </Stack>
        </Stack>
      </Box>

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
    </>
  );
};

export default CourseForm;
