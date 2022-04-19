export const REPUTATION_DOMAIN_ID = {
  environment: 0,
  personal: 1,
  community: 2,
  professional: 3,
};

export const REPUTATION_RATING_ID = {
  negative: 0,
  positive: 1,
};

export const DEFAULT_ADD_REPUTATION_AMOUNT = 1;

export const JURISDICTION_ROLE = {
  member: 'member',
  judge: 'judge',
  admin: 'admin',
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
