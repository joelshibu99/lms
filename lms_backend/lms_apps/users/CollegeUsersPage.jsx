import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { fetchCollegeUsers } from "./users.api";

const CollegeUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCollegeUsers().then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={1}>
        College Users
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage teachers and students here.
      </Typography>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_active ? "Active" : "Inactive"}
                      color={u.is_active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollegeUsersPage;
