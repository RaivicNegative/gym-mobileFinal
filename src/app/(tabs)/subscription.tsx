import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../lib//auth';
import { Sub, fmt } from '../../lib//data';
import { supabase } from '../../lib//supabase';
import { Btn, CUR, Card, Field, Pick, Row, Screen, T } from '../../lib//ui';
type Plan = { id: number; name: string; price: number; days: number };
type M = { id: string; full_name: string };
const nowStr = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16).replace('T', ' ');
export default function Subscription() {
  const { profile } = useAuth(); const admin = profile?.role === 'admin'; const params = useLocalSearchParams<{ uid?: string }>();
  const [plans, setPlans] = useState<Plan[]>([]); const [members, setMembers] = useState<M[]>([]); const [subs, setSubs] = useState<Sub[]>([]);
  const [uid, setUid] = useState(''); const [planId, setPlanId] = useState(''); const [start, setStart] = useState(nowStr()); const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    const p = await supabase.from('plans').select('*').order('days'); setPlans((p.data ?? []) as Plan[]);
    const s = await supabase.from('subscriptions').select('*').order('starts_at', { ascending: false }); setSubs((s.data ?? []) as Sub[]);
    if (admin) { const m = await supabase.from('profiles').select('id,full_name').eq('role', 'member').order('full_name'); setMembers((m.data ?? []) as M[]); }
  }, [admin]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { if (params.uid) setUid(params.uid); }, [params.uid]);
  const plan = plans.find(p => String(p.id) === planId);
  const s0 = new Date(start.replace(' ', 'T'));
  const save = async () => {
    if (!uid || !plan || isNaN(+s0)) { setMsg('Choose a member, a plan, and a valid start (YYYY-MM-DD HH:mm).'); return; }
    const { error } = await supabase.from('subscriptions').insert({ user_id: uid, plan_name: plan.name, amount: plan.price, starts_at: s0.toISOString(), ends_at: new Date(+s0 + plan.days * 864e5).toISOString() });
    if (error) setMsg(error.message); else { setMsg('Subscription saved ✓'); load(); }
  };
  const name = (id: string) => members.find(m => m.id === id)?.full_name ?? '';
  return (<Screen>
    {/*<H>Subscription</H>*/}
    {admin ? (<Card><T b>Add subscription (record payment)</T>
      <T mu>Member</T><Pick items={members.map(m => ({ k: m.id, l: m.full_name }))} value={uid} onChange={setUid} />
      <T mu>Plan</T><Pick items={plans.map(p => ({ k: String(p.id), l: `${p.name} ${CUR}${p.price}` }))} value={planId} onChange={setPlanId} />
      <Field label="Start date & time (YYYY-MM-DD HH:mm)" value={start} onChangeText={setStart} />
      {plan && !isNaN(+s0) && <><Row k="Amount" v={`${CUR}${plan.price}`} /><Row k="Ends" v={fmt(new Date(+s0 + plan.days * 864e5).toISOString())} /></>}
      {!!msg && <T>{msg}</T>}<Btn title="Save subscription" onPress={save} /></Card>)
      : (<Card><T b>Available plans</T>{plans.map(p => <Row key={p.id} k={p.name} v={`${CUR}${p.price} / ${p.days} day${p.days > 1 ? 's' : ''}`} />)}
        <T mu>Pay at the front desk and the admin will activate your plan.</T></Card>)}
    <Card><T b>{admin ? 'All subscriptions' : 'My history'}</T>{subs.length === 0 && <T mu>None yet.</T>}
      {subs.map(s => (<Row key={s.id} k={`${admin ? name(s.user_id) + ' · ' : ''}${s.plan_name} (${CUR}${s.amount})`} v={`${fmt(s.starts_at)} → ${fmt(s.ends_at)}`} />))}</Card></Screen>);
}
