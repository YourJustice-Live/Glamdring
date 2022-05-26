import { POST_HOG_EVENT, POST_HOG_PROPERTY } from 'constants/analytics';
import { IS_LOCALHOST_ANALYTICS_DISABLED } from 'constants/features';
import posthog from 'posthog-js';

export function isAnalyticsEnabled() {
  const isLocalhost =
    window.location.href.includes('127.0.0.1') ||
    window.location.href.includes('localhost');
  const isAnalyticsEnabled =
    (IS_LOCALHOST_ANALYTICS_DISABLED && !isLocalhost) ||
    !IS_LOCALHOST_ANALYTICS_DISABLED;
  return isAnalyticsEnabled;
}

/**
 * Init analytics.
 */
export function initAnalytics() {
  if (isAnalyticsEnabled()) {
    posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
      api_host: 'https://app.posthog.com',
    });
  }
}

export function handlePageViewEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.pageView);
  }
}

export function handleConnectAccountEvent(account) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.connectedAccount, {
      [POST_HOG_PROPERTY.account]: account.toLowerCase(),
    });
    posthog.alias(account.toLowerCase());
  }
}

/**
 * Handle error.
 *
 * @param {Error} error Error object.
 */
export function handleCatchErrorEvent(error) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.catchedError, {
      [POST_HOG_PROPERTY.errorMessage]: error?.message,
      [POST_HOG_PROPERTY.errorStack]: error?.stack,
    });
  }
}
