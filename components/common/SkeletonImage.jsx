import { useState } from "react";

export default function SkeletonImage({
  src,
  alt = "이미지",
  className = "",
  objectFit = "cover",
  absolute = false,
  size = "w-full h-full",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const wrapperClass = `${
    absolute ? "absolute inset-0" : "relative"
  } ${size} ${className}`;

  const imageClass = `
    transition-opacity duration-300 w-full h-full 
    object-${objectFit} ${absolute ? "absolute inset-0" : ""} 
    ${loaded && !error ? "opacity-100" : "opacity-0"} 
    ${className}
  `;

  return (
    <div className={`${wrapperClass} ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0 rounded-full" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-gray-100 z-10">
          이미지 불러오기 실패
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={imageClass}
        style={{ willChange: "opacity" }}
      />
    </div>
  );
}
