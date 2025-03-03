import { View, FlatList, Text, StyleSheet } from "react-native";
import { useMediaLibrary } from "../../src/hooks/useMediaLibrary";
import { SongItem } from "../../src/components/SongItem";
import { SongAsset } from "../../src/types/song.types";
import { useEffect } from "react";
import { usePlayer } from "../../src/context/PlayerContext";

export default function Library() {
  const { songs, permission } = useMediaLibrary();
  const { setSongs } = usePlayer();
  useEffect(() => {
    if (songs.length > 0) {
      setSongs(songs);
    }
  }, [songs]);
  return (
    <View style={styles.container}>
      {!permission ? (
        <Text style={styles.permissionText}>
          Müzik dosyalarına erişim izni gerekli
        </Text>
      ) : (
        <FlatList<SongAsset>
          data={songs}
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
  permissionText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "outfit-m",
  },
});
