import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { fetchStudentRisk } from "../../api/analytics.api";
import RiskBadge from "../../components/common/RiskBadge";


import Page from "../../components/common/Page";

import {
  Typography,
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

const TeacherStudentsPage = () => {
  const { courseId } = useParams();
  const [studentsWithRisk, setStudentsWithRisk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadStudents = async () => {
    try {
      const res = await axios.get(
        `courses/${courseId}/enrollments/`
      );

      const studentList = res.data?.results || res.data || [];

      // Fetch risk for each student
      const enrichedStudents = await Promise.all(
        studentList.map(async (student) => {
          try {
            const risk = await fetchStudentRisk(student.id);
            return {
              ...student,
              risk_label: risk.risk_label,
              risk_probability: risk.risk_probability,
            };
          } catch (err) {
            return { ...student, risk_label: "UNKNOWN" };
          }
        })
      );

      setStudentsWithRisk(enrichedStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudentsWithRisk([]);
    } finally {
      setLoading(false);
    }
  };

  loadStudents();
}, [courseId]);


  return (
    <Page
      title="Course Students"
      subtitle={`Students enrolled in Course ID: ${courseId}`}
    >
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Risk</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : studentsWithRisk.length === 0 ? (

                  <TableRow>
                    <TableCell colSpan={3}>

                      <Typography align="center" color="text.secondary">
                        No students enrolled
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentsWithRisk.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>
                        {s.full_name || `${s.first_name} ${s.last_name}`}
                      </TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>
                      <RiskBadge label={s.risk_label} />
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

export default TeacherStudentsPage;
