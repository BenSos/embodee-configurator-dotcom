import React from 'react';
interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
    className?: string;
    overlayClassName?: string;
}
/**
 * Loading overlay component that shows a spinner over content when loading
 */
export declare const LoadingOverlay: React.FC<LoadingOverlayProps>;
export default LoadingOverlay;
//# sourceMappingURL=LoadingOverlay.d.ts.map