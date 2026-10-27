export const PRODUCT_INFO = {
  name: "L's - Auth",
  parentOrg: 'Liji Groups',
  tagline: 'One Identity. Every Application.',
  description: 'Commercial Identity Provider & Enterprise Single Sign-On Platform',
  version: '0.1.0',
} as const;

export const DEFAULT_PORTS = {
  web: 3000,
  api: 3001,
  keycloak: 8080,
  demoAppA: 4001,
  demoAppB: 4002,
} as const;

export const BRAND_COLORS = {
  primary: '#2563EB', // Restrained blue accent
  primaryHover: '#1D4ED8',
  navy: '#0F172A', // Dark navy background
  navyLight: '#1E293B',
  navyCard: '#1E293B',
  navyBorder: '#334155',
  textLight: '#F8FAFC',
  textMuted: '#94A3B8',
} as const;
