export const REPUTATION_DOMAIN = {
  environment: {
    name: 'environment',
  },
  personal: {
    name: 'personal',
  },
  community: {
    name: 'community',
  },
  professional: {
    name: 'professional',
  },
};

export const REPUTATION_RATING = {
  negative: {
    direction: false,
    name: 'negative',
  },
  positive: {
    direction: true,
    name: 'positive',
  },
};

export const JURISDICTION_ROLE = {
  admin: {
    id: '1',
    name: 'admin',
  },
  member: {
    id: '2',
    name: 'member',
  },
  judge: {
    id: '3',
    name: 'judge',
  },
};

export const CASE_STAGE = {
  draft: {
    id: 0,
    name: 'draft',
  },
  open: {
    id: 1,
    name: 'open',
  },
  verdict: {
    id: 2,
    name: 'verdict',
  },
  closed: {
    id: 6,
    name: 'closed',
  },
  cancelled: {
    id: 7,
    name: 'cancelled',
  },
};

export const CASE_ROLE = {
  admin: {
    id: '1',
    name: 'admin',
  },
  subject: {
    id: '2',
    name: 'subject',
  },
  plaintiff: {
    id: '3',
    name: 'plaintiff',
  },
  judge: {
    id: '4',
    name: 'judge',
  },
  witness: {
    id: '5',
    name: 'witness',
  },
  affected: {
    id: '6',
    name: 'affected',
  },
};
