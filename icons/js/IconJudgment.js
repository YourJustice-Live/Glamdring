import { palette } from 'theme/palette';

export function IconJudgment({ size = 22, hexColor = palette.primary.main }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8521 17.4586L15.0604 15.6669L15.6664 15.0609L17.4581 16.8526L16.8521 17.4586ZM17.3334 11.2727L11.7276 5.66668L12.3335 5.06068L17.9394 10.6667L17.3334 11.2727ZM8.39334 10.6664L10.6659 8.39369L14.6052 12.3331L12.3326 14.6057L8.39334 10.6664ZM5.06064 12.3333L5.66662 11.7273L11.2724 17.3333L10.6665 17.9393L5.06064 12.3333Z"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="11"
        cy="11"
        r="9.25"
        stroke={hexColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
