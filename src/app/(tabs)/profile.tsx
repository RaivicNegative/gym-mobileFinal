import { useEffect, useState } from 'react';
import { useAuth } from '../../lib//auth';
import { age } from '../../lib//data';
import { supabase } from '../../lib//supabase';
import { Btn, Card, Field, Row, Screen, T } from '../../lib//ui';
export default function Profile() {
  const { profile: p, refresh } = useAuth();
  const [f, setF] = useState({ n: '', d: '', h: '', w: '' }); const [msg, setMsg] = useState('');
  useEffect(() => { if (p) setF({ n: p.full_name, d: p.date_of_birth ?? '', h: String(p.height_cm ?? ''), w: String(p.weight_kg ?? '') }); }, [p]);
  if (!p) return null;
  const save = async () => {
    const { error } = await supabase.from('profiles').update({ full_name: f.n.trim(), date_of_birth: f.d || null, height_cm: f.h ? Number(f.h) : null, weight_kg: f.w ? Number(f.w) : null }).eq('id', p.id);
    setMsg(error ? error.message : 'Saved ✓'); if (!error) refresh();
  };
  return (<Screen>
    {/*<H>Profile</H>*/}
    <Card><Row k="Full name" v={p.full_name} /><Row k="Email" v={p.email} /><Row k="Role" v={p.role === 'admin' ? 'Administrator' : 'Member'} />
      <Row k="Date of birth" v={p.date_of_birth ?? '—'} /><Row k="Age" v={age(p.date_of_birth)} />
      <Row k="Height" v={p.height_cm ? `${p.height_cm} cm` : '—'} /><Row k="Weight" v={p.weight_kg ? `${p.weight_kg} kg` : '—'} /></Card>
    <Card><T b>Edit profile</T>
      <Field label="Full name" value={f.n} onChangeText={v => setF({ ...f, n: v })} autoCapitalize="words" />
      <Field label="Date of birth (YYYY-MM-DD)" value={f.d} onChangeText={v => setF({ ...f, d: v })} />
      <Field label="Height (cm)" value={f.h} onChangeText={v => setF({ ...f, h: v })} keyboardType="numeric" />
      <Field label="Weight (kg)" value={f.w} onChangeText={v => setF({ ...f, w: v })} keyboardType="numeric" />
      {!!msg && <T>{msg}</T>}<Btn title="Save changes" onPress={save} /></Card>
    <Btn ghost title="Logout" onPress={() => supabase.auth.signOut()} /></Screen>);
}
