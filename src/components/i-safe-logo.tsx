import * as React from 'react';
import Image from 'next/image';

const ISafeLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Image
    src="https://img.freepik.com/premium-vector/safety-first-logo-design-shield-helmet-construction-safely-workplace-factory-logo-banner_521317-1381.jpg"
    alt="i-safe Logo"
    width={40}
    height={40}
    {...props}
  />
);

export default ISafeLogo;
