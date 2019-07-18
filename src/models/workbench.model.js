/**
 * Summary: Model of the workBench
 * Description: Store workBench related data
 * @author Abhishek Shrivastava
 * @date  24 jan 2019
 */


const MODEL = {
      items : [],
      index: 0,
      editMode: false,
      editStoryId: null
   }


// const MODEL = {
//          items : [
//             {
//                index:0,
//                SourceID:"Default",
//                SessionID:"null",
//                StartTimestamp:"1548650554507",
//                EndTimestamp:"1548650554507",
//                ThumbnailURL: "Thumbnails/76eadb46-9a11-4ccc-b77b-bda788bf2cfb/R_14_R_Shim/ThumbNail/1548650554507.jpg",
//                SpeedRate:"0.5"
//             }, 
//             {
//                index:1,      
//                SourceID:"Default",
//                SessionID:"null",
//                StartTimestamp:"1548650554507",
//                EndTimestamp:"1548650554507",
//                ThumbnailURL: "Thumbnails/76eadb46-9a11-4ccc-b77b-bda788bf2cfb/R_14_R_Shim/ThumbNail/1548650554507.jpg",
//                SpeedRate:"0.5"
//             }
//       ],
//       index: 0,
//       editMode: false,
//       editStoryId: null
//    }
    
export const workbenchModel = {
      MODEL: MODEL,
};      