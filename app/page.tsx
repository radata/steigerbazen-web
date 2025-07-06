import directus from '../lib/directus';
import { readItems } from '@directus/sdk';


// https://d511.hollandworx.nl/items/posts
async function getGlobals() {
  try {
    // In Directus SDK v20, you don't need .request() wrapper
    const data = await directus.request(readItems('global'));
    return { data, error: null };
  } catch (error: any) {
    // You can inspect error.code or error.status if needed
    return { data: null, error };
  }
}

export default async function HomePage() {
  const { data: global, error } = await getGlobals();

  if (error) {
    console.log(error.message);
    // Customize the message based on error type if needed
    return (
      <div>
        <h1>Error loading data</h1>
        <p>
          {error?.status === 403
            ? 'You do not have permission to view this content.'
            : 'An unexpected error occurred. Please try again later.'}
        </p>
      </div>
    );
  }

  // Add safety check in case global is an array or undefined
  const globalData = Array.isArray(global) ? global[0] : global;

  return (
    <div>
      <h1>{globalData?.title || 'Welcome'}</h1>
      <p>{globalData?.description || 'No description available'}</p>
    </div>
  );
}