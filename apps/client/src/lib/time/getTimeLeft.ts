export function getTimeLeft(start: string | Date, end: string | Date) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  const hasStarted = currentDate.getTime() >= startDate.getTime();
  const hasEnded = currentDate.getTime() >= endDate.getTime();
  let timeLeft: number;

  if (!hasStarted) {
    timeLeft = startDate.getTime() - currentDate.getTime();
  } else if (!hasEnded) {
    timeLeft = endDate.getTime() - currentDate.getTime();
  } else {
    timeLeft = 0;
  }

  return {
    hasStarted,
    hasEnded,
    timeLeft,
  };
}
