import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { supabase, tempClient } from '../../lib/supabase';
import { Btn, Card, Field, IconBtn, Screen, T, Table } from '../../lib/ui';
type M = { id: string; full_name: string; email: string };
const empty = { name: '', email: '', pw: '', dob: '', h: '', w: '' };

const ask = (msg: string) => Platform.OS === 'web'
  ? Promise.resolve(window.confirm(msg))
  : new Promise<boolean>(res => Alert.alert('Confirm', msg, [
      { text: 'Cancel', style: 'cancel', onPress: () => res(false) },
      { text: 'Remove', style: 'destructive', onPress: () => res(true) }]));

export default function Members() {
  const { profile } = useAuth();
  const r = useRouter();
  const [m, setM] = useState<M[]>([]); const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [f, setF] = useState(empty);
  const set = (k: string) => (v: string) => setF({ ...f, [k]: v });

  const load = useCallback(async () => {
    const a = await supabase.from('profiles').select('id,full_name,email').eq('role', 'member').order('full_name');
    setM((a.data ?? []) as M[]);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const add = async () => {
    if (!f.name.trim() || !f.email || f.pw.length < 6 || !/^\d{4}-\d{2}-\d{2}$/.test(f.dob) || !f.h || !f.w) {
      setMsg('Fill in every field. Birth date: YYYY-MM-DD. Password min 6 characters.'); return; }
    setBusy(true); setMsg('');
    const { error } = await tempClient().auth.signUp({ email: f.email.trim(), password: f.pw,
      options: { data: { full_name: f.name.trim(), date_of_birth: f.dob, height_cm: f.h, weight_kg: f.w } } });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setF(empty); setShow(false); load();
  };

  const del = async (x: M) => {
    if (!(await ask(`Remove ${x.full_name}? This deletes their account and all their subscriptions.`))) return;
    const { error } = await supabase.rpc('delete_member', { member_id: x.id });
    if (error) setMsg(error.message); else { setMsg(''); load(); }
  };

  if (profile?.role !== 'admin') return null;
  return (<Screen maxWidth={1000}>
    {/*<H>Members ({m.length})</H>*/}
    <View style={{marginBottom: 5}}>
        <Btn title={show ? 'Close' : '+ Add member'} onPress={() => { setShow(!show); setMsg(''); }} />
    </View>
    {show && (<Card>
      <T b>New member</T>
      <Field label="Full name" value={f.name} onChangeText={set('name')} autoCapitalize="words" />
      <Field label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" />
      <Field label="Temporary password" value={f.pw} onChangeText={set('pw')} secureTextEntry />
      <Field label="Date of birth (YYYY-MM-DD)" value={f.dob} onChangeText={set('dob')} placeholder="1995-04-23" />
      <Field label="Height (cm)" value={f.h} onChangeText={set('h')} keyboardType="numeric" />
      <Field label="Weight (kg)" value={f.w} onChangeText={set('w')} keyboardType="numeric" />
      <Btn title={busy ? 'Please wait…' : 'Save member'} onPress={add} />
    </Card>)}
    {!!msg && <Text style={{ color: '#c92a2a', marginVertical: 12 }}>{msg}</Text>}
    <Table minWidth={700} cols={[
        { key: 'no', label: 'No.', flex: 0.5 },
        { key: 'name', label: 'Name', flex: 4 },
        { key: 'actions', label: '', flex: 1, align: 'right' }]}
      rows={m.map((x, i) => ({ no: String(i + 1), name: x.full_name,
        actions: (
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <IconBtn name="add-circle-outline" onPress={() => r.push({ pathname: '/subscription', params: { uid: x.id, sid: '' } })} />
                <IconBtn name="trash-outline" color="#c92a2a" onPress={() => del(x)} />
            </View>) }))} />
  </Screen>);
}