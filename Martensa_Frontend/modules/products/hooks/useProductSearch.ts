import { useRefreshStore } from "@/hooks/useRefreshStore";
import {
  addToSearchHistory,
  clearSearchHistory,
  getSearchHistory,
} from "@/utils/searchHistory";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";

export const useProductSearch = () => {
  const { products, fetchAllProducts } = useProductStore();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    fetchAllProducts();
    loadSearchHistory();
  }, [refreshVersion]);

  const loadSearchHistory = async () => {
    const history = await getSearchHistory();
    setRecentSearches(history);
  };

  const handleSelectProduct = async (
    productId: number,
    productName: string
  ) => {
    await addToSearchHistory(productName);
    await loadSearchHistory();
    setSearch("");
    setSearchOpen(false);
    router.push(`/products/details/${productId}`);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    recentSearches,
    filtered,
    loadSearchHistory,
    handleSelectProduct,
    handleClearSearch,
    clearSearchHistory: async () => {
      await clearSearchHistory();
      setRecentSearches([]);
    },
  };
};
