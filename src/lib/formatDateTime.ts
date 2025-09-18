export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString();

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
