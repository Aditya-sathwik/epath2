import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/hooks";
import { makeAPIRequest } from "../utils/apiGlobal";
import { DELETE, GET, PATCH, POST, PUT, api } from "../utils/apiConstants";
import {
  DELETE_MOVEMENTS_ID,
  GET_MOVEMENT_DETAILS,
  GET_MOVEMENT_LIST,
  IS_LOADING,
} from "../redux/actionTypes";
import { infoToast, successToast } from "../utils/globalFunctions";
import { getAsyncToken, setAsyncToken } from "../utils/asyncStorage";

export const getMovementAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.getmovement(request.data?.type),
      headers: headers,
      params: request.params,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data) {
            dispatch({
              type: GET_MOVEMENT_LIST,
              payload: {
                current_page: request.params?.page,
                results: response?.data?.results,
              },
            });
            if (request.onSuccess) request.onSuccess(response.data);
          }
        }
      })
      .catch((error) => {
        console.log("error.response", error.response?.data);
        if (error.response?.data?.detail === "No Movement matches the given query.") {
          dispatch({
            type: GET_MOVEMENT_LIST,
            payload: {
              current_page: 1,
              results: [],
            },
          });
        }
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const createMovementAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.createMovement,
      headers: headers,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data?.message) {
            if (request.onSuccess) request.onSuccess(response.data?.message);
            // dispatch({
            //   type: GET_MOVEMENT_LIST,
            //   payload: response?.data?.message,
            // });
          }
        }
      })
      .catch((error) => {
        console.log("error", error.response?.data);
        dispatch({ type: IS_LOADING, payload: false });
        infoToast("something went wrong value");
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const updateMovementAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: PUT,
      url: `${api.updateMovement}${request?.params}/`,
      headers: headers,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data?.message) {
            dispatch({
              type: GET_MOVEMENT_DETAILS,
              payload: response.data?.message,
            });
            if (request.onSuccess) request.onSuccess(response.data?.message);
          }
        }else{
          if (request.onFailure) request.onFailure(error.response);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("error.response", error.response);
        infoToast(error.response?.data?.detail);
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getMovementDetailsAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.getmovementDetails(request?.id),
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data?.message) {
            dispatch({
              type: GET_MOVEMENT_DETAILS,
              payload: response.data?.message,
            });
            if (request.onSuccess) request.onSuccess(response?.data?.message);
          }
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        infoToast(error.response?.data?.detail);
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const locationDeleteMovementAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: DELETE,
      url: api.locationDeleteMovement(request?.id),
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data?.message) {
            successToast(response.data?.message)
            dispatch({
              type:DELETE_MOVEMENTS_ID,
              payload: request?.id,
            });
            if (request.onSuccess) request.onSuccess(response?.data?.message);
          }
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        infoToast(error.response?.data?.detail);
        if (request.onFailure) request.onFailure(error.response);
      });
  };
