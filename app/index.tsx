import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// 1. Define the screens in your navigator
// 'undefined' means the route doesn't have parameters
export type RootStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

// 2. Define the props for this specific screen
type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

export default function Landing({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HomeBridge</Text>
        <Text style={styles.subtitle}>Connect your home, anywhere.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Login" 
          onPress={() => navigation.navigate("SignIn")} 
        />
        <View style={{ height: 15 }} /> 
        <Button 
          title="Create Account" 
          color="#4CAF50"
          onPress={() => navigation.navigate("SignUp")} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
