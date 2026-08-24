"use client";

import { usePathname } from "next/navigation";

// Keyed by pathname so React remounts the wrapper on every route change and
// the .route-fade entrance replays. Children stay server-rendered — this is
// only a keyed shell around them.
export default function RouteFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-fade">
      {children}
    </div>
  );
}
