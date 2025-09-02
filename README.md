# Expense Tracker App (React Native + Expo)

A simple, modern expense tracker app built with React Native, Expo, and Context API. Track your daily, weekly, and monthly expenses, visualize spending with charts, and manage categories easily.

---

## Features

- 📱 **Cross-platform**: Works on Android, iOS, and Web (via Expo)
- 🏷️ **Category Management**: Add, view, and manage expense categories
- 💸 **Expense Tracking**: Add expenses with category, amount, date, and note
- 📊 **Charts**: Visualize monthly spending by category (Pie Chart) and daily spending (Bar Chart)
- 🔍 **Search & Filter**: Search expenses by note, filter and sort by category or amount
- 🧹 **Clear All Data**: Reset all expenses and categories with one tap
- 📤 **Export Data**: Export your expenses as CSV (works on both web and native)
- 🎨 **Responsive UI**: Looks great on all screen sizes
- 🔔 **Toast Notifications**: Instant feedback for actions


## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```sh
  npm install -g expo-cli
  ```

### 2. Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

### 3. Running the App

- **Start the Expo server:**
  ```sh
  npx expo start
  ```
- **On your device:**
  - Download the Expo Go app from the App Store or Google Play
  - Scan the QR code from the terminal or browser
- **On web:**
  - Press `w` in the Expo CLI to open in your browser

---

## Project Structure

```
MyApp/
  App.js                # App entry point, wraps everything in providers
  context/
    ExpenseContext.js   # Context API for global state (expenses, categories)
  navigation/
    BottomTabs.js       # Bottom tab navigation setup
  screens/
    HomeScreen.js       # Dashboard with summary, search, and list
    AddExpenseScreen.js # Add a new expense
    SettingsScreen.js   # Manage categories, charts, export, clear all
  assets/               # App icons and images
  package.json          # Project dependencies and scripts
  ...
```

---

## Key Dependencies
- **React Native**: UI framework
- **Expo**: Build, run, and deploy easily
- **@react-navigation**: Navigation and tabs
- **react-native-chart-kit**: Beautiful charts
- **@react-native-async-storage/async-storage**: Persistent storage
- **expo-file-system, expo-sharing**: Exporting data
- **react-native-toast-message**: Toast notifications

---

## Customization
- Edit `context/ExpenseContext.js` to change default categories
- Update styles in each screen for your brand
- Add more features (recurring expenses, budgets, etc.) as needed

---

## Troubleshooting
- If you see errors about missing dependencies, run `npm install` again
- For iOS/Android device issues, try restarting Expo Go and your device
- For web, use Chrome or Firefox for best results

---

## License
MIT

---

## Author
- Your Name (replace with your info)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- [react-navigation](https://reactnavigation.org/)
