import { View, FlatList, Text, StyleSheet } from "react-native";
import { usePlayer } from "../../src/context/PlayerContext";
import { SongItem } from "../../src/components/SongItem";

export default function Favorites() {
  const { favorites } = usePlayer();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Henüz favori müzik eklenmedi</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongItem song={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6D0",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "outfit-m",
    color: "#666",
  },
});
