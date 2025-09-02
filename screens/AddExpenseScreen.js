import { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ExpenseContext } from "../context/ExpenseContext";
import Toast from "react-native-toast-message"; // ✅ import toast

export default function AddExpenseScreen() {
  const { addExpense, categories } = useContext(ExpenseContext);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (!amount) return;

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString(),
    };

    addExpense(newExpense);

    // ✅ Show toast after adding expense
    Toast.show({
      type: "success",
      text1: "Expense Added",
      text2: `₹${amount} added under ${category}`,
      position: "top",
      visibilityTime: 2000,
    });

    setAmount("");
    setNote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Expense</Text>

      <TextInput
        placeholder="Enter amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <TextInput
        placeholder="Optional note"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
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
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
