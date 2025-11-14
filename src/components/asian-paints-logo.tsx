import * as React from "react";

const AsianPaintsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 20"
    width="100"
    height="20"
    {...props}
  >
    <path
      fill="#D43734"
      d="M11.3,4.4c-0.5-0.3-1.1-0.4-1.8-0.4c-1.4,0-2.6,0.5-3.5,1.5S4.2,7.5,4.2,9c0,1.5,0.6,2.8,1.8,3.7 c1.2,0.9,2.7,1.4,4.5,1.4c0.6,0,1.2-0.1,1.8-0.2V9.8h-3.3V8.1h5.1V14c-1,0.6-2.1,0.9-3.4,0.9c-2.4,0-4.3-0.8-5.8-2.3 s-2.2-3.5-2.2-5.7c0-2.2,0.7-4,2.1-5.5s3.2-2.2,5.5-2.2c1.2,0,2.3,0.3,3.3,0.8L11.3,4.4z"
    />
    <path
      fill="#662584"
      d="M20.8,5.8h-3.3v8h-1.9V5.8h-3.3V4h8.5V5.8z"
    />
    <path
      fill="#FBB03B"
      d="M27.5,13.8h-1.9V5.5c0-0.7-0.1-1.2-0.4-1.6c-0.3-0.4-0.8-0.6-1.5-0.6c-0.9,0-1.6,0.4-2,1.1l-0.6-1 C21.6,4.5,22.5,4,23.6,4c1.1,0,1.9,0.3,2.5,1c0.6,0.6,0.9,1.5,0.9,2.6V13.8z"
    />
    <path
      fill="#43A047"
      d="M37.8,13.8H36l-3.3-4.8l-1.3,1.5v3.3h-1.9V4h1.9v4.5l4.3-4.5h2.2l-3.5,3.9L37.8,13.8z"
    />
    <text
      x="40"
      y="14"
      fontFamily="sans-serif"
      fontSize="12"
      fill="#333"
    >
      asianpaints
    </text>
  </svg>
);

export default AsianPaintsLogo;
