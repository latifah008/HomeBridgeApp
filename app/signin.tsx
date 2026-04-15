import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import api from "../src/api/client";

interface LoginResponse {
  access: string;
  refresh: string;
}

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      // router.replace("/home");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Login failed";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 justify-center px-5">
        <Text className="mb-6 text-2xl font-bold text-neutral-800">
          Sign in
        </Text>

        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Username or Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Pressable
          className="rounded-lg bg-blue-500 py-3 active:opacity-80"
          onPress={handleLogin}
        >
          <Text className="text-center text-base font-semibold text-white">
            Sign In
          </Text>
        </Pressable>

        <Pressable className="mt-5" onPress={() => router.push("/signup")}>
          <Text className="text-center text-neutral-500">
            Don&apos;t have an account? Sign up
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
