import { palette } from 'theme/palette';

export function IconNotification({
  size = 22,
  hexColor = palette.grey[600],
  opacity = 0.6,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 16.8476C16.6392 16.8476 19.2481 16.1242 19.5 13.2205C19.5 10.3188 17.6812 10.5054 17.6812 6.94511C17.6812 4.16414 15.0452 1 11 1C6.95477 1 4.31885 4.16414 4.31885 6.94511C4.31885 10.5054 2.5 10.3188 2.5 13.2205C2.75295 16.1352 5.36177 16.8476 11 16.8476Z"
        stroke={hexColor}
        strokeOpacity={opacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3889 19.8572C12.0247 21.372 9.89672 21.3899 8.51953 19.8572"
        stroke={hexColor}
        strokeOpacity={opacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
