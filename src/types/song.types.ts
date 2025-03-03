import * as MediaLibrary from "expo-media-library";

export interface SongAsset extends MediaLibrary.Asset {
  filename: string;
  uri: string;
  id: string;
}