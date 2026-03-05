import type { WithdrawStore } from "./withdrawStore";

export const selectDisableWithdraw = (state: WithdrawStore) =>
  state.disableWithdraw();
