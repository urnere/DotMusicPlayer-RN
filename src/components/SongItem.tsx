import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SongAsset } from "../types/song.types";
import { FontAwesome } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { router } from "expo-router";

interface SongItemProps {
  song: SongAsset;
}

export function SongItem({ song }: SongItemProps) {
  const { playSound, currentSong, isFavorite } = usePlayer();

  const isPlaying = currentSong?.id === song.id;
  const handlePress = async () => {
    await playSound(song);
    router.push("/(tabs)/player");
  };

  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.playingContainer]}
      onPress={handlePress}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <View style={styles.songInfo}>
        <Text
          style={[styles.songTitle, isPlaying && styles.playingText]}
          numberOfLines={1}
        >
          {song.filename}
        </Text>
      </View>
      {isFavorite(song) && (
        <FontAwesome name="heart" size={24} color="#D98324" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EFDCAB",
  },
  playingContainer: {
    backgroundColor: "#EFDCAB",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontFamily: "outfit-m",
  },
  playingText: {
    color: "#D98324",
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
