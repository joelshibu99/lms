import { useEffect, useState } from "react";
import Page from "../../components/common/Page";
import { fetchTeacherRiskOverview } from "../../api/risk.api";
import RiskBadge from "../../components/common/RiskBadge";

import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Skeleton,
} from "@mui/material";

const TeacherRiskPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTeacherRiskOverview();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load risk data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <Page
      title="Student Risk Monitor"
      subtitle="AI-powered academic risk detection"
    >
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Avg Marks</TableCell>
                  <TableCell>Attendance %</TableCell>
                  <TableCell>Risk</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>{s.full_name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.average_marks}</TableCell>
                      <TableCell>{s.attendance_percentage}%</TableCell>
                      <TableCell>
                        <RiskBadge label={s.risk_status.label} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Page>
  );
};

export default TeacherRiskPage;
