import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/hooks";
import { makeAPIRequest } from "../utils/apiGlobal";
import {
  GET,
  GOOGLE_MAP_API_KEY,
  PATCH,
  POST,
  api,
} from "../utils/apiConstants";
import {
  GET_AGENCIES_DATA,
  GET_AGENCIES_DETAILS_DATA,
  GET_PILOT_DATA,
  GET_PILOT_DETAILS_DATA,
  GET_VEHICLE_DATA,
  IS_LOADING,
  SET_CURRENT_LOCATION_INFO,
  SET_CURRENT_USER_DETAILS,
  SET_DARK_THEME,
} from "../redux/actionTypes";
import { errorToast, humanize, infoToast } from "../utils/globalFunctions";
import {
  asyncKeys,
  getAsyncToken,
  setAsyncLoginInfo,
  setAsyncToken,
} from "../utils/asyncStorage";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPilotAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: api.getPilot,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
              dispatch({
                type: GET_PILOT_DATA,
                payload: response?.data?.message,
              });
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          // infoToast(error.response?.data?.detail);
          if (request.onFailure) request.onFailure(error.response);
        });
    };
export const getVehicleAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: api.getVehicle,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
              dispatch({
                type: GET_VEHICLE_DATA,
                payload: response?.data?.message,
              });
              // setAsyncUserInfo(response?.data?.userData);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          // infoToast(error.response?.data?.detail);
          if (request.onFailure) request.onFailure(error.response);
        });
    };
export const getAgenciesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: api.getAgencies,
        headers: headers,
      })
        .then(async (response: any) => {
          console.log('response?.data?.message', [response?.data?.message]);

          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
              if (request?.isShow) {
                dispatch({
                  type: GET_AGENCIES_DATA,
                  payload: [response?.data?.message],
                });
              } else {
                dispatch({
                  type: GET_AGENCIES_DATA,
                  payload: response?.data?.message,
                });
              }

              // setAsyncUserInfo(response?.data?.userData);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          console.log("error.response?.data?.detail", error.response);
          dispatch({
            type: GET_AGENCIES_DATA,
            payload: [],
          });
          // infoToast(error.response?.data?.detail);
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const addAgenciesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "multipart/form-data",
        Authorization: await getAsyncToken(),
      };

      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: POST,
        url: api.addAgencies,
        headers: headers,
        data: request?.data,
      })
        .then(async (response: any) => {
          console.log("addAgencies response", response);
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          errorToast(
            Object.values(error?.response?.data?.message)?.[0]?.[0] ||
            "The user already exists."
          );
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const addPilotAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "multipart/form-data",
        Authorization: await getAsyncToken(),
      };

      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: POST,
        url: api.addPilot,
        headers: headers,
        data: request?.data,
      })
        .then(async (response: any) => {
          console.log("addPilot response", response.data);
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          console.log("error.response?.data?.detail", error.response);
          //  Alert.alert("Please check the fields and try again")
          errorToast("The user already exists.");
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const addVehicleAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "multipart/form-data",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: POST,
        url: api.addVehicle,
        headers: headers,
        data: request?.data,
      })
        .then(async (response: any) => {
          console.log("addVehicleAction response", response.data);
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              if (request.onSuccess) request.onSuccess(response.data?.message);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          // Alert.alert("Please check the fields and try again")
          // infoToast(error.response?.data?.detail);
          errorToast(
            Object.values(error?.response?.data?.message)?.[0]?.[0] ||
             "The user already exists."
          );
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getPilotDetailsAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: `${api.getPilotDetails}${request?.params}/`,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              dispatch({
                type: GET_PILOT_DETAILS_DATA,
                payload: response.data?.message,
              });
              if (request.onSuccess) request.onSuccess(response.data?.message);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getAgenciesDetailsAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: `${api.getAgenciesDetails}${request?.params}/`,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data?.message) {
              dispatch({
                type: GET_AGENCIES_DETAILS_DATA,
                payload: response.data?.message,
              });
              if (request.onSuccess) request.onSuccess(response.data?.message);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getUserDetails =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: GET,
        url: api.userDetails,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data) {
              if (request.onSuccess) request.onSuccess(response.data.groups);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getGroupName =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING, payload: true });

      return makeAPIRequest({
        method: GET,
        url: api.group(request.group_id),
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data) {
              if (request.onSuccess) request.onSuccess(response?.data);
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const onUserProfileAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await `Bearer ${request?.token}`,
      };
      dispatch({ type: IS_LOADING, payload: true });
      return makeAPIRequest({
        method: POST,
        url: api.userProfile,
        headers: headers,
        data: request?.data,
      })
        .then(async (response: any) => {
          console.log("response.data?.message", response.data);
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING, payload: false });
            if (response.data) {
              if (request.onSuccess) request.onSuccess(response.data);
              infoToast("Profile created");
            }
          }
        })
        .catch((error) => {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getCurrentUserAction =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: GET,
      url: "api/web/users/user_details/",
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data) {
            dispatch({
              type: SET_CURRENT_USER_DETAILS,
              payload: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getGoogleMapAddress =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: GET,
        headers: headers,
        params: request.params,
        url: api.GOOGLE_MAP_BASE_URL,
      })
        .then(async (response: any) => {
          if (response.status === 200) {
            if (response.data.status === "OK") {
              let address = response?.data?.results?.[0].formatted_address || "";
              if (request.onSuccess) request.onSuccess(address);
              if (Object.keys(request?.data)?.length > 0) {
                console.log("CURRENT");
                dispatch({
                  type: SET_CURRENT_LOCATION_INFO,
                  payload: {
                    ...request.data,
                    address: address,
                  },
                });
              }
            } else {
              infoToast(response?.data?.error_message);
            }
          }
        })
        .catch((error) => {
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getGoogleAutoAddress =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: GET,
        headers: headers,
        params: {
          input: request.search,
          key: GOOGLE_MAP_API_KEY,
          components: "country:in",
          language: "en",
        },
        url: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      })
        .then(async (response: any) => {
          if (response.status === 200) {
            if (request.onSuccess) request.onSuccess(response?.data);
          }
        })
        .catch((error) => {
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getGooglePlaceIDByLatlng =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: GET,
        headers: headers,
        params: {
          place_id: request.place_id,
          key: GOOGLE_MAP_API_KEY,
        },
        url: "https://maps.googleapis.com/maps/api/place/details/json",
      })
        .then(async (response: any) => {
          if (response.status === 200) {
            if (request.onSuccess) request.onSuccess(response?.data);
          }
        })
        .catch((error) => {
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const setDarkTheme =
  (data: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      AsyncStorage.setItem(asyncKeys.is_dark_theme, JSON.stringify(data));
      dispatch({
        type: SET_DARK_THEME,
        payload: data,
      });
    };
