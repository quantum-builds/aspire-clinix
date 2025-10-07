export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString();

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function calculateAge(dateOfBirth: string | Date) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return Math.max(age, 0);
}

export const formatTimeForInput = (date: string | Date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`; // "HH:mm"
};
