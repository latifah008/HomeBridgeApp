import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import api from "../src/api/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name: string;
  country_of_origin?: string;
  current_city?: string;
  languages: string[];
}

export default function SignUp({ navigation }: Props) {
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
        { text: "Log In", onPress: () => navigation.navigate("SignIn") }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username*"
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email*"
        keyboardType="email-address"
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Display Name*"
        onChangeText={(text) => setFormData({ ...formData, display_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password*"
        secureTextEntry
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        onChangeText={(text) => setFormData({ ...formData, country_of_origin: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        onChangeText={(text) => setFormData({ ...formData, current_city: text })}
      />
      <Button title="Register" onPress={handleRegister} color="#4CAF50" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
