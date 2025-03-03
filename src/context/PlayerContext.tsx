import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Audio } from "expo-av";
import { SongAsset } from "../types/song.types";
import { router } from "expo-router";
import NotificationService from "../services/NotificationService";
import AudioService from "../services/AudioService";

interface PlayerContextType {
  currentSong: SongAsset | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  playSound: (song: SongAsset) => Promise<void>;
  pauseSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  playNextSong: () => Promise<void>;
  playPreviousSong: () => Promise<void>;
  songs: SongAsset[];
  setSongs: (songs: SongAsset[]) => void;
  favorites: SongAsset[];
  addToFavorites: (song: SongAsset) => void;
  removeFromFavorites: (song: SongAsset) => void;
  isFavorite: (song: SongAsset) => boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [currentSong, setCurrentSong] = useState<SongAsset | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<SongAsset[]>([]);
  const [favorites, setFavorites] = useState<SongAsset[]>([]);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const setup = async () => {
      await AudioService.setup();
      await NotificationService.setup();
    };
    setup();
  }, []);
  useEffect(() => {
    if (currentSong) {
      NotificationService.showPlaybackNotification(
        currentSong,
        isPlaying,
        position,
        duration
      );
    }
  }, [currentSong, isPlaying]);
  useEffect(() => {
    const subscription = NotificationService.addPlaybackListener({
      onPlay: async () => {
        if (sound && currentSong) {
          await resumeSound();
        }
      },
      onPause: async () => {
        if (sound && currentSong) {
          await pauseSound();
        }
      },
      onNext: async () => {
        if (sound && currentSong && songs.length > 0) {
          const currentIndex = songs.findIndex(
            (song) => song.id === currentSong.id
          );
          const nextIndex = currentIndex + 1;

          if (nextIndex < songs.length) {
            await sound.stopAsync();
            setIsPlaying(false);
            await playSound(songs[nextIndex]);
          }
        }
      },
      onPrevious: async () => {
        if (sound && currentSong && songs.length > 0) {
          const currentIndex = songs.findIndex(
            (song) => song.id === currentSong.id
          );
          const previousIndex = currentIndex - 1;

          if (previousIndex >= 0) {
            await sound.stopAsync();
            setIsPlaying(false);
            await playSound(songs[previousIndex]);
          }
        }
      },
    });

    return () => subscription.remove();
  }, [sound, currentSong, songs]);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);

          if (status.didJustFinish) {
            playNextSong();
          }
        }
      });
    }
  }, [sound]);

  const playSound = async (song: SongAsset) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const newSound = await AudioService.createSound(song.uri);
      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await playNextSong();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const pauseSound = async () => {
    if (sound && currentSong) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound && currentSong) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const playNextSong = async () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const nextIndex = currentIndex + 1;

      if (nextIndex >= songs.length) {
        await stopSound();
        return;
      }
      await playSound(songs[nextIndex]);
    }
  };

  const playPreviousSong = async () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const previousIndex = currentIndex - 1;

      if (previousIndex < 0) return;
      await playSound(songs[previousIndex]);
    }
  };

  const addToFavorites = (song: SongAsset) => {
    setFavorites((prev) => [...prev, song]);
  };

  const removeFromFavorites = (song: SongAsset) => {
    setFavorites((prev) => prev.filter((s) => s.id !== song.id));
  };

  const isFavorite = (song: SongAsset) => {
    return favorites.some((s) => s.id === song.id);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        sound,
        songs,
        setSongs,
        playSound,
        pauseSound,
        resumeSound,
        stopSound,
        playNextSong,
        playPreviousSong,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
