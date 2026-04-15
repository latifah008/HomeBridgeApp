import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    display_name: "",
    country_of_origin: "",
    current_city: "",
    languages: [],
  });

  const handleRegister = async () => {
    const { username, email, password, display_name } = formData;

    if (!username || !email || !password || !display_name) {
      Alert.alert("Error", "Required fields are missing.");
      return;
    }

    try {
      await api.post("/api/auth/register/", formData);
      Alert.alert("Success", "Account created!", [
        { text: "Log In", onPress: () => router.replace("/signin") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.detail || "Registration failed"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-6 text-2xl font-bold text-neutral-800">
          Create account
        </Text>

        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Username*"
          onChangeText={(t) => setFormData({ ...formData, username: t })}
          autoCapitalize="none"
        />
        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Email*"
          keyboardType="email-address"
          onChangeText={(t) => setFormData({ ...formData, email: t })}
          autoCapitalize="none"
        />
        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Display Name*"
          onChangeText={(t) => setFormData({ ...formData, display_name: t })}
        />
        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Password*"
          secureTextEntry
          onChangeText={(t) => setFormData({ ...formData, password: t })}
        />
        <TextInput
          className="mb-4 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="Country"
          onChangeText={(t) =>
            setFormData({ ...formData, country_of_origin: t })
          }
        />
        <TextInput
          className="mb-6 h-12 rounded-lg border border-neutral-300 bg-white px-3"
          placeholder="City"
          onChangeText={(t) => setFormData({ ...formData, current_city: t })}
        />

        <Pressable
          className="rounded-lg bg-green-600 py-3 active:opacity-80"
          onPress={handleRegister}
        >
          <Text className="text-center text-base font-semibold text-white">
            Register
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
