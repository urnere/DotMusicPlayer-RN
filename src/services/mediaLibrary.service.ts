import * as MediaLibrary from "expo-media-library";
import { SongAsset } from "../types/song.types";

export const requestMediaPermission = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
};

export const loadSongsFromLibrary = async (): Promise<SongAsset[]> => {
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.audio,
    first: 1000,
    sortBy: [MediaLibrary.SortBy.default],
  });
  return media.assets.filter((song) => song.duration > 60) as SongAsset[];
};
