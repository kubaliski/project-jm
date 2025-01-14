import React from 'react';

export const TableSkeleton = ({ columns, rowCount = 5 }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {[...Array(rowCount)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {columns.map((column, colIndex) => (
            <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              {colIndex === 0 && (
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export const PaginationSkeleton = () => (
  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-9 bg-gray-200 rounded animate-pulse mx-1"></div>
        ))}
      </div>
    </div>
  </div>
);

export default TableSkeleton;