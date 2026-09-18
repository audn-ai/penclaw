import {
  i as RetryOptions,
  n as RetryConfig,
  r as RetryInfo,
  u as resolveRetryConfig,
} from "../index-btg4aXoO.js";
import { t as retryAsync } from "../retry-CQF84Vfu.js";
import {
  i as createRateLimitRetryRunner,
  n as RetryRunner,
  r as createChannelApiRetryRunner,
  t as CHANNEL_API_RETRY_DEFAULTS,
} from "../retry-policy-CqIYNIO8.js";
export {
  type RetryConfig,
  type RetryInfo,
  type RetryOptions,
  type RetryRunner,
  CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS,
  createRateLimitRetryRunner,
  createChannelApiRetryRunner as createTelegramRetryRunner,
  resolveRetryConfig,
  retryAsync,
};
