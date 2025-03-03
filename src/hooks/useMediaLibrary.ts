import { useState, useEffect } from "react";
import { SongAsset } from "../types/song.types";
import { requestMediaPermission, loadSongsFromLibrary } from "../services/mediaLibrary.service";

export const useMediaLibrary = () => {
  const [songs, setSongs] = useState<SongAsset[]>([]);
  const [permission, setPermission] = useState<boolean>(false);

  useEffect(() => {
    initializeLibrary();
  }, []);

  const initializeLibrary = async () => {
    const hasPermission = await requestMediaPermission();
    setPermission(hasPermission);
    if (hasPermission) {
      const loadedSongs = await loadSongsFromLibrary();
      setSongs(loadedSongs);
    }
  };

  return { songs, permission };
};