import { UserSummaryResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<UserSummaryResponse[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get<UserSummaryResponse[]>("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Eroare la fetch users:", err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert("Confirmare", "Sigur vrei să ștergi acest utilizator?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Șterge",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/users/${userId}`);
            fetchUsers(); // refresh list
          } catch (err) {
            console.error("Eroare la delete user:", err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Utilizatori</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold">
                {item.firstName} {item.lastName}
              </Text>
              <Text className="text-gray-600">{item.email}</Text>
            </View>
            {/* <TouchableOpacity
              onPress={() => handleDeleteUser(item.id)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              <Text className="text-white">Șterge</Text>
            </TouchableOpacity> */}
          </View>
        )}
      />
    </View>
  );
}
