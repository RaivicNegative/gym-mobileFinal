import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../lib//auth';
import { Sub, fmt, latest, statusOf } from '../../lib//data';
import { supabase } from '../../lib//supabase';
import { Banner, Btn, CUR, Card, CardRow, Chip, H, Row, Screen, T } from '../../lib//ui';
type M = { id: string; full_name: string };
export default function Dashboard() {
  const { profile } = useAuth(); const r = useRouter(); const admin = profile?.role === 'admin';
  const [subs, setSubs] = useState<Sub[]>([]); const [members, setMembers] = useState<M[]>([]);
  useFocusEffect(useCallback(() => { (async () => {
    const s = await supabase.from('subscriptions').select('*'); setSubs((s.data ?? []) as Sub[]);
    if (admin) { const m = await supabase.from('profiles').select('id,full_name').eq('role', 'member'); setMembers((m.data ?? []) as M[]); }
  })(); }, [admin]));
  if (!profile) return null;
  const first = profile.full_name.split(' ')[0];
  const second = profile.full_name.split(' ')[1] ? ` ${profile.full_name.split(' ')[1]}` : '';
  const third = profile.full_name.split(' ')[2] ? ` ${profile.full_name.split(' ')[2]}` : '';
  if (!admin) {
    const s = latest(subs, profile.id), st = statusOf(s);
    return (<Screen ><H center>Welcome, {first}{second}{third}!</H>
      <Banner s={st} text={st === 'none' ? 'You have no subscription yet. Visit the front desk to subscribe.' : st === 'expired' ? `Your subscription expired on ${fmt(s!.ends_at)}. Please renew.` : `Your subscription ends on ${fmt(s!.ends_at)}. Renew soon.`} />
      <Card><T b>My subscription</T><View style={{ marginVertical: 6 }}><Chip s={st} /></View>
        {s && <><Row k="Plan" v={s.plan_name} /><Row k="Starts" v={fmt(s.starts_at)} /><Row k="Ends" v={fmt(s.ends_at)} /></>}</Card></Screen>);
  }
  const by = (k: string) => members.filter(m => statusOf(latest(subs, m.id)) === k).length;
  const attention = members.filter(m => ['expired', 'soon'].includes(statusOf(latest(subs, m.id))));
  const overdue = by('expired');
  return (<Screen maxWidth={600}><H center>Welcome, {first}{second}{third}!</H>
    {overdue > 0 && <Banner s="expired" text={`⚠ ${overdue} member${overdue > 1 ? 's have' : ' has'} a past-due subscription.`} />}
    <CardRow>
      <Card height={220}>
        <T b center size={20}>Registered Members</T>
        <T b center size={50} mt={35}>
          {String(members.length)}
        </T>
      </Card>
      <Card height={220}> 
        <T b center size={20}>Active Members</T>
        <T b center size={50} mt={35}>
          {String(by('active') + by('soon'))}
        </T>
      </Card>
    </CardRow>
    <Card>
      <Row k="Total revenue" v={`${CUR}${subs.reduce((a, s) => a + Number(s.amount), 0).toLocaleString()}`} />
    </Card>
    
    <Card><Row k="Expiring in 3 days" v={String(by('soon'))} /><Row k="Past due" v={String(overdue)} /></Card>
    <Card><T b>Needs attention</T>{attention.length === 0 && <T mu>Everyone is up to date</T>}
      {attention.map(m => (<View key={m.id} style={{ marginTop: 8 }}><T b>{m.full_name}</T><Chip s={statusOf(latest(subs, m.id))} />
        <Btn ghost title="Renew" onPress={() => r.push({ pathname: '/subscription', params: { uid: m.id } })} /></View>))}</Card></Screen>);
}
