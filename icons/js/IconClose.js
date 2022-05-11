import { palette } from 'theme/palette';

export function IconClose({ size = 22, hexColor = palette.primary.main }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3955 8.59491L8.60352 13.3869"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3971 13.3898L8.60107 8.59277"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3345 1.75018H6.66549C3.64449 1.75018 1.75049 3.88918 1.75049 6.91618V15.0842C1.75049 18.1112 3.63549 20.2502 6.66549 20.2502H15.3335C18.3645 20.2502 20.2505 18.1112 20.2505 15.0842V6.91618C20.2505 3.88918 18.3645 1.75018 15.3345 1.75018Z"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
