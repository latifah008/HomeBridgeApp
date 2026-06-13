import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import api from "../src/api/client";


interface Profile {
  user_id: number;
  display_name: string;
  country_of_origin: string;
  current_city: string;
  profession: string;
  languages: string[];
  bio: string;
  last_active_at: string;
  avatar: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DiscoverScreen() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["profiles", search, country, city],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.q = search;
      if (country) params.country = country;
      if (city) params.city = city;
      const res = await api.get("/api/profiles/", { params });
      return res.data;
    },
  });

  const profiles: Profile[] = data?.results ?? [];

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      className="bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl p-4 mb-3 flex-row items-center gap-x-4"
      activeOpacity={0.8}
      onPress={() => router.push(`/profile/${item.user_id}`)}
    >
      {/* Avatar */}
      <View className="w-14 h-14 rounded-full bg-[#FFE9D6] items-center justify-center overflow-hidden">
        {item.avatar ? (
          <Image
            source={{ uri: `${API_URL}${item.avatar}` }}
            className="w-14 h-14 rounded-full"
          />
        ) : (
          <Text className="text-2xl">👤</Text>
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-[#0E1B2A] font-bold text-base">
          {item.display_name}
        </Text>
        {item.profession ? (
          <Text className="text-[#4B5563] text-xs mt-0.5">{item.profession}</Text>
        ) : null}
        <View className="flex-row flex-wrap gap-x-2 mt-1">
          {item.country_of_origin ? (
            <Text className="text-[#9CA3AF] text-xs">🌍 {item.country_of_origin}</Text>
          ) : null}
          {item.current_city ? (
            <Text className="text-[#9CA3AF] text-xs">📍 {item.current_city}</Text>
          ) : null}
        </View>
        {item.languages?.length > 0 ? (
          <Text className="text-[#0FA3B1] text-xs mt-1">
            🗣 {item.languages.join(", ")}
          </Text>
        ) : null}
      </View>

      {/* Arrow */}
      <Text className="text-[#FF6B3D] text-lg">›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7EE]">
      <View className="flex-1 px-4 pt-4">

        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-[#0E1B2A]">Discover 🌍</Text>
          <Text className="text-sm text-[#4B5563]">
            Find people from your home country
          </Text>
        </View>

        {/* Search */}
        <TextInput
          className="bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl px-4 py-3 text-[#0E1B2A] mb-3"
          placeholder="Search by name, profession, bio..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        <View className="flex-row gap-x-2 mb-4">
          <TextInput
            className="flex-1 bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl px-4 py-3 text-[#0E1B2A]"
            placeholder="Country"
            placeholderTextColor="#9CA3AF"
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            className="flex-1 bg-[#FFF3E6] border border-[#FFE9D6] rounded-2xl px-4 py-3 text-[#0E1B2A]"
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Results count */}
        {data?.count !== undefined && (
          <Text className="text-xs text-[#9CA3AF] mb-3">
            {data.count} {data.count === 1 ? "person" : "people"} found
          </Text>
        )}

        {/* Loading */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF6B3D" />
            <Text className="text-[#4B5563] mt-3">Finding your community...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-500 text-center mb-4">
              Failed to load profiles. Please try again.
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B3D] rounded-2xl px-6 py-3"
              onPress={() => refetch()}
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : profiles.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-[#0E1B2A] font-bold text-lg">No results found</Text>
            <Text className="text-[#4B5563] text-sm mt-1 text-center">
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(item) => String(item.user_id)}
            renderItem={renderProfile}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#FF6B3D"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}