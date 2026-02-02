import { useEffect, useState } from "react";
import { fetchColleges } from "../../api/colleges.api";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const SystemAdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadColleges = async () => {
      try {
        const data = await fetchColleges(); // returns array
        setColleges(data);
      } catch (error) {
        console.error("Failed to load colleges", error);
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, []);

  return (
    <>
      {/* Page Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Colleges
              </Typography>
              <Typography variant="h5">
                {loading ? "—" : colleges.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                College Admins
              </Typography>
              <Typography variant="h5">—</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Teachers
              </Typography>
              <Typography variant="h5">—</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Students
              </Typography>
              <Typography variant="h5">—</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Colleges Table */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Colleges
      </Typography>

      {loading && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Loading colleges...
        </Typography>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>College Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Admin Email</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!loading && colleges.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No colleges found
              </TableCell>
            </TableRow>
          )}

          {colleges.map((college) => (
            <TableRow key={college.id}>
              <TableCell>{college.name}</TableCell>
              <TableCell>{college.code}</TableCell>
              <TableCell>{college.admin_email || "-"}</TableCell>
              <TableCell>
                <Chip
                  label={college.is_active ? "ACTIVE" : "INACTIVE"}
                  color={college.is_active ? "success" : "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default SystemAdminDashboard;
