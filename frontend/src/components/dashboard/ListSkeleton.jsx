import React, { memo } from 'react';

const ListSkeleton = memo(({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex items-center space-x-3 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
        </div>
      </div>
    ))}
  </div>
));

ListSkeleton.displayName = 'ListSkeleton';

export default ListSkeleton;