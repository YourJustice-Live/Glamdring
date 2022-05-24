import { palette } from 'theme/palette';

export function IconAddUser({ size = 22, hexColor = palette.primary.main }) {
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
        d="M8.87651 14.2062C5.03251 14.2062 1.74951 14.7872 1.74951 17.1152C1.74951 19.4432 5.01251 20.0452 8.87651 20.0452C12.7215 20.0452 16.0035 19.4632 16.0035 17.1362C16.0035 14.8092 12.7415 14.2062 8.87651 14.2062Z"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.8766 10.8859C11.3996 10.8859 13.4446 8.84088 13.4446 6.31788C13.4446 3.79488 11.3996 1.74988 8.8766 1.74988C6.3546 1.74988 4.3096 3.79488 4.3096 6.31788C4.3006 8.83188 6.3306 10.8769 8.8456 10.8859H8.8766Z"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2036 7.66907V11.6791"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2497 9.67395H16.1597"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
