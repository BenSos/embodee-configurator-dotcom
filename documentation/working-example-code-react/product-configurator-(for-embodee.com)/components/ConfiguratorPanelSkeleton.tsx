import React from 'react';

const ConfiguratorPanelSkeleton: React.FC = () => {
    // Helper component for a single skeleton group
    const SkeletonGroup = () => (
        <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-3">
                <div className="w-full aspect-square rounded-md bg-gray-200"></div>
                <div className="w-full aspect-square rounded-md bg-gray-200"></div>
                <div className="w-full aspect-square rounded-md bg-gray-200"></div>
                <div className="w-full aspect-square rounded-md bg-gray-200"></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full animate-pulse">
            {/* Skeleton Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
            {/* Skeleton Body */}
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <SkeletonGroup />
                <SkeletonGroup />
                <SkeletonGroup />
            </div>
        </div>
    );
};

export default ConfiguratorPanelSkeleton;
