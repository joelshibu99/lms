import { useEffect, useState } from "react";
import axios from "../../api/axios";

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
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";

const TeacherAIReportsPage = () => {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    student: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [result, setResult] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD STUDENTS
  ========================== */

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await axios.get("accounts/teacher-students/");
        setStudents(res.data?.results || []);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadStudents();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* =========================
     GENERATE REPORT
  ========================== */

  const handleGenerate = async () => {
    if (!form.student) return;

    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("ai-reports/generate/", {
        student_id: Number(form.student),
      });

      setResult(res.data.ai_feedback);
      showSnackbar("AI report generated successfully");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to generate AI report", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="AI Reports"
      subtitle="Generate AI academic summary for a student"
    >
      <Grid container spacing={4}>
        {/* FORM */}
        <Grid item xs={12} md={5}>
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2.5}>
                <TextField
                  select
                  label="Student"
                  value={form.student}
                  onChange={(e) =>
                    setForm({ student: e.target.value })
                  }
                  fullWidth
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.full_name || s.email}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={loading || !form.student}
                >
                  {loading ? "Generating..." : "Generate AI Summary"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RESULT PANEL */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            AI Performance Summary
          </Typography>

          <Paper elevation={1} sx={{ p: 3, minHeight: 300 }}>
            {pageLoading ? (
              <Skeleton height={200} />
            ) : loading ? (
              <Typography>Generating summary...</Typography>
            ) : result ? (
              <Typography whiteSpace="pre-line">
                {result}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                Select a student and generate a summary.
              </Typography>
            )}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default TeacherAIReportsPage;
