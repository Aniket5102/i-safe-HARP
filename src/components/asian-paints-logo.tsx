
import * as React from "react";
import Image from "next/image";

const AsianPaintsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Asian_Paints_Logo.svg"
    alt="Asian Paints Logo"
    width={130}
    height={20}
    {...props}
  />
);

export default AsianPaintsLogo;
