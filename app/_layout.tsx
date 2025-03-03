import { Stack } from "expo-router";
import { PlayerProvider } from "../src/context/PlayerContext";
import { useFonts } from "expo-font";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "outfit-m": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-r": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-b": require("../assets/fonts/Outfit-Bold.ttf"),
  });
  return (
    <PlayerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlayerProvider>
  );
}
