/**
 * Summary: Summary of the test action
 * Description: Create test for testing
 * @author Abhishek Shrivastava
 * @date  18 jan 2019
 */

//Import
import { APIService } from "../service/api";
import { urlConstants } from "../constants/uri.constants";
import { responseActions } from "../actions/response.action";

//Public Method
/**
 * Description: handle getdata
 * @return {Promise}
 */
const getData = () => {
  let url = "";
  let body = { OperationType: "10300", Data: "N/A" };
  let header = {};
  url = urlConstants.TEST;

  return APIService.post(url, header, body).then(
    data => {

        //console.log("data---->", data);
        let getResponse = responseActions.response(data);
        if (getResponse) {
          return getResponse;
        } else {
          return null;
        }
    },
    error => {
      return responseActions.errorResponse(error);
    }
  );
};

//Export testActions
export const testActions = {
  getData
};
