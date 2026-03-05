import { create } from "zustand";
import {
  Withdraw,
  type WithdrawResponse,
  type WithdrawResponseById,
  type WithdrawResponseByIdStatus,
} from "../types/withdraw.api";
import { withdrawApi } from "../api";
import type { AxiosError } from "axios";

export interface WithdrawStore {
  withdraw: Withdraw;
  loading: boolean;
  error: string | null;
  idempotencyKey: string;
  message: string;
  withdrawStatus: {
    status: WithdrawResponseByIdStatus | null;
    id: number | null;
  };

  // Getters
  disableWithdraw: () => boolean;

  // Actions
  submitWithdraw: () => Promise<WithdrawResponse | undefined>;
  getWithdrawalsById: (id: number) => Promise<void>;
  clearError: () => void;
  changeWithdraw: (withdraw: Partial<Withdraw>) => void;
}

export const useWithdrawStore = create<WithdrawStore>((set, get) => ({
  withdraw: {
    amount: "",
    destination: "",
    confirm: false,
  },
  withdrawStatus: {
    status: null,
    id: null,
  },
  loading: false,
  error: "",
  message: "",
  idempotencyKey: crypto.randomUUID(),

  disableWithdraw: () => {
    let disable = false;
    const { withdraw, loading } = get();
    const { amount, destination, confirm } = withdraw;

    disable ||= amount === "0" || !amount;
    disable ||= !destination.length;
    disable ||= !confirm;
    disable ||= loading;

    return disable;
  },

  getWithdrawalsById: async (id: number) => {
    try {
      const withdrawStatus = await withdrawApi.getWithdrawalsById(id);

      set({ withdrawStatus });
    } catch (err: unknown) {
      const error = err as AxiosError;

      set({ error: error.message });
    }
  },

  submitWithdraw: async () => {
    set({ loading: true, error: null });

    try {
      const { withdraw, idempotencyKey } = get();
      const response = await withdrawApi.withdrawals({
        ...withdraw,
        idempotency_key: idempotencyKey,
      });

      set({ idempotencyKey: crypto.randomUUID() });

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      const payload = {
        error: "",
        loading: false,
      };

      if (error.status === 409) {
        payload.error = error409;
      } else {
        payload.error = error.message;
      }

      set(payload);
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  changeWithdraw: (changes) =>
    set(({ withdraw }) => ({
      withdraw: {
        ...withdraw,
        ...changes,
      },
    })),
}));

const error409 =
  "Запрос с таким ключом уже был обработан или Операция уже выполнена";
