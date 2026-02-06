import { useState } from "react";
import { createCourse } from "./courses.api";

const CourseForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    subject: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCourse(form);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create course", err);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label>Course Code</label><br />
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Course Name</label><br />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Subject</label><br />
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
