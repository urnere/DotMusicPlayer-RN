import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { router } from "expo-router";

export const PlayerControls = () => {
  const { currentSong, isPlaying, pauseSound, resumeSound } = usePlayer();

  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playerBar}
        onPress={() => router.push("/(tabs)/player")}
      >
        <Text style={styles.songTitle} numberOfLines={1}>
          {currentSong.filename}
        </Text>
        <TouchableOpacity
          onPress={() => (isPlaying ? pauseSound() : resumeSound())}
        >
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  playerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  songTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit-m",
    marginRight: 15,
  },
});
