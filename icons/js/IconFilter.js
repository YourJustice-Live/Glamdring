import { palette } from 'theme/palette';

export function IconFilter({ size = 22, hexColor = palette.primary.main }) {
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
        d="M3.56517 2C2.70108 2 2 2.71286 2 3.5904V4.52644C2 5.17647 2.24719 5.80158 2.68936 6.27177L7.5351 11.4243L7.53723 11.4211C8.47271 12.3788 8.99905 13.6734 8.99905 15.0233V19.5952C8.99905 19.9007 9.31869 20.0957 9.58399 19.9516L12.3436 18.4479C12.7602 18.2204 13.0201 17.7784 13.0201 17.2984V15.0114C13.0201 13.6691 13.539 12.3799 14.466 11.4243L19.3117 6.27177C19.7528 5.80158 20 5.17647 20 4.52644V3.5904C20 2.71286 19.3 2 18.4359 2H3.56517Z"
        stroke={hexColor}
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
