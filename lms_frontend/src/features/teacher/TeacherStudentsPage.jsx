import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await axios.get(
          `courses/${courseId}/enrollments/`
        );

        setStudents(res.data?.results || res.data || []);
      } catch (error) {
        console.error("Failed to load students:", error);
        setStudents([]);
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
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography align="center" color="text.secondary">
                        No students enrolled
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>
                        {s.full_name || `${s.first_name} ${s.last_name}`}
                      </TableCell>
                      <TableCell>{s.email}</TableCell>
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
