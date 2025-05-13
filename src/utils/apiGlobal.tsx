import axios from "axios";
import { api } from "./apiConstants";
import { clearAsync } from "./asyncStorage";
import { navigationRef } from "../navigation/mainNavigator";

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
}

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: api.BASE_URL,
      url,
      data,
      headers,
      params,
    };
    axios(option)
      .then((response) => {

        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        console.log('error?.response',error?.response);
        
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          clearAsync();
          navigationRef?.current?.reset({
            index: 1,
            routes: [{ name: "LoginScreen" }],
          });
        }
        reject(error);
      });
  });
