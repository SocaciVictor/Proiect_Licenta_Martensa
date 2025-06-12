import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  const router = useRouter();

  type AdminRoute =
    | "/admin/users"
    | "/admin/products"
    | "/admin/orders"
    | "/admin/payments"
    | "/admin/stores"
    | "/admin/promotions";

  const sections: { title: string; route: AdminRoute }[] = [
    { title: "Gestiune Utilizatori", route: "/admin/users" },
    { title: "Gestiune Produse", route: "/admin/products" },
    { title: "Vizualizare Comenzi", route: "/admin/orders" },
    { title: "Vizualizare Plăți", route: "/admin/payments" },
    { title: "Gestiune Magazine", route: "/admin/stores" },
    { title: "Gestiune Promoții", route: "/admin/promotions" },
  ];

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold mb-6 text-center">
        Admin Dashboard
      </Text>

      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(section.route)}
          className="bg-green-600 rounded-lg py-4 px-6 mb-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {section.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
