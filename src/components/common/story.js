import { STORY } from "../../constants/story.constants";

/**
 * Description: Story related work 
 */
const Story = (function() {
  const getColor = _code => {
    return STORY[_code]["color"];
  };
  const getState = _code => {
    return STORY[_code]["state"];
  };
  const isEdit = _code => {
    return STORY[_code]["edit"];
  };
  const isDuplicate = _code => {
    return STORY[_code]["duplicate"];
  };
  const isDelete = _code => {
    return STORY[_code]["delete"];
  };
  return {
    getColor: getColor,
    getStatus: getState,
    isEdit: isEdit,
    isDuplicate: isDuplicate,
    isDelete: isDelete
  };
})();

export default Story;
