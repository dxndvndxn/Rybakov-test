import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { WithdrawForm } from "../WithdrawForm";
import { useWithdrawStore } from "../../../store";
import { withdrawApi } from "../../../api";

jest.mock("../../../api", () => ({
  withdrawApi: {
    withdrawals: jest.fn(),
    getWithdrawalsById: jest.fn(),
  },
}));

describe("WithdrawForm - Double Submit Protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Сбрасываем стор в начальное состояние перед каждым тестом
    useWithdrawStore.setState({
      withdraw: { amount: "", destination: "", confirm: false },
      loading: false,
      error: null,
      withdrawStatus: { status: null, id: null },
      idempotencyKey: "test-uuid-123", // Фиксированный ключ для теста
    });
  });

  test("API вызывается только 1 раз при быстрых кликах (защита от double submit)", async () => {
    const user = userEvent.setup();

    const mockResponse = { id: 42, status: "pending" };

    (withdrawApi.withdrawals as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResponse), 300)),
    );
    (withdrawApi.getWithdrawalsById as jest.Mock).mockResolvedValue({
      status: "pending" as const,
      id: 42,
    });

    // === РЕНДЕР ===
    render(<WithdrawForm />);

    const form = screen.getByTestId("withdraw-form");
    const amountInput = form.querySelector(
      'input[name="amount"]',
    ) as HTMLInputElement;
    const destinationInput = form.querySelector(
      'input[name="destination"]',
    ) as HTMLInputElement;
    const confirmCheckbox = screen.getByRole("checkbox"); // чекбокс обычно находит

    await user.type(amountInput, "100");
    await user.type(destinationInput, "0x1234567890");
    await user.click(confirmCheckbox);

    const submitButton = screen.getByRole("button", { name: /withdraw/i });

    // Проверяем, что кнопка активна перед отправкой
    expect(submitButton).not.toHaveAttribute("disabled");

    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);

    // === ПРОВЕРКИ ===

    // 1. API withdrawals вызван ТОЛЬКО 1 раз (защита сработала)
    await waitFor(
      () => {
        expect(withdrawApi.withdrawals).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 },
    );

    // 2. Проверка, что отправлен правильный idempotency_key
    expect(withdrawApi.withdrawals).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: "100",
        destination: "0x1234567890",
        idempotency_key: "test-uuid-123", // Тот же ключ, что в сторе
      }),
    );

    // 3. После успеха вызван getWithdrawalsById
    await waitFor(() => {
      expect(withdrawApi.getWithdrawalsById).toHaveBeenCalledWith(42);
    });

    // 4. В UI отображается результат
    await waitFor(() => {
      expect(screen.getByText(/Withdrawal id: 42/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Withdrawal status: pending/i),
      ).toBeInTheDocument();
    });
  });
});
