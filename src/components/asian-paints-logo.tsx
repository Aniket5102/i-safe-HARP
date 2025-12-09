import * as React from "react";
import Image from "next/image";

const AsianPaintsLogo = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
  <Image
    src="/asian-paints-logo.png"
    alt="Asian Paints Logo"
    width={130}
    height={20}
    {...props}
  />
);

export default AsianPaintsLogo;
