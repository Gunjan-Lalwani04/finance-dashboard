# 💰 Finance Dashboard

A native Android personal-finance app built with React Native. Track your income and expenses, organize them by category and payment method, and see where your money goes through a clean dashboard with month-by-month spending and savings charts. All data syncs to a cloud PostgreSQL database via Supabase.

---

## ✨ Features

- **Dashboard with charts** — summary cards for total income, expenses, and balance, plus bar charts showing spending and savings month by month.
- **Add transactions** — log income or expenses with an amount, category, payment method (cash / card / UPI), and an optional note.
- **Smart categories** — the category list adapts to the transaction type (spending categories for expenses, income categories for income).
- **Transactions list** — view all transactions newest-first, pull to refresh, and long-press to delete.
- **Cloud sync** — every transaction is stored in a cloud PostgreSQL database, so the data lives beyond the device.
- **Tab navigation** — Dashboard, Add, and Transactions tabs for an app-like experience.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (CLI) |
| Navigation | React Navigation (bottom tabs) |
| Charts | react-native-gifted-charts + react-native-svg |
| Backend / Database | Supabase (PostgreSQL) |
| Language | JavaScript / TypeScript |

---

## 📁 Project Structure

```
FinanceDashboard/
├── App.tsx                  # App entry + tab navigation
├── lib/
│   ├── supabase.js          # Supabase client setup
│   └── config.js            # API keys (git-ignored — you create this)
├── screens/
│   ├── DashboardScreen.js   # Summary cards + monthly charts
│   ├── AddScreen.js         # Add-transaction form
│   └── ListScreen.js        # Transactions list
├── android/                 # Native Android project
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.11.0 or newer
- **JDK 17**
- **Android Studio** + Android SDK
- An Android device (with USB debugging) or an emulator
- A free **Supabase** account

### 1. Clone and install

```bash
git clone https://github.com/Gunjan-Lalwani04/finance-dashboard.git
cd finance-dashboard
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then in the SQL Editor create the table:

```sql
CREATE TABLE transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  note TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access"
ON transactions FOR ALL
USING (true) WITH CHECK (true);
```

### 3. Add your keys

Create `lib/config.js` with your Supabase project URL and anon key:

```javascript
export const SUPABASE_URL = 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key';
```

> This file is git-ignored so your keys stay private. Use the **anon / publishable** key, never the service-role key.

### 4. Run on your device

With an Android device connected (USB debugging on) or an emulator running:

```bash
npx react-native run-android
```

---

## 📝 Notes

- Row Level Security uses an open "allow all" policy for this single-user version. A future version with user accounts would scope data per user.
- New transactions use the current date. A date picker for logging past transactions is a planned improvement.

## 🌱 Possible Future Improvements

- Date picker for back-dated transactions
- Category breakdown (pie chart) of where money goes
- Edit existing transactions
- Filter the dashboard by month
- User accounts and per-user data (Supabase Auth)

---

## 👤 Author

**Gunjan Lalwani**

Built as a learning project to explore React Native, mobile development, and cloud databases.
