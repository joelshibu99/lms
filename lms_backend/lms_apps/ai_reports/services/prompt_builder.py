def build_academic_prompt(student_name, marks_data):

    marks_text = "\n".join(
        f"- {item['subject']}: {item['marks']}"
        for item in marks_data
    )

    return f"""
Student Name: {student_name}

Marks:
{marks_text}

Write a short academic performance summary in 5 concise bullet points.
Keep it clear and under 120 words.
"""
