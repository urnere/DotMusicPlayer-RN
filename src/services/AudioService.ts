import { Audio } from "expo-av";
import { SongAsset } from "../types/song.types";

class AudioService {
  static async setup() {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  }

  static async createSound(uri: string): Promise<Audio.Sound> {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false }
    );
    return sound;
  }
}

export default AudioService;