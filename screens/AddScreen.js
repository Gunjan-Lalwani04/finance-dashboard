import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Gift', 'Other'];
const METHODS = ['cash', 'card', 'upi'];

export default function AddScreen() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [method, setMethod] = useState('cash');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveTransaction() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('transactions').insert([{
      amount: Number(amount),
      type,
      category,
      payment_method: method,
      note: note || null,
    }]);
    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Saved', 'Transaction added!');
      setAmount('');
      setNote('');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.row}>
          {['expense', 'income'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, type === t && styles.chipActive]}
              onPress={() => {
                setType(t);
                setCategory(t === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
              }}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
                {t === 'expense' ? '🔴 Expense' : '🟢 Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.wrap}>
          {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, category === c && styles.chipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.row}>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, method === m && styles.chipActive]}
              onPress={() => setMethod(m)}
            >
              <Text style={[styles.chipText, method === m && styles.chipTextActive]}>
                {m.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Lunch with friends"
          placeholderTextColor="#555"
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={saveTransaction}
          disabled={saving}
        >
          <Text style={styles.saveText}>{saving ? 'Saving...' : '💾 Save Transaction'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scroll: { padding: 20 },
  label: { color: '#aaa', fontSize: 14, marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2e2e4e',
    borderRadius: 12, color: '#fff', padding: 14, fontSize: 16,
  },
  row: { flexDirection: 'row', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2e2e4e',
    borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16,
  },
  chipActive: { backgroundColor: '#2d1b69', borderColor: '#a78bfa' },
  chipText: { color: '#888', fontSize: 14 },
  chipTextActive: { color: '#a78bfa', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#a78bfa', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 30,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});