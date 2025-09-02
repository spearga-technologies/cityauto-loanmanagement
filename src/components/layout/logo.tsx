import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g fill="url(#logo-gradient)">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
        <path d="M168,100a40,40,0,0,0-80,0,8,8,0,0,0,16,0,24,24,0,1,1,24,24,8,8,0,0,0,0,16,40,40,0,0,0,40-40Z" />
        <path d="M152,152H112a8,8,0,0,0-8,8,8,8,0,0,0,8,8h40a8,8,0,0,0,8-8A8,8,0,0,0,152,152Z" />
      </g>
    </svg>
  );
}
