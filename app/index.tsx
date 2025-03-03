import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

const index = () => {
  return (
    <View>
      <Redirect href="/(tabs)/library" />
    </View>
  );
};

export default index;
