export const calculateTime = (inputDateStr) => {
  // Assuming the input date string is in UTC format
  const inputDate = new Date(inputDateStr);

  // Get current date
  const currentDate = new Date();

  // Set up date formats for Brazil
  const timeFormat = { hour: "numeric", minute: "numeric" };
  const dateFormat = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short"
  };

  // Check if it's today, tomorrow, or more than one day ago
  if (
    inputDate.getUTCDate() === currentDate.getUTCDate() &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    // Today: Convert to AM/PM format
    const ampmTime = inputDate.toLocaleTimeString("pt-BR", timeFormat);
    return ampmTime;
  } else if (
    inputDate.getUTCDate() === currentDate.getUTCDate() - 1 &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    // Tomorrow: Show "Ontem"

    return "Ontem";
  } else if (
    Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24)) > 1 &&
    Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24)) <= 7
  ) {
    const timeDifference = Math.floor(
      (currentDate - inputDate) / (1000 * 60 * 60 * 24)
    );

    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() - timeDifference);

    const daysOfWeek = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];
    const targetDay = daysOfWeek[targetDate.getDay()];

    return `${targetDay}, ${targetDate.toLocaleDateString("pt-BR", dateFormat)}`;
  } else {
    // More than 7 days ago: Show date in DD/MM/YYYY format
    const formattedDate = inputDate.toLocaleDateString("pt-BR", dateFormat);
    return formattedDate;
  }
};
