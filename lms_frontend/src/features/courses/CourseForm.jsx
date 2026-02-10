import { useEffect, useState } from "react";
import { createCourse, updateCourse } from "./courses.api";

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
} from "@mui/material";

/*
  CourseForm
  - Create + Edit course
  - If `course` prop exists → Edit mode
*/

const CourseForm = ({ course, onClose, onSuccess }) => {
  const isEdit = Boolean(course);

  const [form, setForm] = useState({
    code: "",
    name: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     PREFILL FORM (EDIT MODE)
  ========================== */
  useEffect(() => {
    if (course) {
      setForm({
        code: course.code,
        name: course.name,
        is_active: course.is_active,
      });
    }
  }, [course]);

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
      if (isEdit) {
        await updateCourse(course.id, form);
      } else {
        await createCourse(form);
      }

      setSnackbar({
        open: true,
        message: isEdit
          ? "Course updated successfully"
          : "Course created successfully",
        severity: "success",
      });

      onSuccess?.();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.detail ||
          "Failed to save course",
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
            {isEdit ? "Update Course" : "Create New Course"}
          </Typography>

          <TextField
            label="Course Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            fullWidth
            disabled={isEdit} // 🔒 Code should not change
          />

          <TextField
            label="Course Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />

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
              disabled={loading || !form.name || !form.code}
            >
              {loading
                ? "Saving…"
                : isEdit
                ? "Update Course"
                : "Save Course"}
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
