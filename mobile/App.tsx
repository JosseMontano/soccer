import { StatusBar } from "expo-status-bar";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView>
          <Text>hello word!</Text>
          <Pressable>
            <Text>cms choquito</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  TextStyled: {
    fontSize: 24,
    fontWeight: 100,
  },
});
