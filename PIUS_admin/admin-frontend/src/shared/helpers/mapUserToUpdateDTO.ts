import type { User } from "../../entities/user/model/types";
import type { UserUpdateRequest } from "../../entities/user/api/userApi";

export const mapUserToUpdateDTO = (user: User): UserUpdateRequest => {
  return {
    login: user.login ?? undefined,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    patronymic: user.patronymic ?? undefined,
    dateOfBirth: user.dateOfBirth ?? undefined,
    city: user.city ?? undefined,
    telegram: user.telegram ?? undefined,
    telegramChatId: user.telegramChatId ?? undefined,
    isSeller: user.isSeller,
  };
};
