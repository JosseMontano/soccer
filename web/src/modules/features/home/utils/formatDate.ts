export const formatDate = (date: string, hour?: string) => {
  const MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  let _date = new Date(`${date.split("T")[0]}T00:00:00Z`);

  if (isNaN(_date.getTime())) {
    return "-";
  }

  const day = _date.getUTCDate();
  const month = MONTHS[_date.getUTCMonth()];
  const year = _date.getUTCFullYear();

  return `${day} ${month}, ${year}` + (hour ? ` - ${hour.slice(0, 5)}` : "");
};
