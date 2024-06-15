import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { LogBox } from 'react-native';

const StartPage = () => {
  console.log("connexion");
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  return <Redirect href="/historique" />;
};

export default StartPage;
