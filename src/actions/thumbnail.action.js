/**
 * Summary: Summary of the Thumbnail action
 * Description: Create Thumbnail related functionality
 * @author Abhishek Shrivastava
 * @date  18 jan 2019
 */

//Import
import { APIService } from "../service/api";
import { urlConstants } from "../constants/uri.constants";

//Public Method
/**
 * Description: handle getThumbnailBySourceIdTimestamp
 * @return {Promise}
 */
const getThumbnailBySourceIdTimestamp = (
  _sourceID = "Default",
  _startTimestamp = 1544843100000,
  _endTimestamp = 1544843160000
) => {
  let url = "";
  let body = {
    OperationType: "10311",
    Data: {
      SourceID: _sourceID,
      StartTimestamp: _startTimestamp,
      EndTimestamp: _endTimestamp
    }
  };
  let header = {};
  url = urlConstants.BASEURL;

  return APIService.post(url, header, body).then(
    data => {
      return data;
    },
    error => {
      return error;
    }
  );
};

//Export thumbnailActions
export const thumbnailActions = {
  getThumbnailBySourceIdTimestamp
};
