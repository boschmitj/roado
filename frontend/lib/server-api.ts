import { cookies } from "next/headers";

export async function serverFetch(url: string, init?: RequestInit) {      
    const cookieStore = await cookies(); 
    const cookieHeader = cookieStore.toString();

  const res = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Cookie: cookieHeader, // wichtig für Auth
    },
    cache: "no-store", // SSR: immer frisch
  });

  if (!res.ok) {
    return res;
  }

  return await res.json();
}
