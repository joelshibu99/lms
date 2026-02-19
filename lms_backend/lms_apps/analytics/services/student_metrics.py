from django.db.models import Avg
from academics.models import Marks
from attendance.models import Attendance


def get_student_metrics(student):
    """
    Calculate average marks and attendance percentage
    """

    avg_marks = (
        Marks.objects.filter(student=student)
        .aggregate(avg=Avg("marks_obtained"))["avg"] or 0
    )

    attendance_qs = Attendance.objects.filter(student=student)

    total_classes = attendance_qs.count()
    present_classes = attendance_qs.filter(is_present=True).count()

    attendance_percentage = (
        (present_classes / total_classes) * 100
        if total_classes > 0
        else 0
    )

    return {
        "avg_marks": round(avg_marks, 2),
        "attendance": round(attendance_percentage, 2),
    }
