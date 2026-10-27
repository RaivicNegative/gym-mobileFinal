export type Sub = { id: string; user_id: string; plan_name: string; amount: number; starts_at: string; ends_at: string };
export type Status = 'active' | 'soon' | 'expired' | 'none';
export const statusOf = (s?: Sub): Status => {
  if (!s) return 'none';
  const left = new Date(s.ends_at).getTime() - Date.now();
  return left < 0 ? 'expired' : left < 3 * 864e5 ? 'soon' : 'active';
};
export const latest = (subs: Sub[], uid: string) =>
  subs.filter(s => s.user_id === uid).sort((a, b) => +new Date(b.ends_at) - +new Date(a.ends_at))[0];
export const fmt = (d: string) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
export const age = (d?: string | null) => {
  if (!d) return '—';
  const b = new Date(d), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return String(a);
};
