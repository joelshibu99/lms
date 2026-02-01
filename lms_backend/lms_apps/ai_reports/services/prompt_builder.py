def build_academic_prompt(student_name, marks_data):
    """
    marks_data: List of dicts
    [
        {"subject": "Maths", "marks": 78},
        ...
    ]
    """

    marks_text = "\n".join(
        f"- {item['subject']}: {item['marks']}"
        for item in marks_data
    )

    return f"""
You are an experienced academic mentor.

Analyze the following student's performance and provide:
1. Overall performance summary
2. Strengths
3. Weak areas
4. Actionable improvement suggestions

Student Name: {student_name}

Marks:
{marks_text}

Keep feedback concise, constructive, and student-friendly.
"""
