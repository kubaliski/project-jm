import React from 'react';

const AdminLayoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Skeleton */}
      <div className="fixed inset-y-0 left-0 bg-gray-900 w-64">
        <div className="flex items-center h-16 px-4 bg-gray-800">
          <div className="w-40 h-6 bg-gray-700 rounded animate-pulse" />
          <div className="ml-auto w-6 h-6 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="px-2 py-4 space-y-4">
          {/* Navigation Items Skeleton */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-gray-700 pb-2">
              <div className="px-3 py-2">
                <div className="h-4 bg-gray-700 rounded w-20 animate-pulse mb-3" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center px-3 py-2">
                      <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
                      <div className="ml-3 h-4 bg-gray-700 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 ml-64">
        {/* Header Skeleton */}
        <header className="bg-white shadow h-16 sticky top-0">
          <div className="flex justify-between items-center px-8 h-full">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </header>

        {/* Dashboard Content Skeleton */}
        <main className="p-8 space-y-6">
          {/* Welcome Paper Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-72 h-8 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Activity Paper Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="py-4">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutSkeleton;