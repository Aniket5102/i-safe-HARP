import * as React from "react";

const AsianPaintsLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="/asian-paints-logo.png"
    alt="Asian Paints Logo"
    width={130}
    height={20}
    {...props}
  />
);

export default AsianPaintsLogo;
