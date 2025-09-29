import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../styles/buttons/buttonsLayout";



export default function RootLayout() {
return (
        <Stack screenOptions={{ headerShown: false }} />
  );
}

