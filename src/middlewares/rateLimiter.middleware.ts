import rateLimit from "express-rate-limit";

const DEFAULT_ERROR_BODY = {
  success: false,
  message: "Too many requests, please try again later.",
};

const createLimiter = (options: { windowMs: number; max: number; message?: any }) =>
  rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: options.message ?? DEFAULT_ERROR_BODY,
  });

// Very strict on authentication to reduce brute-force risk.
export const loginRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after 15 minutes.",
  },
});

export const signupRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message:
      "Too many signup attempts from this IP, please try again after some time.",
  },
});

// Shared limiter used across many authenticated flows:
// patient bookings, doctor appointment management, chat, reports, etc.
export const globalRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
});

// Optional generic limiters for future use (not yet wired).
export const unauthenticatedRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export const authenticatedRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
