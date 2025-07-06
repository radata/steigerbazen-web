import { createDirectus, rest } from "@directus/sdk";

// Define your schema interface
export interface Global {
  id: number;
  title: string;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  featured_image: string | null;
  alt_text: string;
  date_created: string;
  date_updated: string;
  status: string;
  seo: {
    title: string;
    meta_description: string;
    no_index: boolean;
    no_follow: boolean;
    og_image: string;
  };
}

export interface PostParams {
  slug: string;
}

export interface PostData {
  id: number;
  status: string;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  content: string;
  featured_image: string | null;
  alt_text: string;
  structured_data: Record<string, any>;
  last_modified: string | null;
  seo: {
    title: string;
    meta_description: string;
    no_index: boolean;
    no_follow: boolean;
    og_image: string;
  };
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  meta_description: string;
  date_created: string;
  status: string;
}

export interface PageData {
  id: string;
  title: string;
  content: string;
  slug: string;
}

export interface PageParams {
  slug: string;
}

export interface Schema {
  global: Global[];
  posts: Post[];
}

const directus = createDirectus<Schema>(process.env.DIRECTUS_URL).with(rest());

export default directus;
