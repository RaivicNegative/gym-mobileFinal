import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { useAuth } from '../../lib/auth';
import { C } from '../../lib/ui';

export default function TabsLayout() {
  const { profile } = useAuth(); const admin = profile?.role === 'admin';
  const { width } = useWindowDimensions();
  const wide = width >= 768;
  const [open, setOpen] = useState(true);
  const ic = (name: any) => ({ color, size }: any) => <Ionicons name={name} size={size} color={color} />;
  return (
    <Tabs screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#f6f5f2' },
      headerTintColor: '#1d321f',
      headerTitleStyle: { fontWeight: '700' },
      headerLeft: () => (
        <Pressable onPress={() => setOpen(o => !o)} style={{ marginLeft: 16 }}>
          <Ionicons name="menu" size={26} color={C.tx} />
        </Pressable>
      ),
      tabBarPosition: wide ? 'left' : 'bottom',
      tabBarVariant: wide ? 'material' : 'uikit',
      tabBarActiveTintColor: '#1d321f',
      tabBarInactiveTintColor: '#f6f5f2',
      tabBarActiveBackgroundColor: 'rgba(255,255,255,0.2)',
      tabBarStyle: open ? { backgroundColor: '#487531', borderColor: C.bd, ...(wide ? { width: 240 } : {}) } : { display: 'none' },
      tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
    } as any}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ic('home') }} />
      <Tabs.Screen name="members" options={{ title: 'Members', href: admin ? undefined : null, tabBarIcon: ic('people') }} />
      <Tabs.Screen name="memberssubs" options={{ title: 'Members Subscribed', href: admin ? undefined : null, tabBarIcon: ic('diamond') }} />
      <Tabs.Screen name="subscription" options={{ title: 'Subscription', tabBarIcon: ic('card') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ic('person') }} />
    </Tabs>
  );
}