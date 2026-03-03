export const SITE = {
  name: 'Jiu Jitsu Style',
  url: 'https://bjjstyle.com',
  description:
    'The most dynamic, authentic, and culturally connected brand in the global jiu-jitsu community.',
  themeColor: '#c0272d',
  logo: '/images/bjjstyle-logo.png',
} as const;

export const SOCIAL = {
  instagram: {
    url: 'https://www.instagram.com/bjjstyle',
    handle: '@bjjstyle',
    label: 'Instagram',
  },
  facebook: {
    url: 'https://www.facebook.com/bjjstyle',
    handle: '/bjjstyle',
    label: 'Facebook',
  },
  x: {
    url: 'https://x.com/JiuJitsuStyle',
    handle: '@JiuJitsuStyle',
    label: 'X',
  },
} as const;

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Media', href: '/media' },
  { label: 'Store', href: '/store' },
  { label: 'Mission', href: '/mission' },
  { label: 'Contact', href: '/contact' },
] as const;

export const GHL = {
  submitUrl: 'https://backend.leadconnectorhq.com/forms/submit',
  newsletterFormId: 'pBmsDcAtabDnU4kh6X14',
  locationId: 'tVGdeIuZuaSz68wIoKXS',
  recaptchaSiteKey: '6LeDBFwpAAAAAJe8ux9-imrqZ2ueRsEtdiWoDDpX',
} as const;
