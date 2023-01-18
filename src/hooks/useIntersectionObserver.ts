import { useEffect, useRef } from "react"

type IntersectionProps = {
  callback: () => void;
  shouldObserve?: boolean;
}
/**
 * custom hook so run a callback based on interaction observers
 * @param param0 callback function that is ran when react node is in screen and whether or not the callback function should run
 * @param options 
 */
export const useItersectionObserver = ({ callback, shouldObserve }: IntersectionProps, options: IntersectionObserverInit) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        callback();
      }
    }, options);
    if (observerRef.current && shouldObserve) {
      observer.observe(observerRef.current);
    }
    // clean up
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [observerRef, callback, options]);

  return observerRef;
}