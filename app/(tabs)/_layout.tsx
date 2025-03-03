import { Tabs } from "expo-router/tabs";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F2F6D0",
        tabBarInactiveTintColor: "#D98324",
        tabBarStyle: {
          backgroundColor: "#443627",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "outfit-m",
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: "#443627",
        },
        headerTintColor: "#F2F6D0",
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          headerShown: false,
          title: "Player",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="play" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
