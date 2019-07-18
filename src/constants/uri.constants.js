export const API_DIRECTORY = {
  IP:"18.195.246.181",
  PORT:"8288",
  //DOC_ROOT: "https://api.coindesk.com/v1/bpi/currentprice.json"
  DOC_ROOT: "http://18.195.246.181:8288/v3/StudioOperation.ashx",
  URL:"/v3/StudioOperation.ashx"
};
export const urlConstants = {
  IP: API_DIRECTORY.IP,
  TEST: API_DIRECTORY.DOC_ROOT,
  BASEURL1: API_DIRECTORY.DOC_ROOT,
  BASEURL:"http://"+API_DIRECTORY.IP+":"+API_DIRECTORY.PORT+""+API_DIRECTORY.URL,
  BASEURLHTTP:"http://"+API_DIRECTORY.IP+":"
};
