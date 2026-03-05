import { NextRequest, NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let id = 0;

// GET /api/withdrawals/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await sleep(2000);
    id += 1;
    return NextResponse.json(
      {
        id,
        status: "success",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: "Ошибка получения" }, { status: 500 });
  }
}
