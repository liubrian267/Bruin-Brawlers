// app/search/page.tsx
import React, { Suspense } from "react";
import SearchPageContent from "@/components/SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
