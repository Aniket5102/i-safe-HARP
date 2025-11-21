
export type App = {
  name: string;
  subtitle?: string;
  imageUrl: string;
  imageHint: string;
  href: string;
};

export const apps: App[] = [
  { 
    name: 'QUALITY SUSA', 
    subtitle: 'SUSA Reporting for i-Safe Quality Team', 
    imageUrl: 'https://storage.googleapis.com/project-spark-previews-prod/2a07c393-274e-4b72-9114-6330a11c1d00/image_0.png',
    imageHint: 'quality safety logo', 
    href: '#' 
  },
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
    imageUrl: 'https://picsum.photos/seed/risk-analysis/200/200', 
    imageHint: 'risk analysis', 
    href: '/harp' 
  },
  { 
    name: 'BBS', 
    subtitle: 'Behavioral Based Safety',
    imageUrl: 'https://picsum.photos/seed/safety-observation/200/200', 
    imageHint: 'safety observation', 
    href: '#' 
  },
  {
    name: 'Test HARP',
    subtitle: 'This is to be used for HARP Report Development',
    imageUrl: 'https://picsum.photos/seed/report-development/200/200',
    imageHint: 'report development',
    href: '/harp'
  }
];
