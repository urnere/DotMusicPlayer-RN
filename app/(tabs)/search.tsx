import { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { usePlayer } from "../../src/context/PlayerContext";
import { SongItem } from "../../src/components/SongItem";
import { SongAsset } from "../../src/types/song.types";

export default function Search() {
  const { songs } = usePlayer();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SongAsset[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredSongs = songs.filter((song) =>
      song.filename.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredSongs);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Müzik ara..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <FontAwesome name="times-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {searchResults.length === 0 && searchQuery.length > 0 ? (
        <Text style={styles.noResults}>Sonuç bulunamadı</Text>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongItem song={item} />}
          ListEmptyComponent={
            <Text style={styles.placeholder}>
              Aramak istediğiniz müziği yazın
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6D0",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFDCAB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: "outfit-r",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontFamily: "outfit-m",
  },
  placeholder: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontFamily: "outfit-r",
  },
});
