import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_ADVICE_LENGTH = 20000;
const MAX_GIVER_LENGTH = 200;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

export async function GET() {
  try {
    const advice = await prisma.dadAdvice.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        advice: true,
        giver: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ advice }, { status: 200 });
  } catch (error) {
    console.error("dadvice GET failed", error);
    return NextResponse.json(
      { error: "Unable to fetch dadvice right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit({
      key: `dadvice:submit:${clientIp}`,
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
      advice?: string;
      giver?: string;
      website?: string;
    };

    const advice = body.advice?.trim();
    const giver = body.giver?.trim() || null;
    const website = body.website?.trim();

    if (website) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    }

    if (!advice) {
      return NextResponse.json(
        { error: "Advice text is required." },
        { status: 400 },
      );
    }

    if (advice.length > MAX_ADVICE_LENGTH) {
      return NextResponse.json(
        { error: "Advice must be 20000 characters or less." },
        { status: 400 },
      );
    }

    if (giver && giver.length > MAX_GIVER_LENGTH) {
      return NextResponse.json(
        { error: "Giver name must be 200 characters or less." },
        { status: 400 },
      );
    }

    const createdAdvice = await prisma.dadAdvice.create({
      data: {
        advice,
        giver,
        approved: false,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Advice submitted for review.",
        submission: createdAdvice,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("dadvice POST failed", error);
    return NextResponse.json(
      { error: "Unable to submit advice right now." },
      { status: 500 },
    );
  }
}
