export interface WithdrawPayload extends Withdraw {
  idempotency_key: string;
}

export interface Withdraw {
  amount: string;
  destination: string;
  confirm: boolean;
}

export interface WithdrawResponse {
  id: number;
}

export interface WithdrawResponseById {
  id: number;
  status: WithdrawResponseByIdStatus;
}

export type WithdrawResponseByIdStatus = "success" | "error" | "pending";
