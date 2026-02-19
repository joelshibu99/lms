import { useEffect, useState } from "react";
import axios from "../../api/axios";

import Page from "../../components/common/Page";
import MetricCard from "../../components/common/MetricCard";

import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PercentIcon from "@mui/icons-material/Percent";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Divider,
  Grid,
  Stack,
  Box,
} from "@mui/material";

/* =========================
   COMPONENT
========================== */

const StudentDashboard = () => {
  const [marks, setMarks] = useState([]);
  const [reports, setReports] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingMarks, setLoadingMarks] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {
    const fetchStudentMarks = async () => {
      try {
        const res = await axios.get("academics/student-history/");
        const marksData =
  Array.isArray(res.data)
    ? res.data
    : res.data?.results || [];

setMarks(marksData);

      } catch {
        setMarks([]);
      } finally {
        setLoadingMarks(false);
      }
    };

    const fetchAIReports = async () => {
  try {
    const res = await axios.get("ai-reports/my-reports/");

    const reportsData =
      Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

    setReports(reportsData);
  } catch {
    setReports([]);
  } finally {
    setLoadingReports(false);
  }
};


    const fetchAttendance = async () => {
  try {
    const res = await axios.get("attendance/my-attendance/");

    const attendanceData =
      Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

    setAttendance(attendanceData);
  } catch {
    setAttendance([]);
  } finally {
    setLoadingAttendance(false);
  }
};


    fetchStudentMarks();
    fetchAIReports();
    fetchAttendance();
  }, []);

  /* =========================
     CALCULATIONS
  ========================== */

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.is_present).length;
  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Math.round((presentCount / totalClasses) * 100);

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="Student Dashboard"
      subtitle="Track your academic progress, attendance, and AI feedback"
    >
      {/* ---------- METRICS ---------- */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Subjects"
            value={loadingMarks ? "—" : marks.length}
            icon={<SchoolIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Classes Attended"
            value={loadingAttendance ? "—" : presentCount}
            icon={<EventAvailableIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Attendance %"
            value={
              loadingAttendance ? "—" : `${attendancePercentage}%`
            }
            icon={<PercentIcon />}
          />
        </Grid>
      </Grid>

      {/* ---------- MARKS ---------- */}
      <Stack spacing={2} sx={{ mt: 5 }}>
        <Typography variant="h6">My Marks</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loadingMarks && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading marks...
                  </TableCell>
                </TableRow>
              )}

              {!loadingMarks && marks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No marks published yet
                  </TableCell>
                </TableRow>
              )}

              {!loadingMarks &&
                marks.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.subject_name}</TableCell>
                    <TableCell>{row.marks}</TableCell>
                    <TableCell>{row.teacher_name}</TableCell>
                    <TableCell>{row.remarks || "—"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Divider sx={{ my: 5 }} />

      {/* ---------- ATTENDANCE ---------- */}
      <Stack spacing={2}>
        <Typography variant="h6">My Attendance</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loadingAttendance && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Loading attendance...
                  </TableCell>
                </TableRow>
              )}

              {!loadingAttendance && attendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}

              {!loadingAttendance &&
                attendance.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.subject_name}</TableCell>
                    <TableCell>
                      {row.is_present ? "Present" : "Absent"}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Divider sx={{ my: 5 }} />

      {/* ---------- AI FEEDBACK ---------- */}
      <Stack spacing={2}>
        <Typography variant="h6">AI Feedback</Typography>

        {loadingReports && (
          <Typography color="text.secondary">
            Loading AI feedback...
          </Typography>
        )}

        {!loadingReports && reports.length === 0 && (
          <Typography color="text.secondary">
            No AI feedback available yet.
          </Typography>
        )}

        {!loadingReports &&
          reports.map((report) => (
            <Card key={report.id} elevation={1}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  Generated on{" "}
                  {new Date(report.created_at).toLocaleDateString()}
                </Typography>

                <Typography sx={{ mt: 1 }} whiteSpace="pre-line">
                  {report.ai_feedback}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Page>
  );
};

export default StudentDashboard;
