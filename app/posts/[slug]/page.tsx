import directus from '../../../lib/directus';
import { readItems } from '@directus/sdk';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { PostData } from '../../../lib/directus'; // Adjust the import path as needed


interface PageParams {
  slug: string;
}

async function getPost(slug: string): Promise<PostData | null> {
  try {
    const posts = await directus.request(
      readItems('posts', {
        filter: {
          slug: {
            _eq: slug
          },
          status: {
            _eq: 'published'
          }
        },
        limit: 1
      })
    );
    
    return posts.length > 0 ? posts[0] as PostData : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seo?.title || post.meta_title || post.title,
    description: post.seo?.meta_description || post.meta_description,
    keywords: post.keywords,
    robots: {
      index: !post.seo?.no_index,
      follow: !post.seo?.no_follow,
    },
    openGraph: {
      title: post.seo?.title || post.meta_title || post.title,
      description: post.seo?.meta_description || post.meta_description,
      images: post.seo?.og_image ? [`${process.env.DIRECTUS_URL}/assets/${post.seo.og_image}`] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {post.featured_image && (
        <div className="mb-8">
          <img 
            src={`${process.env.DIRECTUS_URL}/assets/${post.seo.og_image}`}
            alt={post.alt_text || post.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 text-sm">
          <time dateTime={post.date_created}>
            Published on {new Date(post.date_created).toLocaleDateString()}
          </time>
          {post.date_updated !== post.date_created && (
            <span className="ml-4">
              Updated on {new Date(post.date_updated).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}