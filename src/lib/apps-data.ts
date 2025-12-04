
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
    imageUrl: 'https://picsum.photos/seed/incident-documentation/200/200', 
    imageHint: 'incident documentation', 
    href: '#' 
  },
  { 
    name: 'Permit To Work V2.0',
    subtitle: 'Permit To Work v2.0',
    imageUrl: 'https://picsum.photos/seed/safety-permit/200/200',
    imageHint: 'safety permit', 
    href: '#' 
  },
  { 
    name: 'Permit To Work (Obsolete)',
    subtitle: 'Permit To Work (Obsolete)',
    imageUrl: 'https://picsum.photos/seed/archive-documents/200/200', 
    imageHint: 'archive documents', 
    href: '#'
  },
  { 
    name: 'Employee Check In', 
    subtitle: 'Employee Self Check In for COVID-19', 
    imageUrl: 'https://picsum.photos/seed/worker-check-in/200/200', 
    imageHint: 'worker check in', 
    href: '#' 
  },
  { 
    name: 'Daily Sanitization Checklist', 
    subtitle: 'Employee Sanitization', 
    imageUrl: 'https://picsum.photos/seed/sanitization-checklist/200/200',
    imageHint: 'sanitization checklist', 
    href: '#' 
  },
  { 
    name: 'HARP',
    subtitle: 'Personal Risk Assessment',
    imageUrl: 'https://1.bp.blogspot.com/-CReOKJSBrQo/X8trFT6wFmI/AAAAAAAAEvs/1ryF9Le7aH8fUoRU0BAIVkeDStOFn1liACLcBGAsYHQ/w1200-h630-p-k-no-nu/risk-assessment.png', 
    imageHint: 'risk assessment', 
    href: '/harp',
    dataHref: '/harp/data',
  },
  { 
    name: 'BBS', 
    subtitle: 'Behavioral Based Safety',
    imageUrl: 'https://picsum.photos/seed/safety-observation/200/200', 
    imageHint: 'safety observation', 
    href: '/bbs' 
  },
  {
    name: 'Test HARP',
    subtitle: 'This is to be used for HARP Report Development',
    imageUrl: 'https://1.bp.blogspot.com/-CReOKJSBrQo/X8trFT6wFmI/AAAAAAAAEvs/1ryF9Le7aH8fUoRU0BAIVkeDStOFn1liACLcBGAsYHQ/w1200-h630-p-k-no-nu/risk-assessment.png',
    imageHint: 'report development',
    href: '/harp'
  },
  { 
    name: 'Quality SUSA',
    subtitle: 'Safety in construction and operations',
    imageUrl: 'https://picsum.photos/seed/quality-assurance/200/200', 
    imageHint: 'quality assurance',
    href: '#'
  },
];

    

    
