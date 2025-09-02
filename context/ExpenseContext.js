import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Other",
  ]);

  // 🔄 Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem("expenses");
        const storedCategories = await AsyncStorage.getItem("categories");

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCategories) setCategories(JSON.parse(storedCategories));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // 💾 Save expenses
  const saveExpenses = async (newExpenses) => {
    setExpenses(newExpenses);
    await AsyncStorage.setItem("expenses", JSON.stringify(newExpenses));
  };

  // 💾 Save categories
  const saveCategories = async (newCategories) => {
    setCategories(newCategories);
    await AsyncStorage.setItem("categories", JSON.stringify(newCategories));
  };

  // ➕ Add new expense
  const addExpense = (expense) => {
    const newExpenses = [expense, ...expenses];
    saveExpenses(newExpenses);
  };

  // ➕ Add new category
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      saveCategories(newCategories);
    }
  };

  // 🗑️ Clear all data
  // 🗑️ Clear all data
const clearAll = async () => {
  try {
    // Remove keys from AsyncStorage
    await AsyncStorage.multiRemove(["expenses", "categories"]);

    // Reset state
    setExpenses([]);
    setCategories(["Food", "Transport", "Shopping", "Bills", "Other"]);

    // ✅ Ensure AsyncStorage reflects the reset defaults
    await AsyncStorage.setItem(
      "categories",
      JSON.stringify(["Food", "Transport", "Shopping", "Bills", "Other"])
    );

    return true;
  } catch (e) {
    console.error("Failed to clear data", e);
    return false;
  }
};


  // 📤 Export expenses as CSV
  const exportData = async () => {
    try {
      const data = expenses.map((e) => ({
        date: e.date,
        category: e.category,
        amount: e.amount,
      }));

      const csv =
        "Date,Category,Amount\n" +
        data.map((row) => `${row.date},${row.category},${row.amount}`).join("\n");

      if (Platform.OS === "web") {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "expenses.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert("Data exported! Check your Downloads folder.");
      } else {
        const fileUri = FileSystem.documentDirectory + "expenses.csv";
        await FileSystem.writeAsStringAsync(fileUri, csv);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          alert("Sharing is not available on this device");
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        addCategory,
        clearAll,
        exportData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
