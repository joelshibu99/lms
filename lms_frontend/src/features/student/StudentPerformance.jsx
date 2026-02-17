import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";

import axios from "../../api/axios";
import Page from "../../components/common/Page";

const StudentPerformance = () => {
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const marksRes = await axios.get("academics/student-history/");
        const attendanceRes = await axios.get("attendance/my-attendance/");
        const reportsRes = await axios.get("ai-reports/my-reports/");

        // 🔥 EXACT SAME PATTERN AS DASHBOARD
        setMarks(marksRes.data?.results || []);
        setAttendance(attendanceRes.data || []);
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error("Performance fetch failed:", err);
        setMarks([]);
        setAttendance([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     CALCULATIONS
  ========================== */

  const averageMarks =
    marks.length === 0
      ? 0
      : (
          marks.reduce(
            (sum, m) => sum + Number(m.marks || 0),
            0
          ) / marks.length
        ).toFixed(2);

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(
    (a) => a.is_present
  ).length;

  const attendancePercent =
    totalClasses === 0
      ? 0
      : Math.round((presentCount / totalClasses) * 100);

  const latestReport =
    reports.length > 0 ? reports[0] : null;

  /* =========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <Page title="Performance">
        <Grid container spacing={3}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton height={120} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton height={220} />
          </Grid>
        </Grid>
      </Page>
    );
  }

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="Performance"
      subtitle="Academic insights overview"
    >
      <Grid container spacing={3}>
        {/* Average Marks */}
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Average Marks
              </Typography>

              <Typography variant="h4" sx={{ mt: 1 }}>
                {averageMarks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance */}
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Attendance %
              </Typography>

              <Typography variant="h4" sx={{ mt: 1 }}>
                {attendancePercent}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Feedback */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Academic Feedback
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {latestReport ? (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.7,
                }}
              >
                {latestReport.ai_feedback}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                No AI feedback available yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default StudentPerformance;
