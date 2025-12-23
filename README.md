# Myapp - Professional React Native App

A modern React Native application built with Expo, featuring Context API for state management, authentication, and product management.

## 🚀 Features

- **Authentication System**: Secure login with token-based authentication
- **Product Management**: Browse and view product details
- **Context API**: Professional state management using React Context
- **Theme Support**: Dark and light mode themes
- **Navigation**: React Navigation integrated with Expo Router
- **Responsive Design**: Works seamlessly on web, iOS, and Android

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/03481858848/Myapp.git
   cd Myapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🎯 Usage

### Web
```bash
npm run web
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## 📱 App Structure

```
app/
├── context/          # Context providers (Auth, API, Theme, Loader)
├── navigation/       # Navigation configuration
├── screens/          # Screen components
│   ├── LoginScreen.tsx
│   ├── ProductList.tsx
│   └── ProductDetails.tsx
└── _layout.tsx       # Root layout

components/           # Reusable components
```

## 🔐 Login Credentials

- **Email**: sahil123@gmail.com
- **Password**: Sahil12345

## 🛠️ Tech Stack

- **React Native**: 0.81.5
- **Expo**: ~54.0.30
- **React Navigation**: ^7.1.26
- **Expo Router**: ~6.0.21
- **Axios**: ^1.13.2
- **TypeScript**: ~5.9.2

## 📦 Key Dependencies

- `@react-navigation/native` - Navigation library
- `expo-router` - File-based routing
- `axios` - HTTP client
- `react-native-toast-message` - Toast notifications
- `@react-native-async-storage/async-storage` - Local storage

## 🎨 Features in Detail

### Authentication
- Token-based authentication
- Persistent login with AsyncStorage/localStorage
- Secure credential handling

### Product Management
- Product listing with search functionality
- Product details view
- Pull-to-refresh support

### Theme Management
- Dark/Light mode toggle
- System theme detection
- Smooth theme transitions

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

Built with ❤️ using React Native and Expo
