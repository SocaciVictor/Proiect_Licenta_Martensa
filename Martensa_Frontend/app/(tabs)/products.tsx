import CategoryGridItem from "@/modules/products/components/CategoryGridItem";
import SearchOverlay from "@/modules/products/components/SearchOverlay";
import { useCategories } from "@/modules/products/hooks/useCategories";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const categoryImages: Record<string, string> = {
  "Fructe și legume proaspete": "https://i.imgur.com/S5ijDKx.png",
  "Lactate și ouă": "https://i.imgur.com/IQXD4Se.png",
  "Mezeluri, carne și ready meal": "https://i.imgur.com/m4xbtfk.png",
  "Produse congelate": "https://i.imgur.com/rgOiN15.png",
  "Pâine, cafea, cereale și mic dejun":
    "https://static.mega-image.ro/site/binaries/_ht_1728474230971/content/gallery/header-categories-images/mic-dejun.png",
  "Dulciuri și snacks":
    "https://e7.pngegg.com/pngimages/217/612/png-clipart-snack-coffee-donuts-food-drink-coffee-dried-fruit-food.png",
  "Ingrediente culinare":
    "https://e7.pngegg.com/pngimages/936/301/png-clipart-various-ingredients-kitchen-spices-star-anise-paprika.png",
  "Apă și sucuri":
    "https://www.maspex.ro/wp-content/uploads/2024/12/2c47e43d-f717-4003-9daa-d82a70a0faa8.png",
  Băuturi:
    "https://www.maspex.ro/wp-content/uploads/2022/11/categori_Zubrowka.png",
  "Mama și îngrijire copil":
    "https://e7.pngegg.com/pngimages/92/841/png-clipart-infant-mother-child-care-woman-happy-mother-and-child-love-child.png",
  "Cosmetice și îngrijire personală":
    "https://api.globalstore.md/media/images/Design_f%C4%83r%C4%83_titlu_EHgm3Eu.png",
  "Curățenie și nealimentare":
    "https://e7.pngegg.com/pngimages/757/895/png-clipart-cleanliness-detergent-household-organization-house-company-service.png",
  "Animale de companie":
    "https://e7.pngegg.com/pngimages/175/330/png-clipart-dog-pet-sitting-veterinarian-animal-pet-sitter-cat-like-mammal-carnivoran.png",
};

export default function ProductsScreen() {
  const { categories, loading } = useCategories();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-3 pt-2">
      <SearchOverlay />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <Text className="text-xl font-bold text-gray-900 mb-3 mt-2">
          Categorii
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category) => (
            <CategoryGridItem
              key={category.id}
              name={category.name}
              imageUrl={categoryImages[category.name]}
              onPress={() =>
                router.push({
                  pathname: "/products/[categoryId]",
                  params: {
                    categoryId: category.id,
                    name: category.name,
                  },
                })
              }
            />
          ))}
        </View>

        {loading && (
          <Text className="text-center text-gray-500 my-4">Se încarcă...</Text>
        )}
      </ScrollView>
    </View>
  );
}
