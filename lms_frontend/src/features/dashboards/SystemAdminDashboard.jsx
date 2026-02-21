import { useEffect, useState } from "react";
import { fetchColleges } from "../../api/colleges.api";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

const SystemAdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchColleges();
        setColleges(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const totalColleges = colleges.length;
  const activeColleges = colleges.filter(
  c => c.status === "ACTIVE"
).length;

const inactiveColleges = colleges.filter(
  c => c.status === "INACTIVE"
).length;

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Overview
      </Typography>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Colleges
              </Typography>
              <Typography variant="h5">{totalColleges}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Active Colleges
              </Typography>
              <Typography variant="h5" color="success.main">
                {activeColleges}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Inactive Colleges
              </Typography>
              <Typography variant="h5" color="error.main">
                {inactiveColleges}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Navigation */}
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Manage Colleges
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Create, activate or deactivate colleges.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/system-admin/colleges")}
              >
                Go to Colleges
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Manage Users
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                View and manage all system users.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/system-admin/users")}
              >
                Go to Users
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                System Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                View system-wide performance insights.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/system-admin/analytics")}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SystemAdminDashboard;