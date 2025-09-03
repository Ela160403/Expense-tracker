import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import BottomTabs from "./navigation/BottomTabs";
import { ExpenseProvider } from "./context/ExpenseContext";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <BottomTabs />
          <Toast />
        </View>
      </NavigationContainer>
    </ExpenseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appName: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    zIndex: 1, 
  },
});
    