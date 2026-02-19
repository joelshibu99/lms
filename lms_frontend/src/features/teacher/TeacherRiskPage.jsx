import { useEffect, useState, Fragment } from "react";
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
  Button,
  Collapse,
  Box,
  Typography,
  Chip
} from "@mui/material";

const TeacherRiskPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

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
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Avg Marks</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attendance %</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Risk</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Action
                  </TableCell>
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
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  students.map((s) => (
                    <Fragment key={s.id}>
                      <TableRow hover>
                        <TableCell>{s.full_name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.average_marks}</TableCell>
                        <TableCell>{s.attendance_percentage}%</TableCell>
                        <TableCell>
                          <RiskBadge label={s.risk_status} />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === s.id ? null : s.id
                              )
                            }
                          >
                            {expandedRow === s.id ? "Hide" : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expand Section */}
                      <TableRow>
                        <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={expandedRow === s.id} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                p: 3,
                                backgroundColor: "rgba(255,255,255,0.03)",
                                borderRadius: 2,
                                mt: 1
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Risk Probability
                              </Typography>

                              <Chip
                                label={`${(s.risk_probability * 100).toFixed(1)}%`}
                                color="primary"
                                sx={{ mb: 2 }}
                              />

                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Risk Factors
                              </Typography>

                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {s.risk_reasons?.map((reason, index) => (
                                  <Chip
                                    key={index}
                                    label={reason}
                                    color="warning"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
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
