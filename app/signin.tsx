import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../src/api/client";
import * as SecureStore from "expo-secure-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define your navigation types (adjust based on your actual Stack names)
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

interface LoginResponse {
  access: string;
  refresh: string;
}

export default function SignIn({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both credentials.");
      return;
    }

    try {
      const res = await api.post<LoginResponse>("/api/auth/login/", {
        username,
        password,
      });

      await SecureStore.setItemAsync("access", res.data.access);
      await SecureStore.setItemAsync("refresh", res.data.refresh);

      Alert.alert("Success", "Logged in!");
      // navigation.replace("Home"); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Login failed";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleLogin} color="#2196F3" />
      <View style={styles.footer}>
        <Button 
          title="Go to Sign Up" 
          onPress={() => navigation.navigate("SignUp")} 
          color="#666" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  footer: { marginTop: 20 }
});