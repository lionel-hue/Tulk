import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for infinite scroll
 * @param {Function} loadMore - Function to call when bottom is reached
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether a load is currently in progress
 * @returns {Object} - { sentinelRef, rootRef }
 */
export const useInfiniteScroll = (loadMore, hasMore, isLoading) => {
  const sentinelRef = useRef(null);
  const rootRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [loadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const options = {
      root: rootRef.current,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [handleIntersect]);

  return { sentinelRef, rootRef };
};

export default useInfiniteScroll;
