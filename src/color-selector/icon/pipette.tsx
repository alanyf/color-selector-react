import React from 'react';

export default (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h16v16H0z" />
      <path
        stroke="#000"
        strokeWidth="1.25"
        d="M9.798 4.471l-6.331 6.33a2.782 2.782 0 0 0-.815 1.983l.003.422c0 .208.17.374.377.373l.406-.002a2.797 2.797 0 0 0 1.962-.82l6.342-6.341L9.798 4.47z"
        opacity=".64"
      />
      <path
        fill="#5C5C5C"
        d="M8.383 3.587l4.243 4.243-.884.884L7.5 4.471zM14.104 2.088a2 2 0 0 1 0 2.828l-2.12 2.121-2.83-2.828 2.122-2.121a2 2 0 0 1 2.828 0z"
      />
    </g>
  </svg>
);
