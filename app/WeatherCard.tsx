import { View, Text, StyleSheet } from "react-native";

type WeatherCardProps = {
  city: string;
  temperature: number;
  condition: string;
  style?: any; 
};

export function WeatherCard({ city, temperature, condition, style }: WeatherCardProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{temperature}°</Text>
      <Text style={styles.condition}>{condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "transparent", 
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: "center",
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
