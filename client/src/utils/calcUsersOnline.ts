const minuteInMilliseconds: number = 60000;
const fiveMinutes: number = 5;
const fiveMinutesInMilliseconds: number = fiveMinutes * minuteInMilliseconds;

export const calcUsersOnline = (lastActivity: string) => {
  const currentDate: Date = new Date();
  const fiveMinutesAgo: Date = new Date(currentDate.getTime() - fiveMinutesInMilliseconds);

  const otherDate: Date = new Date(lastActivity);

  return fiveMinutesAgo > otherDate;
};
