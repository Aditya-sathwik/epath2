import {
  DELETE_MOVEMENTS_ID,
  GET_CURRENT_LOCATION,
  GET_MOVEMENT_DETAILS,
  GET_MOVEMENT_LIST,
  IS_LOADING,
} from "../actionTypes";

const initialState = {
  getMovementList: [],
  getMovementDetails: [],
  getCurrentLocation: {
    latitude: 0,
    longitude: 0,
  },
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_CURRENT_LOCATION: {
      return { ...state, getCurrentLocation: action.payload };
    }
    case GET_MOVEMENT_LIST: {
      if (action.payload.current_page == 1) {
        return { ...state, getMovementList: action.payload?.results };
      }
      return {
        ...state,
        getMovementList: [...state.getMovementList, ...action.payload?.results],
      };
    }
    case GET_MOVEMENT_DETAILS: {
      return { ...state, getMovementDetails: action.payload };
    }
    case DELETE_MOVEMENTS_ID: {
      const updateData=state.getMovementList?.filter((list)=>list?.movement_id !== action.payload )      
      return { ...state, getMovementList: updateData };
    }
    default:
      return state;
  }
}
