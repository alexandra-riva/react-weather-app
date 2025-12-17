import { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import { WeatherCard } from "../app/WeatherCard";
import { CitySearch } from "../app/CitySearch";
import { LinearGradient } from "expo-linear-gradient";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? "";

type TimeOfDay = "morning" | "day" | "evening" | "night";

function getTimeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "day";
  if (h >= 16 && h < 20) return "evening";
  return "night";
}

function getGradientForCondition(condition: string, timeOfDay: TimeOfDay, temp: number): string[] {
  const c = condition.toLowerCase();

  // RAIN/STORM/SNOW override 
  if (c.includes("rain") || c.includes("drizzle")) {
    return timeOfDay === "night" ? ["#0a1428", "#1e40af"] : ["#1e40af", "#60a5fa"];
  }
  if (c.includes("storm") || c.includes("thunder")) {
    return ["#020617", "#0f172a"];
  }
  if (c.includes("snow") || c.includes("sleet")) {
    return ["#f8fafc", "#cbd5e1"];
  }

  // TEMPERATURE FIRST
  const isHot = temp > 25;
  const isCold = temp < 5;

  if (isCold) {
    // COLD Places
    if (timeOfDay === "night") return ["#020617", "#1e293b"];
    return ["#f1f5f9", "#94a3b8"]; // icy blue/grey
  }

  if (isHot) {
    // HOT Places
    if (timeOfDay === "night") return ["#020617", "#7c2d12"];
    return ["#fefce8", "#eab308"];
  }

  // Mild places
  if (c.includes("sun") || c.includes("clear") || c.includes("fair")) {
    switch (timeOfDay) {
      case "morning": return ["#fed7aa", "#fb923c"];
      case "day": return ["#fef3c7", "#f59e0b"];
      case "evening": return ["#ec4899", "#f97316"];
      case "night": return ["#020617", "#581c87"];
    }
  }

  // Night default
  if (timeOfDay === "night") {
    return ["#020617", "#374151"];
  }

  // Cloudy day default
  return ["#e0f2fe", "#0ea5e9"];
}

export default function Index() {
  const [city, setCity] = useState("Loading...");
  const [temp, setTemp] = useState(0);
  const [condition, setCondition] = useState("Loading weather...");
  const [searchText, setSearchText] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [localTime, setLocalTime] = useState("");  

  async function loadLocalWeather() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCity("Permission denied");
        setCondition("Search for a city");
        setLocalTime("");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${API_KEY}&contentType=json`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Local weather HTTP error", res.status, await res.text());
        return;
      }

      const data = await res.json();
      setCity("My location");
      setTemp(Math.round(data.currentConditions.temp));
      setCondition(data.currentConditions.conditions);

      const epoch = data.currentConditions?.datetimeEpoch;
      const timezone = data.timezone;
      const now = epoch ? new Date(epoch * 1000) : new Date();
      setTimeOfDay(getTimeOfDay(now));
      
      // Local Time zone
      const localTimeStr = now.toLocaleTimeString("en-US", { 
        timeZone: timezone || undefined, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLocalTime(localTimeStr);
    } catch (err) {
      console.error("Location/weather error", err);
      setCity("Error");
      setCondition("Try searching for a city");
      setLocalTime("");
    }
  }

  useEffect(() => {
    loadLocalWeather();
  }, []);

  async function handleSearch() {
    const q = searchText.trim();
    if (!q) return;

    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(q)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Search HTTP error", res.status, await res.text());
        return;
      }

      const data = await res.json();

      setCity(data.resolvedAddress ?? data.address);
      setTemp(Math.round(data.currentConditions.temp));
      setCondition(data.currentConditions.conditions);
      setSearchText("");

      const epoch = data.currentConditions?.datetimeEpoch;
      const timezone = data.timezone;  // Timezone from API
      const now = epoch ? new Date(epoch * 1000) : new Date();
      setTimeOfDay(getTimeOfDay(now));

      // Local Time zone
      const localTimeStr = now.toLocaleTimeString("en-US", { 
        timeZone: timezone || undefined, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLocalTime(localTimeStr);
    } catch (err) {
      console.error("Weather fetch failed", err);
    }
  }

  const gradientColors: string[] = getGradientForCondition(condition, timeOfDay, temp);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}  
      style={styles.screen}
    >
      <WeatherCard 
        city={city} 
        temperature={temp} 
        condition={condition}
        localTime={localTime}  
        style={styles.transparentCard}  
      />

      <View style={styles.locationButton}>
        <Button title="Use my location" onPress={loadLocalWeather} color="#ffffff" />
      </View>

      <CitySearch
        value={searchText}
        onChange={setSearchText}
        onSubmit={handleSearch}
        style={styles.transparentSearch}  
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  locationButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  transparentCard: {
    backgroundColor: 'transparent',
  },
  transparentSearch: {
    backgroundColor: 'transparent',
  },
});
