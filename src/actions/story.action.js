//add
//edit
//list
//delete
//commit
//widthraw
//apply
//preview

/**
 * Summary: Summary of the story action
 * Description: Create story related functionality
 * @author Abhishek Shrivastava
 * @date  18 jan 2019
 */

//Import
import { APIService } from "../service/api";
import { urlConstants } from "../constants/uri.constants";
import { responseActions } from "../actions/response.action";

//Public Method
/**
 * Description: handle getAllStory
 * @return {Promise}
 */

const getAllStory = () => {
  let url = "";
  let body = { OperationType: "10400", Data: "N/A" };
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


const deleteStory = (data) => {
  let url = "";
  let body = { OperationType: "10412", Data:data };
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

//Public Method
/**
 * Description: Save Story
 * @return {Promise}
 */

const addStory = (data) => {
  console.log("addstory",data)
  let url = "";
  let body = { OperationType: "10410", Data:data };
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



//Public Method
/**
 * Description: Edit Story
 * @return {Promise}
 */
const editStory = (data) => {
  console.log("editdata",data)
  let url = "";
  let body = { OperationType: "10411", Data:data };
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

//Export testActions
export const storyActions = {
  getAllStory,
  deleteStory,
  addStory,
  editStory
};
