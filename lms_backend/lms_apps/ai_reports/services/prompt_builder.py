def build_academic_prompt(student_name, marks_data):

    marks_text = ", ".join(
        f"{item['subject']} ({item['marks']})"
        for item in marks_data
    )

    return f"""
Give short academic feedback for student {student_name}.
Marks: {marks_text}.

Provide:
- Summary
- Strengths
- Weakness
- Improvement tips

Keep it under 200 words.
"""
