const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000';

interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PayloadImage {
  url: string;
  alt: string;
  sizes?: {
    thumbnail?: { url: string };
    card?: { url: string };
    hero?: { url: string };
  };
}

// --- Collection Types ---

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  excerpt?: string;
  content?: unknown; // Lexical rich text JSON
  featuredImage?: PayloadImage;
  author?: string;
  tags?: { tag: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  eventType: 'jiu-jitsu-style' | 'skull-games' | 'community';
  date: string;
  endDate?: string;
  location?: string;
  description?: unknown;
  featuredImage?: PayloadImage;
  externalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technique {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  position: string;
  gi: 'gi' | 'no-gi' | 'both';
  videoUrl?: string;
  description?: unknown;
  thumbnail?: PayloadImage;
  createdAt: string;
  updatedAt: string;
}

export interface Ambassador {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  photo?: PayloadImage;
  academy?: string;
  socialLinks?: { platform: string; url: string }[];
  sortOrder: number;
}

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  logo?: PayloadImage;
  website?: string;
  description?: string;
  tier: 'title' | 'gold' | 'silver' | 'community';
  sortOrder: number;
}

// --- Global Types ---

export interface SiteSettings {
  heroHeadline?: string;
  heroSubtext?: string;
  heroBackground?: PayloadImage;
  heroCta?: { label?: string; url?: string };
  featuredTechnique?: Technique;
  featuredArticles?: Article[];
}

export interface MissionContent {
  headline?: string;
  statement?: unknown;
  skullGamesPartnership?: unknown;
  profitCommitment?: unknown;
  donateCta?: { label?: string; url?: string };
}

// --- API helpers ---

async function fetchPayload<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// Collections

export async function getArticles(limit = 10, page = 1) {
  return fetchPayload<PayloadResponse<Article>>(
    `/articles?where[status][equals]=published&sort=-createdAt&limit=${limit}&page=${page}`,
  );
}

export async function getArticleBySlug(slug: string) {
  const res = await fetchPayload<PayloadResponse<Article>>(
    `/articles?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
  );
  return res?.docs[0] ?? null;
}

export async function getEvents(limit = 10, page = 1) {
  return fetchPayload<PayloadResponse<Event>>(
    `/events?where[status][equals]=published&sort=date&limit=${limit}&page=${page}`,
  );
}

export async function getEventBySlug(slug: string) {
  const res = await fetchPayload<PayloadResponse<Event>>(
    `/events?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
  );
  return res?.docs[0] ?? null;
}

export async function getTechniques(limit = 50, page = 1) {
  return fetchPayload<PayloadResponse<Technique>>(
    `/techniques?where[status][equals]=published&sort=-createdAt&limit=${limit}&page=${page}`,
  );
}

export async function getAmbassadors() {
  return fetchPayload<PayloadResponse<Ambassador>>(
    `/ambassadors?sort=sortOrder&limit=100`,
  );
}

export async function getSponsors() {
  return fetchPayload<PayloadResponse<Sponsor>>(
    `/sponsors?sort=sortOrder&limit=100`,
  );
}

// Globals

export async function getSiteSettings() {
  return fetchPayload<SiteSettings>(`/globals/site-settings`);
}

export async function getMissionContent() {
  return fetchPayload<MissionContent>(`/globals/mission-content`);
}
