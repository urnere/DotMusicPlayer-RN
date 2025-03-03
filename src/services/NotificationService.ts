import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SongAsset } from "../types/song.types";

class NotificationService {
  static async setup() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("playback-control", {
        name: "Playback Control",
        importance: Notifications.AndroidImportance.HIGH,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        sound: null,
        enableVibrate: false,
        showBadge: true,
        bypassDnd: true,
      });
    }

    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
  private static currentNotificationId: string | null = null;
  private static isNotificationActive = false;

  static async showPlaybackNotification(
    song: SongAsset,
    isPlaying: boolean,
    position: number,
    duration: number
  ) {
    const progress = Math.floor((position / duration) * 100);

    if (Platform.OS === "android") {
      await Notifications.setNotificationCategoryAsync("playback", [
        {
          identifier: "previous",
          buttonTitle: "⏮️",
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: isPlaying ? "pause" : "play",
          buttonTitle: isPlaying ? "⏸️" : "▶️",
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: "next",
          buttonTitle: "⏭️",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      if (Platform.OS === "android") {
        await Notifications.dismissAllNotificationsAsync();
        this.currentNotificationId =
          await Notifications.scheduleNotificationAsync({
            content: {
              title: song.filename,
              body: `${progress}% - ${isPlaying ? "Playing" : "Paused"}`,
              data: { songId: song.id, isPlaying: isPlaying },
              categoryIdentifier: "playback",
              sound: false,
              priority: Notifications.AndroidNotificationPriority.MAX,
              vibrate: [0],
              color: "#D98324",
              sticky: true,
              autoDismiss: false,
            },
            trigger: null,
          });

        this.isNotificationActive = true;
      }
    }
  }

  static addPlaybackListener(callbacks: {
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
  }) {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      const currentState =
        response.notification.request.content.data?.isPlaying;

      if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        return;
      }

      if (actionId === "play" || actionId === "pause") {
        if (currentState) {
          callbacks.onPause();
        } else {
          callbacks.onPlay();
        }
        return;
      }

      switch (actionId) {
        case "next":
          callbacks.onNext();
          break;
        case "previous":
          callbacks.onPrevious();
          break;
      }
    });
  }
  static async clearNotification() {
    // Sadece uygulama kapatıldığında bildirimi temizle
    if (!this.isNotificationActive) {
      if (this.currentNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          this.currentNotificationId
        );
        this.currentNotificationId = null;
      }
    }
  }
}

export default NotificationService;
