import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 items-center justify-around p-5">
        <View className="items-center">
          <Text className="text-3xl font-bold text-neutral-800">HomeBridge</Text>
          <Text className="mt-2 text-base text-neutral-500">
            Connect your home, anywhere.
          </Text>
        </View>

        <View className="w-full px-5">
          <Pressable
            className="rounded-lg bg-blue-500 py-3 active:opacity-80"
            onPress={() => router.push("/signin")}
          >
            <Text className="text-center text-base font-semibold text-white">
              Login
            </Text>
          </Pressable>

          <View className="h-4" />

          <Pressable
            className="rounded-lg bg-green-600 py-3 active:opacity-80"
            onPress={() => router.push("/signup")}
          >
            <Text className="text-center text-base font-semibold text-white">
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
