
import * as React from "react";
import Image from "next/image";

const AsianPaintsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <Image
    src="https://storage.googleapis.com/project-spark-previews-prod/2a07c393-274e-4b72-9114-6330a11c1d00/image_0.png"
    alt="Asian Paints Logo"
    width={130}
    height={20}
    {...props}
  />
);

export default AsianPaintsLogo;
