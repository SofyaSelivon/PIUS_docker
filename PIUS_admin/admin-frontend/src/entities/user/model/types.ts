export type User = {
  userId: string;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  patronymic?: string | null;
  dateOfBirth?: string | null;
  city?: string | null;
  telegram?: string | null;
  telegramChatId?: string | null;
  isSeller: boolean;
  createdAt: string;
};