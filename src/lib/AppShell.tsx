import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { C } from './ui';

const SB = { bg: '#0b4d1c', hover: '#136b29', active: C.ac, text: '#cfeed6', mu: '#8fc79c', line: '#1b6a30' };

export type NavItem = { key: string; label: string; icon: keyof typeof Ionicons.glyphMap };

type Props = {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
  user: { name: string; email?: string };
  onLogout: () => void;
  title?: string;
  children: ReactNode;
};

function SidebarContent({ items, active, onSelect, user, onLogout, onClose }: Omit<Props, 'children' | 'title'> & { onClose?: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: SB.bg }}>
      {/* Logo */}
      <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: SB.line }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.ac, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="barbell" size={20} color="#fff" />
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', flex: 1 }}>GymApp</Text>
        {onClose && (
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={22} color={SB.text} />
          </Pressable>
        )}
      </View>

      {/* Nav */}
      <View style={{ flex: 1, padding: 12, gap: 4 }}>
        {items.map(i => {
          const on = i.key === active;
          return (
            <Pressable
              key={i.key}
              onPress={() => { onSelect(i.key); onClose?.(); }}
              style={({ hovered }: any) => ({
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10,
                backgroundColor: on ? SB.active : hovered ? SB.hover : 'transparent',
              })}
            >
              <Ionicons name={i.icon} size={19} color={on ? '#fff' : SB.text} />
              <Text style={{ color: on ? '#fff' : SB.text, fontWeight: '600', fontSize: 14 }}>{i.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* User + logout */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderTopWidth: 1, borderColor: SB.line }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.ac, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{user.name}</Text>
          {!!user.email && <Text numberOfLines={1} style={{ color: SB.mu, fontSize: 12 }}>{user.email}</Text>}
        </View>
        <Pressable onPress={onLogout} hitSlop={10}>
          <Ionicons name="log-out-outline" size={22} color={SB.text} />
        </Pressable>
      </View>
    </View>
  );
}

export default function AppShell({ children, title = 'Dashboard', ...nav }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: C.bg }}>
      {wide && (
        <View style={{ width: 250 }}>
          <SidebarContent {...nav} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: C.bd }}>
          {!wide && (
            <Pressable onPress={() => setOpen(true)} hitSlop={10}>
              <Ionicons name="menu" size={26} color={C.tx} />
            </Pressable>
          )}
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.tx }}>{title}</Text>
        </View>

        <View style={{ flex: 1 }}>{children}</View>
      </View>

      {/* Mobile drawer */}
      {!wide && (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: 270, maxWidth: '80%' }}>
              <SidebarContent {...nav} onClose={() => setOpen(false)} />
            </View>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setOpen(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
}