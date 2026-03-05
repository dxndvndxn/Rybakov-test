"use client";

import { WithdrawInput } from "../withdrawInput/WithdrawInput";
import { keepNonNegativeNumber } from "../../utils";
import { WithdrawButton } from "../withdrawButton";
import { selectDisableWithdraw, useWithdrawStore } from "../../store";
import { ChangeEvent } from "react";
import Image from "next/image";

export const WithdrawForm = () => {
  const disableWithdraw = useWithdrawStore(selectDisableWithdraw);

  const {
    withdraw,
    changeWithdraw,
    error,
    submitWithdraw,
    getWithdrawalsById,
    loading,
    withdrawStatus,
  } = useWithdrawStore();

  const changeConfirm = ({ target }: ChangeEvent<HTMLInputElement>) => {
    changeWithdraw({ confirm: target.checked });
  };

  const changeAmount = ({ target }: ChangeEvent<HTMLInputElement>) => {
    changeWithdraw({ amount: target.value });
  };

  const changeDestination = ({ target }: ChangeEvent<HTMLInputElement>) => {
    changeWithdraw({ destination: target.value });
  };

  const onSubmitForm = async () => {
    try {
      const response = await submitWithdraw();

      if (response?.id) {
        await getWithdrawalsById(response.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-y-3 flex-col">
      <form className="flex gap-y-3 flex-col" data-testid="withdraw-form">
        <h2 className="flex gap-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Withdraw with Rybakov
          <Image
            priority
            src="/ryba.webp"
            alt="Rybakov logo"
            width={50}
            height={20}
          />
        </h2>

        <div className={"text-red-500"}>{error}</div>

        <WithdrawInput
          label="Amount"
          name="amount"
          type="text"
          value={withdraw.amount}
          valueAdapter={keepNonNegativeNumber}
          onBlur={changeAmount}
        />

        <WithdrawInput
          value={withdraw.destination}
          label="Destination"
          name="destination"
          type="text"
          onBlur={changeDestination}
        />

        <label
          htmlFor="confirm"
          className="flex gap-x-1 font-medium text-sm text-white"
        >
          Confirm
          <input
            onChange={changeConfirm}
            type="checkbox"
            name="confirm"
            id="confirm"
            checked={withdraw.confirm}
          />
        </label>

        <WithdrawButton
          type="button"
          loading={loading}
          disabled={disableWithdraw}
          text="Withdraw"
          onClick={onSubmitForm}
        />
      </form>

      {withdrawStatus.id && (
        <div className="flex gap-y-3 flex-col">
          <div className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Withdrawal id: {withdrawStatus.id}
          </div>
          <div className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Withdrawal status: {withdrawStatus.status}
          </div>
        </div>
      )}
    </div>
  );
};
