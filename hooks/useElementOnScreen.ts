"use client";

import { useEffect, useRef, useState, RefObject } from "react";

export const useElementOnScreen = (
  options?: IntersectionObserverInit
): [RefObject<HTMLDivElement | null>, boolean] => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentElem = containerRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options]);

  return [containerRef, isVisible];
};

export default useElementOnScreen;
