import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>Milan</Text>
      <Text style={styles.temp}>12°</Text>
      <Text style={styles.condition}>It’s raining</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // slate-900 vibe
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    color: "white",
    fontSize: 20,
    opacity: 0.8,
  },
  temp: {
    color: "white",
    fontSize: 64,
    fontWeight: "700",
    marginTop: 4,
  },
  condition: {
    color: "white",
    fontSize: 20,
    marginTop: 8,
  },
});
