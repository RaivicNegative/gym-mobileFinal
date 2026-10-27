import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
export type Profile = { id: string; full_name: string; email: string; role: 'member' | 'admin'; date_of_birth: string | null; height_cm: number | null; weight_kg: number | null };
type Ctx = { session: Session | null; profile: Profile | null; loading: boolean; refresh: () => Promise<void> };
const C = createContext<Ctx>({} as Ctx);
export const useAuth = () => useContext(C);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async (s: Session | null) => {
    if (!s) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', s.user.id).single();
    setProfile((data as Profile) ?? null);
  };
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => { setSession(data.session); await load(data.session); setLoading(false); });
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); load(s); });
    return () => l.subscription.unsubscribe();
  }, []);
  return <C.Provider value={{ session, profile, loading, refresh: () => load(session) }}>{children}</C.Provider>;
}
