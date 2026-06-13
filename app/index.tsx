import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF7EE]">
      <View className="flex-1 px-6 pt-10 pb-8 justify-between">

        {/* Top Brand */}
        <View className="items-center mt-6">
          <View className="w-16 h-16 rounded-2xl bg-[#FF6B3D] items-center justify-center mb-4">
            <Text className="text-white text-3xl">🌍</Text>
          </View>
          <Text className="text-4xl font-bold text-[#0E1B2A] tracking-tight">
            HomeBridge
          </Text>
          <Text className="text-base text-[#4B5563] mt-2 text-center">
            Belongia — Connect with people{"\n"}from your home country.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View className="gap-y-4 my-8">
          <FeatureCard
            emoji="🤝"
            title="Find Your Community"
            description="Discover immigrants and expats from your home country wherever you are."
          />
          <FeatureCard
            emoji="💬"
            title="Direct Messaging"
            description="Have private 1-to-1 conversations with people who understand your journey."
          />
          <FeatureCard
            emoji="🔍"
            title="Smart Discovery"
            description="Filter by country, city, language, or profession to find the right people."
          />
        </View>

        {/* CTA Buttons */}
        <View className="gap-y-3">
          <TouchableOpacity
            className="bg-[#FF6B3D] rounded-2xl py-4 items-center"
            onPress={() => router.push("/signup")}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl py-4 items-center"
            onPress={() => router.push("/signin")}
            activeOpacity={0.85}
          >
            <Text className="text-[#FF6B3D] font-bold text-base">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer note */}
        <Text className="text-center text-xs text-[#9CA3AF] mt-4">
          By continuing, you agree to our Terms of Service{"\n"}and Privacy Policy.
        </Text>

      </View>
    </SafeAreaView>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-start bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl p-4 gap-x-4">
      <View className="w-10 h-10 rounded-xl bg-[#FFE9D6] items-center justify-center">
        <Text className="text-xl">{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[#0E1B2A] font-semibold text-sm">{title}</Text>
        <Text className="text-[#4B5563] text-xs mt-1 leading-5">{description}</Text>
      </View>
    </View>
  );
}