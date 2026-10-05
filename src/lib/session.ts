export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("aiw_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("aiw_session", id);
  }
  return id;
}

const KEY = "aiw_my_code";
export const getMyCode = () => (typeof window === "undefined" ? null : localStorage.getItem(KEY));
export const setMyCode = (c: string) => localStorage.setItem(KEY, c);
export const clearMyCode = () => localStorage.removeItem(KEY);
