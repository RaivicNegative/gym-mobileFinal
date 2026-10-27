import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../lib//auth';
function Guard() {
  const { session, loading } = useAuth(); const seg = useSegments(); const r = useRouter();
  useEffect(() => {
    if (loading) return;
    const inAuth = seg[0] === 'login';
    if (!session && !inAuth) r.replace('/login');
    if (session && inAuth) r.replace('/');
  }, [session, loading, seg]);
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>;
  return <Slot />;
}
export default function Root() { return <AuthProvider><Guard /></AuthProvider>; }
