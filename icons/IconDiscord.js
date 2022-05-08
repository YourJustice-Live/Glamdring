import { palette } from 'theme/palette';

export function IconDiscord({ size = 22, hexColor = palette.primary.main }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.5327 6.22463C20.735 9.38457 21.8226 12.9489 21.416 17.0522C21.4143 17.0696 21.4051 17.0855 21.3905 17.096C19.7227 18.2911 18.1069 19.0164 16.5138 19.4974C16.5013 19.501 16.4881 19.5008 16.4758 19.4968C16.4635 19.4927 16.4528 19.485 16.4453 19.4748C16.0772 18.975 15.7428 18.4481 15.4498 17.8948C15.433 17.8622 15.4483 17.823 15.4829 17.8101C16.0141 17.6148 16.5191 17.3807 17.0049 17.1036C17.0432 17.0817 17.0456 17.0282 17.0103 17.0025C16.9072 16.9278 16.805 16.8493 16.7073 16.7708C16.689 16.7563 16.6644 16.7535 16.6437 16.7632C13.4898 18.1845 10.0349 18.1845 6.84372 16.7632C6.823 16.7542 6.79838 16.7573 6.78059 16.7715C6.68309 16.85 6.58071 16.9278 6.47858 17.0025C6.44324 17.0282 6.44616 17.0817 6.48468 17.1036C6.97047 17.3755 7.47552 17.6148 8.00592 17.8111C8.04029 17.8239 8.05662 17.8622 8.03956 17.8948C7.75291 18.4488 7.41848 18.9757 7.04359 19.4755C7.02726 19.4957 7.00045 19.505 6.9751 19.4974C5.38951 19.0164 3.77369 18.2911 2.10596 17.096C2.09206 17.0855 2.08207 17.0689 2.08061 17.0515C1.74082 13.5022 2.43331 9.90837 4.96124 6.22392C4.96734 6.21417 4.9766 6.20655 4.98732 6.20203C6.23118 5.64493 7.56376 5.23507 8.95654 5.001C8.98189 4.9972 9.00724 5.00861 9.0204 5.0305C9.19249 5.32784 9.3892 5.70916 9.52228 6.02077C10.9904 5.80193 12.4814 5.80193 13.9802 6.02077C14.1133 5.71582 14.3032 5.32784 14.4745 5.0305C14.4806 5.01964 14.4901 5.01094 14.5016 5.00565C14.513 5.00035 14.5259 4.99872 14.5384 5.001C15.9319 5.23579 17.2645 5.64564 18.5074 6.20203C18.5183 6.20655 18.5274 6.21417 18.5327 6.22463V6.22463ZM10.2686 12.9732C10.284 11.9239 9.5001 11.0556 8.51609 11.0556C7.54011 11.0556 6.76377 11.9163 6.76377 12.9732C6.76377 14.0298 7.55547 14.8904 8.51609 14.8904C9.4923 14.8904 10.2686 14.0298 10.2686 12.9732V12.9732ZM16.748 12.9732C16.7634 11.9239 15.9795 11.0556 14.9957 11.0556C14.0195 11.0556 13.2431 11.9163 13.2431 12.9732C13.2431 14.0298 14.0348 14.8904 14.9957 14.8904C15.9795 14.8904 16.748 14.0298 16.748 12.9732V12.9732Z"
        fill={hexColor}
      />
    </svg>
  );
}
