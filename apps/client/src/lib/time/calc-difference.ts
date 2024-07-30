const millisecondsPerHour = 60 * 60 * 1000;

export function getDateDifference(
  startDate: string | Date,
  endDate: string | Date,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInMilliseconds = end.getTime() - start.getTime();

  const days = Math.floor(
    differenceInMilliseconds / (24 * millisecondsPerHour),
  );
  const hours = Math.floor(
    (differenceInMilliseconds % (24 * millisecondsPerHour)) /
      millisecondsPerHour,
  );
  console.log(differenceInMilliseconds);
  return { days, hours };
}
