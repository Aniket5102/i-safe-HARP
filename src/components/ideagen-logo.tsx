
import * as React from "react";

const IdeagenLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 20"
    width="100"
    height="20"
    {...props}
  >
    <text
      x="0"
      y="15"
      fontFamily="sans-serif"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
    >
      Ideagen
      <tspan baselineShift="super" fontSize="10">
        ®
      </tspan>
      <tspan dx="5" fontWeight="normal">
        EHS
      </tspan>
    </text>
  </svg>
);

export default IdeagenLogo;
