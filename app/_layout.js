import { Stack } from "expo-router/stack";
import { Text, View } from "react-native";

const StackLayout = function () {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false,animation:"flip" }} />
    </Stack>
  );
};

export default StackLayout;
