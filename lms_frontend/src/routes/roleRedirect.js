export const roleRedirect = (role) => {
  switch (role) {
    case "SYSTEM_ADMIN":
      return "/system-admin";
    case "COLLEGE_ADMIN":
      return "/college-admin";
    case "TEACHER":
      return "/teacher";
    case "STUDENT":
      return "/student";
    default:
      return "/";
  }
};
