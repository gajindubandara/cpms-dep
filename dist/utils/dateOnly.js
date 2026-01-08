export const getDateOnly = () => {
  return new Date().toISOString().split("T")[0];
};
