import { NextRequest, NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let withdrawRandom = 0;
let id = 0;
// GET /api/withdrawals
export async function POST(request: NextRequest) {
  try {
    await sleep(2000);

    if (withdrawRandom % 2 !== 0) {
      withdrawRandom += 1;
      return NextResponse.json({ error: "Конфликт" }, { status: 409 });
    }

    withdrawRandom += 1;
    id += 1;
    return NextResponse.json(
      {
        id: id,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
