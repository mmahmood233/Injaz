"use client";

import { useState } from "react";
import Image from "next/image";
import { GeneratedBookCover } from "./GeneratedBookCover";

interface ApiBookCoverProps {
  coverUrl?: string | null;
  isbn?: string | null;
  titleAr: string;
  author: string;
  sizes?: string;
  imageClassName?: string;
}

export function ApiBookCover({
  coverUrl,
  isbn,
  titleAr,
  author,
  sizes,
  imageClassName = "object-contain p-1",
}: ApiBookCoverProps) {
  const olUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null;

  const initialSrc = coverUrl || olUrl || null;
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [triedOl, setTriedOl] = useState(!coverUrl); // if no coverUrl, we already start with olUrl or null
  const [showGenerated, setShowGenerated] = useState(!initialSrc);

  if (showGenerated) {
    return <GeneratedBookCover titleAr={titleAr} author={author} />;
  }

  if (!src) {
    return <GeneratedBookCover titleAr={titleAr} author={author} />;
  }

  function handleError() {
    // If we're currently showing coverUrl and haven't tried olUrl yet
    if (!triedOl && olUrl) {
      setTriedOl(true);
      setSrc(olUrl);
    } else {
      setShowGenerated(true);
    }
  }

  return (
    <Image
      src={src}
      alt={titleAr}
      fill
      className={imageClassName}
      sizes={sizes}
      onError={handleError}
    />
  );
}
