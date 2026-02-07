"use client";

export function useEventAccess(eventSlug: string) {
  const key = `event_access:${eventSlug}`;

  const hasAccess = () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(key) === "ok";
  };

  const grant = () => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, "ok");
  };

  const clear = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  };

  return { hasAccess, grant, clear };
}
