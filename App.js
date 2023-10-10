import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "36aae762ad0ecccabc3f245785fb6b4f";

// https://openweathermap.org/forecast5

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const granted = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      //허가를 받지 않은 경우
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    const json = await res.json();
    console.log(json);
    setDays(
      json.list.filter((weather) => {
        if (
          weather.dt_txt.includes("00:00:00") ||
          weather.dt_txt.includes("06:00:00") ||
          weather.dt_txt.includes("12:00:00")
        ) {
          return weather;
        }
      })
    );
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator="false"
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.load}>
            <ActivityIndicator style={{ marginTop: 80 }} size={"large"} />
          </View>
        ) : (
          days.map((day, index) => {
            return (
              <View key={index} style={styles.day}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={80}
                  color="white"
                  style={{ marginBottom: 15, marginTop: 10 }}
                />
                <Text style={styles.desc}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
                <Text style={styles.dayText}>{day.dt_txt}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
    color: "#fff",
  },
  load: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "left",
    paddingLeft: 30,
  },
  temp: {
    fontSize: 130,
    color: "#fff",
  },
  desc: {
    marginTop: -20,
    fontSize: 25,
    color: "#fff",
    fontWeight: "600",
    paddingLeft: 10,
    paddingTop: 20,
  },
  tinyText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 10,
  },
  dayText: {
    fontSize: 23,
    fontWeight: "600",
    color: "#fff",
    paddingLeft: 10,
    marginTop: 100,
  },
});
