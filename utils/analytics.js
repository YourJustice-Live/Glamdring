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

/**
 * Handle page view event.
 */
export function handlePageViewEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.pageView);
  }
}

/**
 * Handle connect account event.
 *
 * @param {string} account Account address.
 */
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
export function handleCatchErrorEvent(error, additional = {}) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.catchedError, {
      [POST_HOG_PROPERTY.errorMessage]: error?.message,
      [POST_HOG_PROPERTY.errorStack]: error?.stack,
      ...additional,
    });
  }
}

/**
 * Handle create own profile event.
 */
export function handleCreateOwnProfileEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.createdOwnProfile);
  }
}

/**
 * Handle edit own profile event.
 */
export function handleEditOwnProfileEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.editedOwnProfile);
  }
}

/**
 * Handle create case event.
 */
export function handleCreateCaseEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.createdCase);
  }
}

/**
 * Handle nominate to case event.
 */
export function handleNominateToCaseEvent(caseId, nominated, role) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.nominatedToCase, {
      [POST_HOG_PROPERTY.case]: caseId,
      [POST_HOG_PROPERTY.nominated]: nominated,
      [POST_HOG_PROPERTY.role]: role,
    });
  }
}

/**
 * Handle add case evidence event.
 *
 * @param {string} caseId Case id (address).
 */
export function handleAddCaseEvidenceEvent(caseId) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.addedCaseEvidence, {
      [POST_HOG_PROPERTY.case]: caseId,
    });
  }
}

/**
 * Handle comment case event.
 *
 * @param {string} caseId Case id (address).
 */
export function handleCommentCaseEvent(caseId) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.commentedCase, {
      [POST_HOG_PROPERTY.case]: caseId,
    });
  }
}

/**
 * Handle confirm case event.
 *
 * @param {string} caseId Case id (address).
 */
export function handleConfirmCaseEvent(caseId) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.confirmedCase, {
      [POST_HOG_PROPERTY.case]: caseId,
    });
  }
}

/**
 * Handle make case verdict event.
 *
 * @param {string} caseId Case id (address).
 */
export function handleMakeCaseVerdictEvent(caseId) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.madeCaseVerdict, {
      [POST_HOG_PROPERTY.case]: caseId,
    });
  }
}

/**
 * Handle cancel case event.
 *
 * @param {string} caseId Case id (address).
 */
export function handleCancelCaseEvent(caseId) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.canceledCase, {
      [POST_HOG_PROPERTY.case]: caseId,
    });
  }
}

/**
 * Handle join jurisdiction event.
 *
 * @param {string} jurisdiction Jurisdiction address.
 */
export function handleJoinJurisdictionEvent(jurisdiction) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.joinedJurisdiction, {
      [POST_HOG_PROPERTY.jurisdiction]: jurisdiction,
    });
  }
}

/**
 * Handle leave jurisdiction event.
 *
 * @param {string} jurisdiction Jurisdiction address.
 */
export function handleLeaveJurisdictionEvent(jurisdiction) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.leftJurisdiction, {
      [POST_HOG_PROPERTY.jurisdiction]: jurisdiction,
    });
  }
}

/**
 * Handle make jurisdiction event.
 */
export function handleMakeJurisdiction() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.madeJurisdiction);
  }
}

/**
 * Handle set jurisdiction uri event.
 *
 * @param {string} jurisdiction Jurisdiction address.
 */
export function handleSetJurisdictionUri(jurisdiction) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.setJurisdictionUri, {
      [POST_HOG_PROPERTY.jurisdiction]: jurisdiction,
    });
  }
}
