import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { usePlayer } from "../../src/context/PlayerContext";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Player() {
  const {
    currentSong,
    isPlaying,
    pauseSound,
    resumeSound,
    stopSound,
    sound,
    playNextSong,
    playPreviousSong,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = usePlayer();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (sound) {
      const updatePosition = async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
        }
      };

      const interval = setInterval(updatePosition, 1000);
      return () => clearInterval(interval);
    }
  }, [sound]);

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>No song selected</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        {currentSong && (
          <TouchableOpacity
            onPress={() =>
              isFavorite(currentSong)
                ? removeFromFavorites(currentSong)
                : addToFavorites(currentSong)
            }
          >
            <FontAwesome
              name={isFavorite(currentSong) ? "heart" : "heart-o"}
              size={24}
              color={isFavorite(currentSong) ? "#D98324" : "#443627"}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/player.png")}
          style={styles.playerImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
          {currentSong.filename}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#D98324"
          maximumTrackTintColor="#443627"
          thumbTintColor="#D98324"
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.otherButton} onPress={stopSound}>
          <FontAwesome6 name="stop" size={30} color="#443627" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherButton} onPress={playPreviousSong}>
          <FontAwesome6 name="backward-step" size={30} color="#443627" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => (isPlaying ? pauseSound() : resumeSound())}
        >
          <FontAwesome6
            name={isPlaying ? "pause" : "play"}
            size={30}
            color="#D98324"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherButton} onPress={playNextSong}>
          <FontAwesome6 name="forward-step" size={30} color="#443627" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6D0",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  songInfo: {
    alignItems: "center",
    marginVertical: 50,
    height: 60,
  },
  songTitle: {
    fontSize: 20,
    fontFamily: "outfit-b",
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 27,
    marginBottom: 5,
  },
  otherButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFDCAB",
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "outfit-r",
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#EFDCAB",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  playerImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});
