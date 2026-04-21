import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

 
const ENV_PHONE_API = process.env.EXPO_PUBLIC_API_URL;
const ENV_EMULATOR_API = process.env.EXPO_PUBLIC_EMULATOR_API_URL;

 
const hostUri = Constants.expoConfig?.hostUri ?? "";
const detectedIP = hostUri.split(":")[0];

 
const EMULATOR_API =
  ENV_EMULATOR_API || "http://10.0.2.2:5000/api";

 
const PHONE_API =
  detectedIP && detectedIP !== "localhost"
    ? `http://${detectedIP}:5000/api`
    : ENV_PHONE_API;

 
const API_URL =
  Platform.OS === "android" && detectedIP === "localhost"
    ? EMULATOR_API
    : PHONE_API;

 
export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

 
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
 
console.log("Detected Expo Host:", hostUri);
console.log("Detected IP:", detectedIP);
console.log("API URL USED:", API_URL);