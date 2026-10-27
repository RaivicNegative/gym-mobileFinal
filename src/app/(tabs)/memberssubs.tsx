import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { Sub, fmt, latest, statusOf } from '../../lib/data';
import { supabase } from '../../lib/supabase';
import { Card, Chip, IconBtn, Screen, T } from '../../lib/ui';

type M = { id: string; full_name: string; email: string };
const ask = (msg: string) => Platform.OS === 'web'
  ? Promise.resolve(window.confirm(msg))
  : new Promise<boolean>(res => Alert.alert('Confirm', msg, [
      { text: 'Cancel', style: 'cancel', onPress: () => res(false) },
      { text: 'Remove', style: 'destructive', onPress: () => res(true) }]));
export default function Members() {
  const { profile } = useAuth(); const r = useRouter();
  const [subs, setSubs] = useState<Sub[]>([]); const [m, setM] = useState<M[]>([]);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
  const a = await supabase.from('profiles').select('id,full_name,email').eq('role', 'member').order('full_name'); setM((a.data ?? []) as M[]);
  const b = await supabase.from('subscriptions').select('*'); setSubs((b.data ?? []) as Sub[]);
}, []);
useFocusEffect(useCallback(() => { load(); }, [load]));
  if (profile?.role !== 'admin') return null;
  const removeSub = async (s: Sub, name: string) => {
  if (!(await ask(`Remove ${name}'s ${s.plan_name} subscription?`))) return;
  const { error } = await supabase.from('subscriptions').delete().eq('id', s.id);
  if (error) setMsg(error.message); else { setMsg(''); load(); }
};
  return (<Screen>
    {/*<H>Members Subscribed ({m.length})</H>*/}
    {m.length === 0 && <Card><T mu>No members have registered yet.</T></Card>}
    {m.map(x => { const s = latest(subs, x.id); return (
      <Card key={x.id}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flexShrink: 1 }}>
          <T b>{x.full_name}</T>
          <T mu>{x.email}</T>
          <View style={{ marginVertical: 6 }}><Chip s={statusOf(s)} /></View>
          {s && <T mu>{s.plan_name} · ends {fmt(s.ends_at)}</T>}
          </View>
          <View style={{ flexDirection: 'column', gap: 10 }}>
          <IconBtn name="add-circle-outline" onPress={() => r.push({ pathname: '/subscription', params: { uid: x.id } })} />
          {s && <IconBtn name="create-outline" onPress={() => r.push({ pathname: '/subscription', params: { uid: x.id, sid: s.id } })} />}
          {s && <IconBtn name="trash-outline" color="#c92a2a" onPress={() => removeSub(s, x.full_name)} />}
        </View>
        </View>
      </Card>); })}
  </Screen>);
}
