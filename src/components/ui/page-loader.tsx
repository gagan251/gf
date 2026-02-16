'use client';

import { SiteLogo } from '../site-logo';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
        <div className="relative flex h-28 w-28 items-center justify-center">
            {/* Spinner track */}
            <div className="absolute h-full w-full rounded-full border-4 border-primary/20"></div>
            {/* Spinner */}
            <div className="absolute h-full w-full rounded-full border-t-4 border-primary animate-spin"></div>
            {/* Pulsing Logo */}
            <div className="animate-gentle-pulse">
                <SiteLogo />
            </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-center text-primary animate-pulse">
            Loading...
        </p>
    </div>
  );
};

export default PageLoader;
