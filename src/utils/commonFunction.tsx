import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;

export const LATITUDE_DELTA = 0.0222;
export const LONGITUDE_DELTA = 0.0321;

export const convertHourstoMinute = (str: string) => {
  if (!str) {
    return 0;
  }
  let [hours, minutes] = str.split(":");
  return +hours * 60 + +minutes;
};
