export const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").toUpperCase();
};