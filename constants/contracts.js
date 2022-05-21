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
  draft: 0,
  open: 1,
  verdict: 2,
  closed: 6,
  cancelled: 7,
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
