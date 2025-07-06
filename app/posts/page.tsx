import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import Link from 'next/link';
import type { Post } from '../../lib/directus'; // Adjust the import path as needed

async function getPosts() {
  try {
    const posts = await directus.request(
      readItems('posts', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_created']
      })
    );
    return { data: posts, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export default async function PostsPage() {
  const { data: posts, error } = await getPosts();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Posts</h1>
        <p className="text-red-600">Error loading posts: {error.message}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Posts</h1>
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <div className="grid gap-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Link 
                href={`/posts/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {post.title}
              </Link>
            </h2>
            {post.meta_description && (
              <p className="text-gray-600 mb-4">{post.meta_description}</p>
            )}
            <div className="text-sm text-gray-500">
              Published on {new Date(post.date_created).toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
