import {
  GET_AGENCIES_DATA,
  GET_AGENCIES_DETAILS_DATA,
  GET_MOVEMENT_ID,
  GET_PILOT_DATA,
  GET_PILOT_DETAILS_DATA,
  GET_VEHICLE_DATA,
  IS_LOADING,
  SET_CURRENT_LOCATION_INFO,
  SET_CURRENT_USER_DETAILS,
  SET_DARK_THEME,
} from "../actionTypes";

const initialState = {
  isLoading: false,
  getPilotData: [],
  getVehicleData: [],
  getAgenciesData: [],
  getAgenciesDetailsData: [],
  getPilotDetailsData: [],
  movementID: "",
  userData: null,
  currentLocationInfo: {},
  isDarkTheme: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case GET_PILOT_DATA: {
      return { ...state, getPilotData: action.payload };
    }
    case GET_VEHICLE_DATA: {
      return { ...state, getVehicleData: action.payload };
    }
    case GET_AGENCIES_DATA: {
      return { ...state, getAgenciesData: action.payload };
    }
    case GET_PILOT_DETAILS_DATA: {
      return { ...state, getPilotDetailsData: action.payload };
    }
    case GET_AGENCIES_DETAILS_DATA: {
      return { ...state, getAgenciesDetailsData: action.payload };
    }
    case GET_MOVEMENT_ID: {
      return { ...state, movementID: action.payload };
    }
    case SET_CURRENT_USER_DETAILS: {
      return { ...state, userData: action.payload };
    }
    case SET_CURRENT_LOCATION_INFO: {
      return { ...state, currentLocationInfo: action.payload };
    }
    case SET_DARK_THEME: {
      return { ...state, isDarkTheme: action.payload };
    }
    default:
      return state;
  }
}
