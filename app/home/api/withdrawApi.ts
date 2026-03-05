import { http } from "../../http";

import type {
  WithdrawPayload,
  WithdrawResponse,
  WithdrawResponseById,
} from "../types/withdraw.api";

const apiUrl = "withdrawals";

export const withdrawApi = {
  withdrawals: (data: WithdrawPayload) =>
    http.post<WithdrawResponse>(apiUrl, data),

  getWithdrawalsById: async (id: number) =>
    http.get<WithdrawResponseById>(`${apiUrl}/${id}`),
};
