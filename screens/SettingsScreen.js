import { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
} from "react-native";
import { ExpenseContext } from "../context/ExpenseContext";
import { PieChart, BarChart } from "react-native-chart-kit";
import Toast from "react-native-toast-message";

const screenWidth = Dimensions.get("window").width - 40; // responsive width

export default function SettingsScreen() {
  const { expenses, categories, addCategory, clearAll, exportData } = useContext(ExpenseContext);
  const [newCategory, setNewCategory] = useState("");

  //  Add new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
    setNewCategory("");

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Category Added",
      position: "top",
      visibilityTime: 2000,
    });
  };

  //  Clear all data
  const handleClear = async () => {
    await clearAll();

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "All data cleared!",
      position: "top",
      visibilityTime: 2000,
    });
  };

  // Pie Chart Data
  const colors = ["#f54291", "#42f554", "#4287f5", "#f5a742", "#9b59b6", "#1abc9c"];
  const categoryTotals = categories.map((cat, i) => {
    const total = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    return {
      name: cat,
      population: total,
      color: colors[i % colors.length],
      legendFontColor: "#000",
      legendFontSize: 14,
    };
  });

  // Bar Chart Data
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const dailyTotals = weekDays.map((_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + index);

    return expenses
      .filter((e) => {
        const expDate = new Date(e.date);
        return (
          expDate.getFullYear() === day.getFullYear() &&
          expDate.getMonth() === day.getMonth() &&
          expDate.getDate() === day.getDate()
        );
      })
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  });

  const barData = {
    labels: weekDays,
    datasets: [{ data: dailyTotals }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(44, 123, 229, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>⚙️ Manage Categories</Text>

      <TextInput
        placeholder="Add new category"
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
        <Text style={styles.buttonText}>Add Category</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Existing Categories:</Text>
      {categories.map((cat) => (
        <Text key={cat} style={styles.catItem}>
          • {cat}
        </Text>
      ))}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleClear}
      >
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>📊 Charts</Text>

      <Text style={styles.subtitle}>Monthly Spending by Category</Text>
      {expenses.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={categoryTotals}
            width={Math.min(screenWidth - 40, 350)}
            height={Math.min(screenWidth - 40, 350) * 0.6}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={"0"}
            absolute
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}

      <Text style={styles.subtitle}>Daily Spending This Week</Text>
      {expenses.length > 0 ? (
        <View style={{ marginVertical: 10 }}>
          <BarChart
            data={barData}
            width={screenWidth}
            height={220}
            yAxisLabel="₹"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}

      <TouchableOpacity
        style={[styles.button, { marginTop: 30 }]}
        onPress={exportData}
        disabled={expenses.length === 0}
      >
        <Text style={[styles.buttonText, expenses.length === 0 && { opacity: 0.5 }]}>
          Export Data
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, color: "#2c7be5" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2c7be5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  subtitle: { fontSize: 18, marginVertical: 10, fontWeight: "500" },
  catItem: { fontSize: 16, marginLeft: 10, marginBottom: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginTop: 25, marginBottom: 10 },
  noDataText: { textAlign: "center", marginVertical: 20, fontStyle: "italic", color: "#888" },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
