import { useEffect, useState } from "react";
import axios from "../../api/axios";

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
} from "@mui/material";

const StudentDashboard = () => {
  const [marks, setMarks] = useState([]);
  const [reports, setReports] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingMarks, setLoadingMarks] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    const fetchStudentMarks = async () => {
      try {
        const res = await axios.get("academics/student-history/");
        setMarks(res.data?.results || []);
      } catch {
        setMarks([]);
      } finally {
        setLoadingMarks(false);
      }
    };

    const fetchAIReports = async () => {
      try {
        const res = await axios.get("ai-reports/my-reports/");
        setReports(res.data || []);
      } catch {
        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    };

    const fetchAttendance = async () => {
  try {
    const res = await axios.get("attendance/my-attendance/");
    setAttendance(res.data || []);
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
     ATTENDANCE CALCULATIONS
  ========================== */
  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.is_present).length;
  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Math.round((presentCount / totalClasses) * 100);

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Student Dashboard
      </Typography>

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Subjects
              </Typography>
              <Typography variant="h5">
                {loadingMarks ? "—" : marks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Attendance %
              </Typography>
              <Typography variant="h5">
                {loadingAttendance ? "—" : `${attendancePercentage}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MARKS TABLE */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Marks
      </Typography>

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
                  <TableCell>{row.remarks || "-"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 4 }} />

      {/* ATTENDANCE TABLE */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Attendance
      </Typography>

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

      <Divider sx={{ my: 4 }} />

      {/* AI FEEDBACK */}
      <Typography variant="h6" gutterBottom>
        AI Feedback
      </Typography>

      {loadingReports && <Typography>Loading AI feedback...</Typography>}

      {!loadingReports && reports.length === 0 && (
        <Typography>No AI feedback available yet.</Typography>
      )}

      {!loadingReports &&
        reports.map((report) => (
          <Card key={report.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Generated on{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </Typography>

              <Typography sx={{ mt: 1 }} whiteSpace="pre-line">
                {report.ai_feedback}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </>
  );
};

export default StudentDashboard;
