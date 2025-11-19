'use client';

import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  indent: number;
}

interface HeaderWithCategoriesProps {
  allCategories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function HeaderWithCategories({ allCategories, selectedCategory, onCategoryChange }: HeaderWithCategoriesProps) {
  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              BLOG
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Login"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
              <Link
                href="/posts/create"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Create new post"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto">
              {allCategories.map((category) => {
                const isSelected = category._id === 'all' ? !selectedCategory : selectedCategory === category.slug;
                const categorySlug = category._id === 'all' ? 'all' : category.slug;

                if (onCategoryChange) {
                  return (
                    <button
                      key={category.slug}
                      onClick={() => onCategoryChange(categorySlug)}
                      className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        isSelected
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      style={{ paddingLeft: `${category.indent * 16}px` }}
                    >
                      {category.name}
                    </button>
                  );
                }

                return (
                  <Link
                    key={category.slug}
                    href={category._id === 'all' ? '/' : `?category=${category.slug}`}
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      isSelected
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    style={{ paddingLeft: `${category.indent * 16}px` }}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}