import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Btn, C, Card, Field, T } from '../lib/ui';
export default function Login() {
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ name: '', email: '', pw: '', dob: '', h: '', w: '' });
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: string) => (v: string) => setF({ ...f, [k]: v });
  const go = async () => {
    setMsg(''); setBusy(true);
    if (!reg) {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email.trim(), password: f.pw });
      if (error) setMsg(error.message);
    } else {
      if (!f.name.trim() || !f.email || f.pw.length < 6 || !/^\d{4}-\d{2}-\d{2}$/.test(f.dob) || !f.h || !f.w) { setMsg('Fill in every field. Birth date format: YYYY-MM-DD. Password min 6 characters.'); setBusy(false); return; }
      const { data, error } = await supabase.auth.signUp({ email: f.email.trim(), password: f.pw,
        options: { data: { full_name: f.name.trim(), date_of_birth: f.dob, height_cm: f.h, weight_kg: f.w } } });
      if (error) setMsg(error.message); else if (!data.session) setMsg('Account created. Check your email to confirm, then log in.');
    }
    setBusy(false);
  };
  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: C.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Image source={require('../../assets/images/iwcbg.png')} contentFit="cover" style={{ width: '100%', height: '100%' }} />
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <Card>
            <Text style={{ fontSize: 26, fontWeight: '800', color: C.ac }}>Inabanga Wellness Center</Text>
            <T mu>{reg ? 'Create your member account' : 'Sign in to continue'}</T>
            {reg && <><Field label="Full name" value={f.name} onChangeText={set('name')} autoCapitalize="words" />
              <Field label="Date of birth (YYYY-MM-DD)" value={f.dob} onChangeText={set('dob')} placeholder="1995-04-23" />
              <Field label="Height (cm)" value={f.h} onChangeText={set('h')} keyboardType="numeric" />
              <Field label="Weight (kg)" value={f.w} onChangeText={set('w')} keyboardType="numeric" /></>}
            <Field label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" />
            <Field label="Password" value={f.pw} onChangeText={set('pw')} secureTextEntry />
            {!!msg && <Text style={{ color: '#c92a2a', marginTop: 8 }}>{msg}</Text>}
            <Btn title={busy ? 'Please wait…' : reg ? 'Register' : 'Login'} onPress={go} />
            <Btn ghost title={reg ? 'I already have an account' : 'Create an account'} onPress={() => { setReg(!reg); setMsg(''); }} />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}