import { Ionicons } from '@expo/vector-icons';
import { Children, ReactNode } from 'react';
import { ImageBackground, Pressable, ScrollView, Text, TextInput, TextInputProps, View } from 'react-native';
import { Status } from './data';
export const CUR = '₱';
export const C = { ac: '#487531', bg: '#c4efcd', bd: '#edf1ec', mu: '#667085', tx: '#1d321f', wh: '#ffffff', bl: '#f6f5f2', gr: '#f6f5f2' };
const shadow: any = { boxShadow: '0 2px 14px rgba(0,0,0,0.07)' };
const col: Record<Status, [string, string, string]> = {
  active: ['#e6f4ea', '#2b8a3e', 'Active'], soon: ['#fff3e0', '#e67700', 'Expiring soon'],
  expired: ['#fdeaea', '#c92a2a', 'Past due'], none: ['#eceef1', '#667085', 'No subscription'] };
export const Screen = ({ children, maxWidth = 900 }: { children: ReactNode; maxWidth?: number }) => (
  <ImageBackground source={require('../../assets/images/iwcbg.png')} resizeMode="cover" style={{ width: '100%', height: '100%' }}>
    <ScrollView style={{ backgroundColor: 'rgba(196,239,205,0.35)' }} contentContainerStyle={{ padding: 20, width: '100%', maxWidth, alignSelf: 'center' }}>{children}</ScrollView>
  </ImageBackground>);  
export const H = ({ children, center }: { children: ReactNode, center?: boolean; }) => <Text style={{ fontSize: 26, fontWeight: '800', color: C.bl, marginBottom: 16, textAlign: center ? 'center' : 'auto' }}>{children}</Text>;
export const Card = ({ children, height, minHeight }: { children: ReactNode; height?: number; minHeight?: number }) => (
  <View style={{ backgroundColor: C.gr, borderRadius: 18, padding: 20, marginBottom: 16, ...shadow, height, minHeight }}>{children}</View>);
export const T = ({ children, mu, b, center, size, mt = 2, mb = 2 }: { children: ReactNode; mu?: boolean; b?: boolean; center?: boolean; size?: number; mt?: number; mb?: number }) => (
  <Text style={{ color: mu ? C.mu : C.tx, fontWeight: b ? '700' : '400', marginTop: mt, marginBottom: mb, textAlign: center ? 'center' : 'auto', fontSize: size }}>{children}</Text>);
export const Row = ({ k, v }: { k: string; v: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.bd }}>
    <Text style={{ color: C.mu, flexShrink: 1 }}>{k}</Text><Text style={{ color: C.tx, fontWeight: '600', flexShrink: 1, textAlign: 'right' }}>{v}</Text></View>);
export const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexGrow: 1, flexBasis: 150, backgroundColor: C.wh, borderRadius: 18, padding: 18, ...shadow }}>
    <Text style={{ color: C.mu, fontSize: 13, fontWeight: '600' }}>{label}</Text>
    <Text style={{ color: C.tx, fontSize: 30, fontWeight: '800', marginTop: 6 }}>{value}</Text></View>);
export const Btn = ({ title, onPress, ghost }: { title: string; onPress: () => void; ghost?: boolean }) => (
  <Pressable onPress={onPress} style={{ backgroundColor: ghost ? C.wh : C.ac, borderWidth: ghost ? 1 : 0, borderColor: C.bd, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
    <Text style={{ color: ghost ? C.tx : C.wh, fontWeight: '700' }}>{title}</Text></Pressable>);
export const Field = (p: TextInputProps & { label: string }) => (
  <View style={{ marginTop: 12 }}><Text style={{ color: C.mu, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>{p.label}</Text>
    <TextInput autoCapitalize="none" {...p} style={{ borderWidth: 1, borderColor: C.bd, borderRadius: 12, padding: 12, backgroundColor: '#f8faf9' }} /></View>);
export const Chip = ({ s }: { s: Status }) => (
  <Text style={{ alignSelf: 'flex-start', backgroundColor: col[s][0], color: col[s][1], fontWeight: '700', fontSize: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, overflow: 'hidden' }}>{col[s][2]}</Text>);
export const Banner = ({ s, text }: { s: Status; text: string }) => (s === 'active' ? null :
  <View style={{ backgroundColor: col[s][0], padding: 14, borderRadius: 14, marginBottom: 16 }}><Text style={{ color: col[s][1], fontWeight: '700' }}>{text}</Text></View>);
export const Pick = ({ items, value, onChange }: { items: { k: string; l: string }[]; value: string; onChange: (k: string) => void }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4, marginBottom: 8 }}>
    {items.map(i => (<Pressable key={i.k} onPress={() => onChange(i.k)} style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: value === i.k ? C.ac : C.bd, backgroundColor: value === i.k ? C.ac : C.wh }}>
      <Text style={{ color: value === i.k ? C.wh : C.tx, fontWeight: '600' }}>{i.l}</Text></Pressable>))}
  </View>);
export const CardRow = ({ children, gap = 16 }: { children: ReactNode; gap?: number }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
    {Children.map(children, c => <View style={{ flexGrow: 1, flexBasis: 220 }}>{c}</View>)}
  </View>);
export const IconBtn = ({ name, onPress, color = C.tx, size = 20 }: { name: any; onPress: () => void; color?: string; size?: number }) => (
  <Pressable onPress={onPress} hitSlop={8} style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: C.bd, backgroundColor: C.wh, alignItems: 'center', justifyContent: 'center' }}>
    <Ionicons name={name} size={size} color={color} />
  </Pressable>);
export type Col = { key: string; label: string; flex?: number; align?: 'left' | 'center' | 'right' };
const jc = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
export const Table = ({ cols, rows, minWidth = 700 }: { cols: Col[]; rows: Record<string, ReactNode>[]; minWidth?: number }) => (
  <View style={{ backgroundColor: C.wh, borderRadius: 18, overflow: 'hidden', marginBottom: 16, ...shadow }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, minWidth }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f2', paddingVertical: 12, paddingHorizontal: 16 }}>
          {cols.map(c => (
            <Text key={c.key} style={{ flex: c.flex ?? 1, textAlign: c.align ?? 'left', color: C.mu, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>{c.label}</Text>))}
        </View>
        {rows.length === 0 && <Text style={{ padding: 16, color: C.mu }}>No data yet.</Text>}
        {rows.map((r, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: 1, borderColor: C.bd }}>
            {cols.map(c => {
              const v = r[c.key];
              return (
                <View key={c.key} style={{ flex: c.flex ?? 1, alignItems: jc[c.align ?? 'left'] }}>
                  {typeof v === 'string' || typeof v === 'number' ? <Text style={{ color: C.tx }}>{v}</Text> : v}
                </View>);
            })}
          </View>))}
      </View>
    </ScrollView>
  </View>);