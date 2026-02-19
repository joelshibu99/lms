import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "../../api/axios";
import Page from "../../components/common/Page";

const StudentPerformance = () => {
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const marksRes = await axios.get("academics/student-history/");
        const attendanceRes = await axios.get("attendance/my-attendance/");

        const marksData =
          Array.isArray(marksRes.data)
            ? marksRes.data
            : marksRes.data?.results || [];

        const attendanceData =
          Array.isArray(attendanceRes.data)
            ? attendanceRes.data
            : attendanceRes.data?.results || [];

        setMarks(marksData);
        setAttendance(attendanceData);
      } catch (err) {
        console.error("Marks/Attendance fetch failed:", err);
        setMarks([]);
        setAttendance([]);
      }

      try {
        const reportsRes = await axios.get("ai-reports/my-reports/");

        const reportsData =
          Array.isArray(reportsRes.data)
            ? reportsRes.data
            : reportsRes.data?.results || [];

        setReports(reportsData);
      } catch (err) {
        console.warn("AI reports not available:", err);
        setReports([]);
      }

      setLoading(false);
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
            (sum, m) =>
              sum + Number(m.marks || m.marks_obtained || 0),
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
        {/* KPI CARDS */}
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
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* AI REPORTS TABLE */}
      <Typography variant="h6" gutterBottom>
        AI Academic Reports
      </Typography>

      <Paper elevation={1}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No AI reports available yet
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(
                        report.created_at
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          setSelectedReport(report)
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* VIEW DIALOG */}
      <Dialog
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Academic Feedback</DialogTitle>
        <DialogContent dividers>
          <Typography whiteSpace="pre-line">
            {selectedReport?.ai_feedback}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReport(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default StudentPerformance;
