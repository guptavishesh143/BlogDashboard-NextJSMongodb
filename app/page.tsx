'use client';

import Image from 'next/image';
import Link from "next/link";
import HeaderWithCategories from "@/app/components/HeaderWithCategories";
import LikeButton from "@/app/components/LikeButton";
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Post {
  _id: string;
  title: string;
  content?: string;
  body?: string;
  image?: string;
  category?: string;
  likes?: string[];
  likesCount?: number;
  commentsCount?: number;
}

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const userId = session?.user ? String((session.user as { id?: string; sub?: string }).id || (session.user as { id?: string; sub?: string }).sub || 'anonymous') : 'anonymous';

  useEffect(() => {
    const initializeData = async () => {
      const params = await searchParams;
      const category = params.category || 'all';
      setSelectedCategory(category);

      // Load categories
      const categoriesRes = await fetch(`http://localhost:3000/api/categories`, { cache: "no-store" });
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.data || []);

      // Load initial posts
      await loadPosts(category, 1, false);
    };

    initializeData();
  }, []);

  const loadPosts = async (category: string, pageNum: number, append: boolean = false) => {
    try {
      const postsRes = await fetch(`http://localhost:3000/api/posts?page=${pageNum}&limit=12`, { cache: "no-store" });
      const postsData = await postsRes.json();
      const newPosts: Post[] = postsData.data || [];
      const pagination = postsData.pagination || { hasMore: false };

      // Filter posts by category if needed
      const filteredPosts = category && category !== 'all'
        ? newPosts.filter(post => post.category === category || post.category?.startsWith(category + '/'))
        : newPosts;

      if (append) {
        setPosts(prev => [...prev, ...filteredPosts]);
      } else {
        setPosts(filteredPosts);
      }

      setHasMore(pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setPosts([]);
    setPage(1);
    await loadPosts(category, 1, false);
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await loadPosts(selectedCategory, page + 1, true);
  };

  const flatCategories: (Category & { indent: number })[] = [];
  const addCategory = (cat: Category, indent = 0) => {
    flatCategories.push({ ...cat, indent });
    if (cat.children) {
      for (const child of cat.children) {
        addCategory(child, indent + 1);
      }
    }
  };
  categories.forEach(cat => addCategory(cat));
  const allCategories = [{ _id: 'all', name: 'All', slug: 'all', indent: 0 }, ...flatCategories];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderWithCategories allCategories={allCategories} selectedCategory={selectedCategory} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderWithCategories
        allCategories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Featured Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {posts.map((post) => (
            <div key={post._id} className="relative group">
              <Link href={`/posts/${post._id}`} className="block">
                <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Dummy image */}
                  <div className="aspect-square">
                    <Image
                    width={100}
                    height={100}
                      src={post?.image || "/placeholder.jpg"}
                      alt="Blog post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <LikeButton
                  entityId={post._id}
                  entityType="post"
                  userId={userId}
                  initialLikesCount={post.likesCount || 0}
                  initialIsLiked={false}
                />
                <div className="flex items-center gap-1 bg-white bg-opacity-90 rounded-full px-2 py-1 shadow-sm">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No posts available yet.
            </p>
          </div>
        )}

        {hasMore && (
          <div className="text-center py-8">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load More Posts'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
