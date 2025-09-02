import { useContext, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ExpenseContext } from "../context/ExpenseContext";

export default function HomeScreen() {
  const { expenses, categories } = useContext(ExpenseContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Latest");

  const today = new Date();

  // 🔹 Calculate totals
  const totals = useMemo(() => {
    let todayTotal = 0, weekTotal = 0, monthTotal = 0;
    let categoryTotals = {};

    expenses.forEach((exp) => {
      const expDate = new Date(exp.date);

      // Daily
      if (isSameDay(expDate, today)) todayTotal += exp.amount;

      // Weekly
      if (isSameWeek(expDate, today)) weekTotal += exp.amount;

      // Monthly
      if (isSameMonth(expDate, today)) {
        monthTotal += exp.amount;
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    // Calculate percentages
    const categoryBreakdown = Object.entries(categoryTotals).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percent: ((amt / monthTotal) * 100).toFixed(1),
    }));

    return { todayTotal, weekTotal, monthTotal, categoryBreakdown };
  }, [expenses]);

  // 🔹 Filter + sort + search
  const filteredExpenses = expenses
    .filter((exp) => (filter === "All" ? true : exp.category === filter))
    .filter((exp) => exp.note?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Latest") return new Date(b.date) - new Date(a.date);
      if (sort === "Highest") return b.amount - a.amount;
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Expenses Overview</Text>

      {/* 🔹 Totals Summary */}
      <View style={styles.summary}>
        <Text>Today: ₹{totals.todayTotal.toFixed(2)}</Text>
        <Text>This Week: ₹{totals.weekTotal.toFixed(2)}</Text>
        <Text>This Month: ₹{totals.monthTotal.toFixed(2)}</Text>
      </View>

      {/* 🔹 Category Breakdown */}
      <View style={styles.breakdown}>
        <Text style={styles.subtitle}>📊 Monthly Breakdown</Text>
        {totals.categoryBreakdown.length === 0 ? (
          <Text style={{ color: "gray" }}>No expenses yet</Text>
        ) : (
          totals.categoryBreakdown.map((item) => (
            <Text key={item.category}>
              {item.category}: ₹{item.amount.toFixed(2)} ({item.percent}%)
            </Text>
          ))
        )}
      </View>

      {/* 🔹 Search */}
      <TextInput
        placeholder="Search by note..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      {/* 🔹 Sorting buttons */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setSort("Latest")}>
          <Text style={sort === "Latest" ? styles.active : styles.option}>Latest</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort("Highest")}>
          <Text style={sort === "Highest" ? styles.active : styles.option}>Highest</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Expenses List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <Text>{item.category} • {new Date(item.date).toDateString()}</Text>
            {item.note ? <Text style={styles.note}>📝 {item.note}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

// 🔹 Helper functions
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isSameWeek(date, today = new Date()) {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = today - date;
  return diff >= 0 && diff < 7 * oneDay;
}

function isSameMonth(date, today = new Date()) {
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f7fa" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  summary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  breakdown: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  option: { fontSize: 16, color: "gray" },
  active: { fontSize: 16, fontWeight: "600", color: "#2c7be5" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  amount: { fontSize: 18, fontWeight: "bold" },
  note: { color: "gray", fontStyle: "italic" },
});
