<template>
 <div>
    <div class="popup-overlay" @click="_close"></div>
    <div class="collection-popup">
            <div class="scroll-container">
              <a href="#" class="heading arrow-down">Story</a>
              <button class="btn-right" @click="onDone">Done</button>
              <ul class="image-list popup-list">
                  <li v-for="(element, index) in storyList" :key="index" @click="toggle($event.currentTarget,element)" v-bind:class="{'checked': (element.checked === true) }">
                    <img :src="element.FrontCover ? `${IP}${element.FrontCover}` : './static/img/video-b.4a85d2e.png'">
                  </li>
              </ul>
            </div>
          </div>
  </div>
</template>

<script>
import EventBus from "../common/event-bus";
import { storyActions } from "../../actions/story.action";
import { workbenchModel } from "../../models/workbench.model";
import { urlConstants } from "../../constants/uri.constants";

export default {
  name: "popup",
  data() {
      return {
        IP: urlConstants.BASEURLHTTP,
        storyList:[],
      }
  },
  mounted() {
   this.loadStory()
   EventBus.$on("resetPopup", this._close)
  },
  methods: {
     /** Get all story from API  */
    getData() {
      console.log("getData>>>>>>>>>>>>>>>>>>")
      storyActions
        .getAllStory()
        .then(this.successHandle,this)
        .catch(this.errorHandle);
    },
    successHandle(data,that) {
      console.log("111111111111successHandle>>>>>>>>",data);
      return (JSON.parse(data.data.ReturnValue));
    },
    errorHandle(e){
      console.log(e);
    },
    /** Description: load story in popup */
    loadStory: function () {
        this.storyList = []
        let checked = false
         
          /** Iterate on each story  */
          
          storyActions.getAllStory()   
          .then((response)=> {
              JSON.parse(response.data.ReturnValue).forEach((item) => {
                /** IF story already in workbench then checked will true */
                checked = false
                let index = workbenchModel.MODEL.items.findIndex(x => x.StoryID==item.ID)
                if (index !== -1 ) checked = true 
                /** */
                let obj = {
                    "ID": item.ID,
                    "Scenes": item.Scenes,
                    "FrontCover": item.FrontCover,
                    "checked": checked,
                }
                this.storyList.push(obj)
              })
          })
        console.log("this.storyList>>>>>>>>>",this.storyList)
    },
    /** Description: story checked unchecked */
    toggle: function( dom, event ) {
      dom.classList.toggle('checked')
      let index = this.storyList.indexOf(event)
      this.storyList[index].checked = this.storyList[index].checked ? false : true
    },
    /** Description: click Done button close popup and wordbench open */
    onDone: function () {
      new Promise((resolve) => {
        this.loadScenes()
        resolve()
      })
      .then(()=>{
          this._close()
          EventBus.$emit("showWorkbench")
      })
      .catch((error) => {
           console.log(error)
      })
      
    },
    /** Description: Load scene on workbench */
    loadScenes: function () {
      let removeIndex = []
      console.log("this.storyList>>>>>>>>",this.storyList)
      this.storyList.forEach((item) => {
          let index = -1;
          index = workbenchModel.MODEL.items.findIndex(x => x.StoryID==item.ID)
          /** If story checked and not in workbench 
           * then push in workbench */
          let lastIndex = workbenchModel.MODEL.index;
          if(item.checked && index === -1 ) {
             item.Scenes.forEach((scene) => {               
                let obj = {
                    index : lastIndex,
                    StoryID:scene.StoryID,
                    SourceID:scene.SourceID,
                    SessionID:scene.SessionID,
                    StartTimestamp:scene.StartTimestamp,
                    EndTimestamp:scene.EndTimestamp,
                    ThumbnailURL: item.FrontCover,
                    SpeedRate:scene.SpeedRate
                  }
                workbenchModel.MODEL.items.push(obj)
                lastIndex++
                workbenchModel.MODEL.index = lastIndex
             })
          }
          /** If story unchecked and present in workbench 
           * then delete unchecked story from workbench */
          else {
            if(!item.checked && index !== -1 ) {
                let index = -1
                workbenchModel.MODEL.items.forEach((scene) => {
                  if(scene.StoryID === item.ID) {
                      index = workbenchModel.MODEL.items.indexOf(scene)
                      removeIndex.push(index)
                  }
                })
            }
          }
      })
      if(removeIndex.length > 0) {
        this.multiSplice(workbenchModel.MODEL.items, removeIndex)
      }
    },
    /** Description: method to remove multiple element from array through index*/
    multiSplice: function (array,indexes) {
      indexes.sort((a, b) => a - b);
      indexes.forEach((item, index) => array.splice(item - index, 1));
    },
    /** Description: close popup */
    _close: function () {
      this._reset()
      EventBus.$emit("hidePopup")
    },
    /** Description: Reset popup */
    _reset: function () {
      this.storyList = []
    },
  }
};
</script>