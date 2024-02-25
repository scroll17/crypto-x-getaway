const USERS_ONLINE_DURING_MS = 1000 * 60 * parseFloat(process.env.USER_ONLINE_DURING_MIN!);

export const calcUsersOnline = (lastActivity: string) => {
  const currentDate: Date = new Date();

  const prevDate: Date = new Date(currentDate.getTime() - USERS_ONLINE_DURING_MS);
  const lastActivityDate: Date = new Date(lastActivity);

  return prevDate > lastActivityDate;
};
