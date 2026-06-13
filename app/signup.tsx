import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import api from "../src/api/client";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name: string;
  country_of_origin?: string;
  current_city?: string;
  languages: string[];
}

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    display_name: "",
    country_of_origin: "",
    current_city: "",
    languages: [],
  });

  const [languagesInput, setLanguagesInput] = useState("");

  const handleRegister = async () => {
    const { username, email, password, display_name } = formData;
    if (!username || !email || !password || !display_name) {
      Alert.alert("Error", "Required fields are missing.");
      return;
    }

    const languages = languagesInput
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      // Step 1: Register
      await api.post("/api/auth/register/", {
        ...formData,
        languages,
      });

      // Step 2: Auto-login to get tokens
      const loginRes = await api.post("/api/auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      await SecureStore.setItemAsync("access", loginRes.data.access);
      await SecureStore.setItemAsync("refresh", loginRes.data.refresh);

      router.replace("/home");
    } catch (err: any) {
      console.log("REGISTER ERROR:", JSON.stringify(err?.response?.data, null, 2));
      console.log("STATUS:", err?.response?.status);

      const data = err?.response?.data;
      const message =
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.display_name?.[0] ||
        data?.non_field_errors?.[0] ||
        data?.detail ||
        "Registration failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7EE]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>

        {/* Back to Home */}
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mb-6 flex-row items-center"
        >
          <Text className="text-[#FF6B3D] font-semibold text-sm">← Back to Home</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-3xl font-bold text-[#0E1B2A] mb-2">
          Join HomeBridge 🌍
        </Text>
        <Text className="text-sm text-[#4B5563] mb-8">
          Connect with people from your home country.
        </Text>

        {/* Display Name */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Display Name *</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="Name shown to others"
          placeholderTextColor="#9CA3AF"
          onChangeText={(t) => setFormData({ ...formData, display_name: t })}
        />

        {/* Username */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Username *</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="e.g. jane_doe"
          placeholderTextColor="#9CA3AF"
          onChangeText={(t) => setFormData({ ...formData, username: t })}
          autoCapitalize="none"
        />

        {/* Email */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Email *</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="jane@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          onChangeText={(t) => setFormData({ ...formData, email: t })}
          autoCapitalize="none"
        />

        {/* Password */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Password *</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="Create a strong password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          onChangeText={(t) => setFormData({ ...formData, password: t })}
        />

        {/* Country of Origin */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Country of Origin</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="e.g. Cameroon"
          placeholderTextColor="#9CA3AF"
          onChangeText={(t) => setFormData({ ...formData, country_of_origin: t })}
        />

        {/* Current City */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Current City</Text>
        <TextInput
          className="mb-4 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="e.g. Montreal"
          placeholderTextColor="#9CA3AF"
          onChangeText={(t) => setFormData({ ...formData, current_city: t })}
        />

        {/* Languages */}
        <Text className="text-sm font-semibold text-[#1F2A37] mb-1">Languages</Text>
        <TextInput
          className="mb-8 h-12 rounded-2xl border border-[#FFE9D6] bg-[#FFF3E6] px-4 text-[#0E1B2A]"
          placeholder="e.g. French, English"
          placeholderTextColor="#9CA3AF"
          value={languagesInput}
          onChangeText={setLanguagesInput}
        />

        {/* Register Button */}
        <Pressable
          className="bg-[#FF6B3D] rounded-2xl py-4 items-center active:opacity-80"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Create Account</Text>
          )}
        </Pressable>

        {/* Sign in link */}
        <Pressable className="mt-6" onPress={() => router.push("/signin")}>
          <Text className="text-center text-[#4B5563] text-sm">
            Already have an account?{" "}
            <Text className="text-[#FF6B3D] font-bold">Sign In</Text>
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
