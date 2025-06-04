import { useState } from "react";

export default function SkeletonImage({ src, alt = "프로필 이미지" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
          실패
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded && !error ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
