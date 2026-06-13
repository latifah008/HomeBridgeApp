import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both credentials.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/api/auth/login/", {
        username,
        password,
      });

      await SecureStore.setItemAsync("access", res.data.access);
      await SecureStore.setItemAsync("refresh", res.data.refresh);

      router.replace("/home");
    } catch (err: any) {
      console.log("LOGIN ERROR:", JSON.stringify(err?.response?.data, null, 2));
      console.log("STATUS:", err?.response?.status);
      const errorMsg =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        "Login failed. Please try again.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7EE]">
      <View className="flex-1 px-6 pt-6">

        {/* Back to Home */}
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mb-8"
        >
          <Text className="text-[#FF6B3D] font-semibold text-sm">← Back to Home</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-3xl font-bold text-[#0E1B2A] mb-2">
          Welcome back 👋
        </Text>
        <Text className="text-sm text-[#4B5563] mb-8">
          Sign in to reconnect with your community.
        </Text>

        {/* Username */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">
          Username or Email
        </Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="e.g. jane_doe"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Password */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">
          Password
        </Text>
        <TextInput
          className="mb-2 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="Your password"
          placeholderTextColor="#9CA3AF"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        <Pressable className="mb-8 items-end">
          <Text className="text-sm text-[#0FA3B1] font-medium">
            Forgot password?
          </Text>
        </Pressable>

        {/* Sign In Button */}
        <Pressable
          className="bg-[#FF6B3D] rounded-2xl py-4 items-center active:opacity-80"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </Pressable>

        {/* Sign up link */}
        <Pressable className="mt-6" onPress={() => router.push("/signup")}>
          <Text className="text-center text-[#4B5563] text-sm">
            Don't have an account?{" "}
            <Text className="text-[#FF6B3D] font-bold">Sign Up</Text>
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}