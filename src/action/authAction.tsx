import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/hooks";
import { makeAPIRequest } from "../utils/apiGlobal";
import { POST, api } from "../utils/apiConstants";
import { IS_LOADING } from "../redux/actionTypes";
import { errorToast } from "../utils/globalFunctions";
import {
  getAsyncToken,
  setAsyncLocationLoginInfo,
  setAsyncToken,
} from "../utils/asyncStorage";
import { getCurrentUserAction } from "./commonAction";
import axios from "axios";

export const onLoginAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.login,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data) {
            setAsyncToken(response.data.access);
            dispatch(getCurrentUserAction());
            if (request.onSuccess) request.onSuccess(response.data);
          }
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        errorToast("Something went wrong, please try again.");
        // errorToast(error.response?.data?.detail || "Something went wrong, please try again.");
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const onLocationLoginAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await `Bearer ${request?.token}`,
    };
    dispatch({ type: IS_LOADING, payload: true });

    return makeAPIRequest({
      method: POST,
      url: api.locationLogin,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
          setAsyncToken(response.data.message.access);
          setAsyncLocationLoginInfo(response.data.message);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        // errorToast(error.response?.data?.detail);
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const storeFcmToken =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      Authorization: await getAsyncToken(),
      "Content-Type": "application/json",
    };      
    return makeAPIRequest({
      method: POST,
      url: api.store_fcm_token,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        // errorToast(error.response?.data?.detail);        
        errorToast("Something went wrong, please try again.");
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const deleteFcmToken =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.delete_fcm_token,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        errorToast(error.response?.data?.detail);
        if (request.onFailure) request.onFailure(error.response);
      });
  };
