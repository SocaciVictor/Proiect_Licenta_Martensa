import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProductSearch } from "../hooks/useProductSearch";

export default function SearchOverlay() {
  const {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    recentSearches,
    filtered,
    handleSelectProduct,
    handleClearSearch,
    clearSearchHistory,
  } = useProductSearch();

  return (
    <>
      {/* 🔍 BARA DE CĂUTARE */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mt-2 mb-1">
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          className="ml-2 flex-1 text-gray-600"
          placeholder="Search products"
          placeholderTextColor="#999"
          value={search}
          onFocus={() => setSearchOpen(true)}
          onChangeText={setSearch}
        />
        {searchOpen ? (
          <Ionicons
            name="close"
            size={22}
            color="#888"
            onPress={() => {
              Keyboard.dismiss();
              handleClearSearch();
            }}
          />
        ) : (
          <Ionicons name="qr-code-outline" size={22} color="#888" />
        )}
      </View>

      {/* 🔎 OVERLAY SCROLLABIL */}
      {searchOpen && (
        <View className="absolute top-16 left-0 right-0 bottom-0 bg-white z-50 px-4 pt-3">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            className="pb-12"
          >
            {/* 🕘 Istoric */}
            {search.length === 0 && recentSearches.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-500 font-semibold mb-2">
                  Căutări recente
                </Text>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => setSearch(item)}>
                    <Text className="text-gray-800 py-1">{item}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text className="text-red-500 text-sm mt-2">
                    Șterge istoricul
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 🔍 Rezultate */}
            {filtered.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="flex-row items-center py-2 border-b border-gray-200"
                onPress={() => handleSelectProduct(product.id, product.name)}
              >
                <Image
                  source={{ uri: product.imageUrl }}
                  className="w-12 h-12 rounded mr-3"
                  resizeMode="contain"
                />
                <Text className="text-base text-black">{product.name}</Text>
              </TouchableOpacity>
            ))}

            {/* 🫥 Fără rezultate */}
            {filtered.length === 0 && search.length > 0 && (
              <Text className="text-center mt-4 text-gray-400">
                Niciun rezultat găsit.
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
}
