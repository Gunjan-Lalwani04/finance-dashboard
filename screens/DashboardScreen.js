import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { supabase } from '../lib/supabase';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [txns, setTxns] = useState([]);

  useFocusEffect(
    useCallback(() => { load(); }, [])
  );

  async function load() {
    const { data } = await supabase.from('transactions').select('*');
    if (data) setTxns(data);
  }

  // Overall totals
  const totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Group by month: { "2026-06": { income, expense } }
  const byMonth = {};
  txns.forEach(t => {
    const key = String(t.date).slice(0, 7); // "YYYY-MM"
    if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
    byMonth[key][t.type] += Number(t.amount);
  });

  const months = Object.keys(byMonth).sort();
  const monthLabel = (key) => {
    const [, m] = key.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m) - 1];
  };

  // Spending per month (red bars)
  const spendingData = months.map(k => ({ value: byMonth[k].expense, label: monthLabel(k), frontColor: '#f87171' }));
  // Savings per month = income - expense (green/red bars)
  const savingsData = months.map(k => {
    const saved = byMonth[k].income - byMonth[k].expense;
    return { value: saved, label: monthLabel(k), frontColor: saved >= 0 ? '#34d399' : '#f87171' };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: '#34d399' }]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: '#34d399' }]}>₹{totalIncome.toFixed(0)}</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: '#f87171' }]}>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={[styles.summaryValue, { color: '#f87171' }]}>₹{totalExpense.toFixed(0)}</Text>
          </View>
        </View>

        <View style={[styles.balanceCard, { borderColor: balance >= 0 ? '#34d399' : '#f87171' }]}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? '#34d399' : '#f87171' }]}>
            ₹{balance.toFixed(0)}
          </Text>
        </View>

        {txns.length === 0 ? (
          <Text style={styles.empty}>Add some transactions to see your charts! 📊</Text>
        ) : (
          <>
            <Text style={styles.chartTitle}>💸 Spending by Month</Text>
            <View style={styles.chartBox}>
              <BarChart
                data={spendingData}
                barWidth={28}
                noOfSections={4}
                barBorderRadius={4}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#888' }}
                xAxisLabelTextStyle={{ color: '#888' }}
                width={screenWidth - 80}
              />
            </View>

            <Text style={styles.chartTitle}>💰 Savings by Month</Text>
            <View style={styles.chartBox}>
              <BarChart
                data={savingsData}
                barWidth={28}
                noOfSections={4}
                barBorderRadius={4}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#888' }}
                xAxisLabelTextStyle={{ color: '#888' }}
                width={screenWidth - 80}
              />
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1, backgroundColor: '#1a1a2e', borderWidth: 1, borderRadius: 14, padding: 16, alignItems: 'center',
  },
  summaryLabel: { color: '#888', fontSize: 13, marginBottom: 6 },
  summaryValue: { fontSize: 22, fontWeight: 'bold' },
  balanceCard: {
    backgroundColor: '#1a1a2e', borderWidth: 1, borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 24,
  },
  balanceValue: { fontSize: 30, fontWeight: 'bold' },
  chartTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  chartBox: {
    backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, paddingRight: 24, marginBottom: 20, alignItems: 'center',
  },
  empty: { color: '#555', textAlign: 'center', marginTop: 50, fontSize: 15 },
});