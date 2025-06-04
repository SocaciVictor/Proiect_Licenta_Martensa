import * as SecureStore from "expo-secure-store";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_LENGTH = 5;

export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const data = await SecureStore.getItemAsync(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Eroare la citirea istoricului:", error);
    return [];
  }
};

export const addToSearchHistory = async (term: string): Promise<void> => {
  const cleaned = term.trim();
  if (!cleaned) return;

  try {
    const current = await getSearchHistory();
    const updated = [cleaned, ...current.filter((t) => t !== cleaned)].slice(
      0,
      MAX_HISTORY_LENGTH
    );
    await SecureStore.setItemAsync(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Eroare la salvarea în istoric:", error);
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Eroare la ștergerea istoricului:", error);
  }
};
