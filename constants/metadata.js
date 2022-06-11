import {
  IconAccountBlocks,
  IconBadService,
  IconBadServiceTwo,
  IconBreachOfContract,
  IconCaringForNature,
  IconContribution,
  IconEquality,
  IconFinancialPyramids,
  IconGreatService,
  IconIllegalCopy,
  IconLie,
  IconNetworkingHelp,
  IconPersonalityStealing,
  IconRecommendations,
  IconScam,
  IconSecurityWeaknesses,
  IconSuccessfulContracts,
  IconXenophobia,
} from 'icons/laws';

export const PROFILE_TRAIT_TYPE = {
  firstName: 'First Name',
  lastName: 'Last Name',
  description: 'A little bit about yourself',
  email: 'Email',
  site: 'Site',
  twitter: 'Twitter',
  telegram: 'Telegram',
  facebook: 'Facebook',
  instagram: 'Instagram',
};

export const POST_TYPE = {
  evidence: 'evidence',
  comment: 'comment',
  confirmation: 'confirmation',
};

export const CONFIRMATION_TYPE = {
  confirmation: 'confirmation',
  denial: 'denial',
};

export const ICON = {
  default: {
    name: 'Default',
    icon: (size) => <IconEquality width={size} height={size} />,
  },
  caringForNature: {
    name: 'CaringForNature',
    icon: (size) => <IconCaringForNature width={size} height={size} />,
  },
  contribution: {
    name: 'Contribution',
    icon: (size) => <IconContribution width={size} height={size} />,
  },
  greatService: {
    name: 'GreatService',
    icon: (size) => <IconGreatService width={size} height={size} />,
  },
  networkingHelp: {
    name: 'NetworkingHelp',
    icon: (size) => <IconNetworkingHelp width={size} height={size} />,
  },
  recommendations: {
    name: 'Recommendations',
    icon: (size) => <IconRecommendations width={size} height={size} />,
  },
  successfulContracts: {
    name: 'SuccessfulContracts',
    icon: (size) => <IconSuccessfulContracts width={size} height={size} />,
  },
  accountBlocks: {
    name: 'AccountBlocks',
    icon: (size) => <IconAccountBlocks width={size} height={size} />,
  },
  badService: {
    name: 'BadService',
    icon: (size) => <IconBadService width={size} height={size} />,
  },
  badServiceTwo: {
    name: 'BadServiceTwo',
    icon: (size) => <IconBadServiceTwo width={size} height={size} />,
  },
  breachOfContract: {
    name: 'BreachOfContract',
    icon: (size) => <IconBreachOfContract width={size} height={size} />,
  },
  financialPyramids: {
    name: 'FinancialPyramids',
    icon: (size) => <IconFinancialPyramids width={size} height={size} />,
  },
  illegalCopy: {
    name: 'IllegalCopy',
    icon: (size) => <IconIllegalCopy width={size} height={size} />,
  },
  lie: {
    name: 'Lie',
    icon: (size) => <IconLie width={size} height={size} />,
  },
  personalityStealing: {
    name: 'personalityStealing',
    icon: (size) => <IconPersonalityStealing width={size} height={size} />,
  },
  scam: {
    name: 'Scam',
    icon: (size) => <IconScam width={size} height={size} />,
  },
  securityWeaknesses: {
    name: 'SecurityWeaknesses',
    icon: (size) => <IconSecurityWeaknesses width={size} height={size} />,
  },
  xenophobia: {
    name: 'Xenophobia',
    icon: (size) => <IconXenophobia width={size} height={size} />,
  },
};
