
export type App = {
  name: string;
  subtitle?: string;
  imageUrl: string;
  imageHint: string;
  href: string;
  dataHref?: string;
};

export const apps: App[] = [
  { 
    name: 'Quality Incident Reporting', 
    subtitle: 'Quality Incident Reporting',
    imageUrl: '/icons/quality-incident-reporting.png', 
    imageHint: 'incident documentation', 
    href: '#' 
  },
  { 
    name: 'Permit To Work V2.0',
    subtitle: 'Permit To Work v2.0',
    imageUrl: '/icons/permit-to-work-v2.png', 
    imageHint: 'safety permit', 
    href: '#' 
  },
  { 
    name: 'Permit To Work (Obsolete)',
    subtitle: 'Permit To Work (Obsolete)',
    imageUrl: '/icons/permit-to-work-obsolete.png', 
    imageHint: 'archive documents', 
    href: '#'
  },
  { 
    name: 'Employee Check In', 
    subtitle: 'Employee Self Check In for COVID-19', 
    imageUrl: '/icons/employee-check-in.png', 
    imageHint: 'worker check in', 
    href: '#' 
  },
  { 
    name: 'Daily Sanitization Checklist', 
    subtitle: 'Employee Sanitization', 
    imageUrl: '/icons/daily-sanitization-checklist.png',
    imageHint: 'sanitization checklist', 
    href: '#' 
  },
  { 
    name: 'HARP',
    subtitle: 'Personal Risk Assessment',
    imageUrl: '/icons/harp.png', 
    imageHint: 'risk assessment', 
    href: '/harp',
    dataHref: '/harp/data',
  },
  { 
    name: 'BBS', 
    subtitle: 'Behavioral Based Safety',
    imageUrl: '/icons/bbs.png', 
    imageHint: 'safety observation', 
    href: '/bbs' ,
    dataHref: '/bbs/data',
  },
  {
    name: 'Test HARP',
    subtitle: 'This is to be used for HARP Report Development',
    imageUrl: '/icons/test-harp.png',
    imageHint: 'report development',
    href: '/harp',
    dataHref: '/harp/data',
  },
  { 
    name: 'Quality SUSA',
    subtitle: 'Safety in construction and operations',
    imageUrl: '/icons/quality-susa.png', 
    imageHint: 'quality assurance',
    href: '/quality-susa',
    dataHref: '/quality-susa/data',
  },
];
