import LikeButton from "@/app/components/LikeButton";
import CommentsSection from "@/app/components/CommentsSection";
import { getCurrentSession } from "@/lib/session";
import HeaderWithCategories from "@/app/components/HeaderWithCategories";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  const userId = session ? String((session.user as any)?.id || (session.user as any)?.sub || 'anonymous') : 'anonymous';

  const res = await fetch(`http://localhost:3000/api/posts/${id}`);
  if (!res.ok) {
    return <div>Post not found</div>;
  }
  const post = await res.json();

  const categoriesRes = await fetch('http://localhost:3000/api/categories');
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData.data || [];
  const flatCategories: (any & { indent: number })[] = [];
  const addCategory = (cat: any, indent = 0) => {
    flatCategories.push({ ...cat, indent });
    if (cat.children) {
      for (const child of cat.children) {
        addCategory(child, indent + 1);
      }
    }
  };
  categories.forEach((cat: any) => addCategory(cat));
  const allCategories = [{ _id: 'all', name: 'All', slug: 'all', indent: 0 }, ...flatCategories];

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderWithCategories allCategories={allCategories} />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <article className="bg-white rounded-lg shadow-sm mb-12">
          <div className="p-12">
            <h1 className="text-5xl font-bold mb-8 text-gray-900 leading-tight">{post.title}</h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-lg">
                  {(post.authorId || post.userId || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">User {post.authorId || post.userId}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt || post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="prose prose-xl max-w-none text-gray-800 leading-relaxed mb-8">
              <p className="text-xl leading-relaxed">{post.content || post.body}</p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{post.likes?.length || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Share</span>
                </button>
              </div>
              <div className="text-gray-400 text-sm">
                {Math.ceil((post.content || post.body || '').length / 200)} min read
              </div>
            </div>
          </div>
        </article>

        <CommentsSection entityId={id} entityType="post" userId={userId} />
      </div>
    </div>
  );
}
