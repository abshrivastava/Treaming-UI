<template>
  <div v-if="type === 3">
    <div class="video-header">
      <div>
        <span :class="this.color"></span>
        {{this.status}}
      </div>
      <div class="action-icon">
        <button :disabled="!this.isEditItem" class="edit" @click="selectedItem(item, index)"></button>
        <button :disabled="!this.isDuplicateItem" class="copy" @click="addItem(item, index)"></button>
        <button :disabled="!this.isDeleteItem" class="delete" @click="deleteItem(item, index)"></button>
      </div>
    </div>
    <img :src="item.FrontCover ? `${IP}${item.FrontCover}` : './static/img/video-b.4a85d2e.png'"  class="image-responsive">
    <div class="details">
      <div>
        <h3>{{item.Title}}</h3>
      </div>
      <div>{{this.time}}</div>
    </div>
  </div>
  <div v-else>Not A/B/C</div>
</template>

<script>
import EventBus from "./event-bus";
import StoryHelper from "./story";
import Global from "../../helper/global.js";
import {storyActions} from "../../actions/story.action.js";
import {alertConstants} from '../../constants/alert.constants.js';
import { urlConstants } from "../../constants/uri.constants";
export default {
  name: "ThumbnailComp",
  Status: "default",
  props: {
    item: Object,
    index: Number,
    type: Number
  },
  data() {
    return {
      color: "icon",
      status: "",
      time: "",
      isEditItem: true,
      isDuplicateItem: true,
      isDeleteItem: true,
      IP: urlConstants.BASEURLHTTP,
    };
  },
  methods: {
    /**
     * Description: Send event while selected Item
     * @param {Object} _item
     * @param {Number} _index
     */
    selectedItem(_item, _index) {
      EventBus.$emit("selecteditem", _item, _index);
    },
    /**
     * Description: Send event while add Item
     * @param {Object} _item
     * @param {Number} _index
     */

    addItem(_item, _index) {
      EventBus.$emit("eventStart","Adding");
      console.log("copyscene",_item)
      storyActions.addStory(JSON.stringify(_item)).then(res=>{
        if( res.data.ErrorMessage.toLowerCase() === alertConstants.SUCCESS){
            EventBus.$emit("additem", JSON.parse(res.data.ReturnValue), _index);
        }else{
          console.log(res.data.ErrorMessage);
        }
        EventBus.$emit("eventEnd");
      }).catch(e=>{
        console.log(e)
      })
    },
    /**
     * Description: Send event while delete Item
     * @param {Object} _item
     * @param {Number} _index
     */
    deleteItem(_item, _index) {
      EventBus.$emit("eventStart","Deleteing");
      storyActions.deleteStory(JSON.stringify({ID:_item.ID})).then(res=>{
        if( res.data.ErrorMessage.toLowerCase() === alertConstants.SUCCESS){
            EventBus.$emit("deleteitem", _item, _index);
        }else{
          console.log(res.data.ErrorMessage);
        }
        EventBus.$emit("eventEnd");
      }).catch(e=>{
        console.log(e)
      })
    },
    /**
     * Description: Calculate time in milliseconds from array
     * @param {Array} _scenes
     * @return {Number}
     */
    totalMS(_scenes) {
      var totalMS = 0;
      for (var count = 0; count < _scenes.length; count++) {
        totalMS =
          totalMS +
          (_scenes[count].EndTimestamp - _scenes[count].StartTimestamp);
      }
      return totalMS;
    },
    /**
     * Description: Get time in string as format days , hours, minutes, seconds
     * @param {Array} _scenes
     * @return {String}
     */
    getTime(_scenes) {
      return Global.getTime(this.totalMS(_scenes));
    },
    /**
     * Description: Get color
     * @param {Number} _status
     * @return {String}
     */
    getColor(_status) {
      return StoryHelper.getColor(_status);
    },
    /**
     * Description: Get Status
     * @param {Number} _status
     * @return {String}
     */
    getStatus(_status) {
      return StoryHelper.getStatus(_status);
    },
    /**
     * Description: Is editable or not
     * @param {Number} _status
     * @return {Boolean}
     */
    isEdit(_status) {
      return StoryHelper.isEdit(_status);
    },
    /**
     * Description: Is duplicate or not
     * @param {Number} _status
     * @return {Boolean}
     */
    isDuplicate(_status) {
      return StoryHelper.isDuplicate(_status);
    },
    /**
     * Description: Is deletable or not
     * @param {Number} _status
     * @return {Boolean}
     */
    isDelete(_status) {
      return StoryHelper.isDelete(_status);
    }
  },
  mounted: function() {
    var that = this;
    this.color = this.color + " " + this.getColor(this.item.Status);
    this.status = this.getStatus(this.item.Status);
    this.isEditItem = this.isEdit(this.item.Status);
    this.isDuplicateItem = this.isDuplicate(this.item.Status);
    this.isDeleteItem = this.isDelete(this.item.Status);
    this.time = this.getTime(this.item.Scenes);
  }
};
</script>

<style>
#thumbnail {
  color: red;
}
</style>
