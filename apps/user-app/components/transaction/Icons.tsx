// Icons Fetched from https://heroicons.com/
export function HomeIcon({ size }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

export function TransferIcon({ size }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  );
}

export function TransactionsIcon({ size }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function P2PIcon({ size }: any) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={size}
    >
      <path
        d="M3.75 6.5V17.25C3.75 18.9069 5.09315 20.25 6.75 20.25H19.25C19.8023 20.25 20.25 19.8023 20.25 19.25V9.75C20.25 9.19772 19.8023 8.75 19.25 8.75H16.25M3.75 6.5C3.75 7.74264 4.75736 8.75 6 8.75H16.25M3.75 6.5C3.75 4.98122 4.98122 3.75 6.5 3.75H15.4688C15.9002 3.75 16.25 4.09978 16.25 4.53125V8.75"
        strokeLinecap="square"
        strokeLinejoin="round"
        className="fill-transparent stroke-current"
      ></path>
      <path
        d="M16 14.5C16 14.7761 15.7761 15 15.5 15C15.2239 15 15 14.7761 15 14.5C15 14.2239 15.2239 14 15.5 14C15.7761 14 16 14.2239 16 14.5Z"
        strokeLinejoin="round"
        className="fill-current stroke-current"
      ></path>
    </svg>
  );
}
