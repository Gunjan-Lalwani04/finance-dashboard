import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function ListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reload every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  async function loadTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setTransactions(data);
    }
  }

  async function deleteTransaction(id) {
    Alert.alert('Delete?', 'Remove this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('transactions').delete().eq('id', id);
          if (error) Alert.alert('Error', error.message);
          else loadTransactions();
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const isIncome = item.type === 'income';
    return (
      <TouchableOpacity
        style={styles.card}
        onLongPress={() => deleteTransaction(item.id)}
      >
        <View style={styles.left}>
          <Text style={styles.category}>{item.category}</Text>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          <Text style={styles.meta}>
            {item.payment_method.toUpperCase()} · {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.amount, { color: isIncome ? '#34d399' : '#f87171' }]}>
          {isIncome ? '+' : '−'}₹{Number(item.amount).toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTransactions} tintColor="#a78bfa" />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions yet. Add one from the ➕ tab!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2e2e4e',
    borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  left: { flex: 1 },
  category: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  note: { color: '#aaa', fontSize: 13, marginTop: 2 },
  meta: { color: '#666', fontSize: 12, marginTop: 4 },
  amount: { fontSize: 17, fontWeight: 'bold', marginLeft: 12 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
});