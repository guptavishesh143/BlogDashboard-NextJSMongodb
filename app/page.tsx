import Image from 'next/image';
import Link from "next/link";
import HeaderWithCategories from "@/app/components/HeaderWithCategories";

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
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const [postsRes, categoriesRes] = await Promise?.all([
    fetch(`http://localhost:3000/api/posts`, { cache: "no-store" }),
    fetch(`http://localhost:3000/api/categories`, { cache: "no-store" }),
  ]);
  const posts: Post[] = await postsRes.json();
  console.log("posts", posts);
  const categoriesData = await categoriesRes.json();
  const categories: Category[] = categoriesData.data || [];
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
  const filteredPosts = selectedCategory ? posts.filter(post => post.category === selectedCategory || post.category?.startsWith(selectedCategory + '/')) : posts;

  return (
    <div className="min-h-screen bg-white">
      <HeaderWithCategories allCategories={allCategories} selectedCategory={selectedCategory} />

      {/* Featured Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredPosts.slice(0, 4).map((post) => (
            <Link key={post._id} href={`/posts/${post._id}`} className="group">
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
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No posts available yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
