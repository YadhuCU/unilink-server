exports.dateFormatter = (date) => {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
};
