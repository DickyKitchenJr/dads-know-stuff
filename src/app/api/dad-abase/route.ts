import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const DEFAULT_JOKES_BATCH_SIZE = 32;
const MAX_JOKES_BATCH_SIZE = 64;
const MAX_SETUP_LENGTH = 10000;
const MAX_PUNCHLINE_LENGTH = 10000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSkip = Number(searchParams.get("skip") ?? "0");
    const rawTake = Number(
      searchParams.get("take") ?? DEFAULT_JOKES_BATCH_SIZE,
    );

    const skip = Number.isFinite(rawSkip)
      ? Math.max(0, Math.floor(rawSkip))
      : 0;
    const take = Number.isFinite(rawTake)
      ? Math.min(MAX_JOKES_BATCH_SIZE, Math.max(1, Math.floor(rawTake)))
      : DEFAULT_JOKES_BATCH_SIZE;

    const jokes = await prisma.dadJoke.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        setup: true,
        punchline: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ jokes }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch dad jokes right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit({
      key: `dad-abase:submit:${clientIp}`,
      maxRequests: MAX_SUBMISSIONS_PER_WINDOW,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfterSeconds),
          },
        },
      );
    }

    const body = (await request.json()) as {
      setup?: string;
      punchline?: string;
      website?: string;
    };

    const setup = body.setup?.trim();
    const punchline = body.punchline?.trim();
    const website = body.website?.trim();

    if (website) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    }

    if (!setup || !punchline) {
      return NextResponse.json(
        { error: "Both setup and punchline are required." },
        { status: 400 },
      );
    }

    if (
      setup.length > MAX_SETUP_LENGTH ||
      punchline.length > MAX_PUNCHLINE_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Setup must be ${MAX_SETUP_LENGTH} characters or less and punchline must be ${MAX_PUNCHLINE_LENGTH} characters or less.`,
        },
        { status: 400 },
      );
    }

    const createdJoke = await prisma.dadJoke.create({
      data: {
        setup,
        punchline,
        approved: false,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Joke submitted for review.",
        submission: createdJoke,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to submit joke right now." },
      { status: 500 },
    );
  }
}
