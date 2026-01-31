'use client';
import { useState, useEffect } from "react";

const useMedia = (query: string, defaultState = false): boolean => {
    const [matches, setMatches] = useState(defaultState);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);

        listener();

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
};

export default useMedia;
