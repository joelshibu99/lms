import { useState } from "react";
import { generateTeacherReport } from "../../api/aiReports.api";

import Page from "../../components/common/Page";
import { Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";

const TeacherAIReportsPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const res = await generateTeacherReport();
      setResult(res.ai_feedback || "AI report generated.");
    } catch {
      setResult("Failed to generate AI report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="AI Reports"
      subtitle="Generate AI performance insights"
      actions={
        <Button variant="contained" onClick={handleGenerate}>
          Generate Report
        </Button>
      }
    >
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>AI Performance Report</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Generating report...</Typography>
          ) : (
            <Typography whiteSpace="pre-line">{result}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default TeacherAIReportsPage;
