// export const api = {
//   // BASE_URL: "https://services.airavt.ai/",
//   BASE_URL: "https://ibianalytics.in/",
//   // IMAGE_BASE_URL: "https://services.airavt.ai",
//   GOOGLE_MAP_BASE_URL: "https://maps.googleapis.com/maps/api/geocode/json",

//   // SOCKET_ENDPOINT: "wss://services.airavt.ai/ws/web/send-location/",
//   SOCKET_ENDPOINT: "wss://ibianalytics.in/ws/send-location/",
//   // Auth
//   login: "login/",
//   locationLogin: "location-login/",

//   store_fcm_token: "api/store-fcm_token/",
//   delete_fcm_token: "api/delete-fcm_token/",

//   userProfile: "users/profile/",
//   // userProfile: "api/location-create/",
//   userDetails: "api/users/user_details/",
//   group: (group_id: any) => `group/${group_id}/`,
//   //movement: "movement/",
//   getmovement: (res: any) => `location-filter-movements/${res}/`,
//   getmovementDetails: (res: any) => `location-get-movement/${res}/`,
//   locationDeleteMovement: (res: any) => `location-delete-movement/${res}/`,
//   createMovement: "location-create-movement/",
//   updateMovement: "location-update-movement/",

//   //vehicle
//   getVehicle: "location-filter-vehicles/",
//   addVehicle: "location-create-vehicle/",

//   //location-filter-vehicles
//   getPilot: "location-filter-pilots/",
//   addPilot: "location-create-pilot/",
//   getPilotDetails: "location-get-pilot/",

//   //location-filter-agencies
//   getAgencies: "location-filter-agencies/",
//   addAgencies: "location-create-agency/",
//   getAgenciesDetails: "location-get-agency/",
// };

// export const POST = "POST";
// export const GET = "GET";
// export const PATCH = "PATCH";
// export const PUT = "PUT";
// export const DELETE = "DELETE";
// export const GOOGLE_MAP_API_KEY = "AIzaSyDyT6Pn5yLqPB7YS_W5Lwjkt7FOGegTCgE";

// export const googleMapQuery = {
//   key: GOOGLE_MAP_API_KEY,
//   language: "en",
//   components: "country:in",
// };

// export const TermsAndConditions = "https://airavt.ai/terms-and-conditions";
// export const PrivacyPolicy = "https://airavt.ai/terms-and-conditions";



export const api = {
  BASE_URL: "https://services.airavt.ai/",
  // BASE_URL: "https://ibianalytics.in/",
  IMAGE_BASE_URL: "https://services.airavt.ai",
  GOOGLE_MAP_BASE_URL: "https://maps.googleapis.com/maps/api/geocode/json",

  SOCKET_ENDPOINT: "wss://services.airavt.ai/ws/web/send-location/",
  // SOCKET_ENDPOINT: "wss://ibianalytics.in/ws/send-location/",
  // Auth
  login: "api/web/login/",
  locationLogin: "api/web/location-login/",

  store_fcm_token: "api/web/store-fcm_token/",
  delete_fcm_token: "api/web/delete-fcm_token/",

  userProfile: "api/web/users/profile/",
  // userProfile: "api/web/location-create/",
  userDetails: "api/web/users/user_details/",
  group: (group_id: any) => `api/web/group/${group_id}/`,
  //movement: "movement/",
  getmovement: (res: any) => `api/web/location-filter-movements/${res}/`,
  getmovementDetails: (res: any) => `api/web/location-get-movement/${res}/`,
  locationDeleteMovement: (res: any) => `api/web/location-delete-movement/${res}/`,
  createMovement: "api/web/location-create-movement/",
  updateMovement: "api/web/location-update-movement/",

  //vehicle
  getVehicle: "api/web/location-filter-vehicles/",
  addVehicle: "api/web/location-create-vehicle/",

  //location-filter-vehicles
  getPilot: "api/web/location-filter-pilots/",
  addPilot: "api/web/location-create-pilot/",
  getPilotDetails: "api/web/location-get-pilot/",

  //location-filter-agencies
  getAgencies: "api/web/location-filter-agencies/",
  addAgencies: "api/web/location-create-agency/",
  getAgenciesDetails: "api/web/location-get-agency/",

  updatePilot: "api/web/location-update-pilot/",
};

export const POST = "POST";
export const GET = "GET";
export const PATCH = "PATCH";
export const PUT = "PUT";
export const DELETE = "DELETE";
export const GOOGLE_MAP_API_KEY = "AIzaSyDyT6Pn5yLqPB7YS_W5Lwjkt7FOGegTCgE";

export const googleMapQuery = {
  key: GOOGLE_MAP_API_KEY,
  language: "en",
  components: "country:in",
};

export const TermsAndConditions = "https://airavt.ai/terms-and-conditions";
export const PrivacyPolicy = "https://airavt.ai/terms-and-conditions";
