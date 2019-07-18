/**
 * Summary: Summary of the workbench action
 * Description: Create workbench related functionality
 * @author Abhishek Shrivastava
 * @date  24 jan 2019
 */
import { workbenchModel } from "../models/workbench.model";

//Public Method
 /**
 * Description: Copy Scene
 */
const copyElement = (event) => {    
    let lastIndex = workbenchModel.MODEL.index
    let newEvent = Object.assign({}, event)
    newEvent.index = lastIndex
    workbenchModel.MODEL.items.push(newEvent)
    lastIndex++
    workbenchModel.MODEL.index = lastIndex
    console.log("workbenchModel.MODEL.items111111>",workbenchModel.MODEL)
}
/**
 * Description: Delete scene
*/
const deleteElement = (event) => {              
    let index = workbenchModel.MODEL.items.indexOf(event);
    workbenchModel.MODEL.items.splice(index, 1);
}

//Export Actions
export const workbenchActions = {
    copyElement,
    deleteElement
  };
  