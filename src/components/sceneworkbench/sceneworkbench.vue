<template>
  <div class="new-video">
    <!-- Starting window with 2 buttons -->
     <div class="create-new-section"  v-if="workbenchActive ===  false">
      <h3>Click the button below to create a new story</h3>
      <div class="btn-wrapper">
        <div class="create-replay">
          <button class="border-btn" @click="replayFromTimeline()">Create a replay</button>
        </div>
        <div class="create-collection">
          <button class="border-btn" @click="_showPopup('creatCollection')">Create a collection</button>
          <!-- Call popup -->
          <popup v-if="popupType == 'collection'"/>
          <!-- End Call popup -->
        </div>
      </div>
    </div>
    <!-- end starting window with 2 buttons -->
    <div class="video-wrapper" v-if="workbenchActive ===  true">
      <span class="time">{{this.time}}</span>
      <div class="p-relative">
          <a @click="_showPopup('addBtn')" class="add-btn">+</a>
          <!-- Call popup -->
          <popup v-if="popupType == 'addBtn'"/>
          <!-- End Call popup -->
      </div>
      <div class="scene-list">
        <ul>
        <draggable :sceneBar="sceneBar" class="dragArea"> 
             <li v-for="(element) in sceneBar" :key="element.index">    
               <!-- <font style="color:#fff;">{{element.index}}</font> -->
               <!-- <img :src="`http://18.195.246.181:8488/${element.ThumbnailURL}`" /> -->
               <img :src="`${IP}${element.ThumbnailURL}${element.StartTimestamp}.jpg`" ref="sceneThumb"  @click="editScene($event.currentTarget,element)"/>
               <div class="sceneAction">
                <div class="copy" @click="copyElement(element)"></div> 
                <div class="delete" @click="deleteElement(element)"></div> 
              </div>
             </li>
        </draggable>
       </ul>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import EventBus from "../common/event-bus";
import { workbenchModel } from "../../models/workbench.model";
import { workbenchActions } from "../../actions/workbench.action";
import popup from "../common/popup.vue";
import Global from "../../helper/global.js";
import { urlConstants } from "../../constants/uri.constants";

export default {
  name: "sceneworkbench",
  components: {
    draggable,
    popup,
  },
  data() {
      return {
        IP: urlConstants.BASEURLHTTP,
        workbenchActive: false,
        popupType: null,
        sceneBar:workbenchModel.MODEL.items,
        time: ""
      }
  },
  // props: {
  //     sceneBar: [],
  // },
  mounted() {
      /** Description:  show workbench */
      // this.sceneBar = workbenchModel.MODEL.items
      EventBus.$on("showWorkbench", this._showWorkbench);
      EventBus.$on("hidePopup", this._hidePopup);
      EventBus.$on("editStory", this._editStory);
      EventBus.$on("combineStories", this._combineStories);
      EventBus.$on("insertSceneFromSlider", this._insertSceneFromSlider);
      EventBus.$on("resetWorkbench", this._reset);
      EventBus.$on("createReplay", this._createReplay);
  },
  updated() {
      this.time = this.getTime(workbenchModel.MODEL.items);
  },
  methods: {
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

      /** Description: show popup */
      _showPopup: function(_data) {       
       switch (_data) {
         case "creatCollection":
           {
              this.popupType = "collection";
              break;
           }
           case "addBtn":
           {
              this.popupType = "addBtn";
              break;
           }
          default:
              this.popupType = null;
       }
      },
       /** Description: show workbench */
      _showWorkbench: function() {
        this.workbenchActive = true;
      },
      /** Description: hide popup */
      _hidePopup: function() {
        this.popupType = null;
      },
       /** Description: Copy Scene */
      copyElement: function(event) {                
        workbenchActions.copyElement(event)
        this.sceneBar =  [...workbenchModel.MODEL.items]
      },
       /** Description: Delete scene */
      deleteElement: function(event) {              
         workbenchActions.deleteElement(event)
         this.sceneBar =  [...workbenchModel.MODEL.items]
      },
      /** Description: edit scene */
      editScene: function(dom, element) {
         let sendData = Object.assign({},element)  
         if (dom.className ==='checked') {
           //null index from thumbnail
           console.log("enterNull")
           sendData.index = null
           dom.className = "";
         } else {
           this.$refs.sceneThumb.map((scene) => {
               return scene.className = "";
            })
            dom.className='checked'
         }
         
         /** Pass selected scene information in timeline */  
         console.log("editscene",sendData)         
         EventBus.$emit("editScene",sendData)
      },
      /** Description: add/edit scene from timeline*/
      _insertSceneFromSlider: function(data) {   
         /** Description: scene add from timeline then if 
          * scene edited then else */
         if(workbenchModel.MODEL.editMode === true)  data.StoryID = workbenchModel.MODEL.editStoryId
         if(data.index === null) {
             if(!this.workbenchActive) return
             this.itemPushWorkBench(data)
         } else {
             let sceneIndex = workbenchModel.MODEL.items.findIndex(x => x.index==data.index)
             console.log("workbenchModel.MODEL.items[sceneIndex].SourceID",workbenchModel.MODEL.items[sceneIndex].SourceID)
             console.log("data.SourceID",data.SourceID)
             if(workbenchModel.MODEL.items[sceneIndex].SourceID !== data.SourceID) {
                this.itemPushWorkBench(data)
                return
             }
             console.log("edit>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data)
             workbenchModel.MODEL.items[sceneIndex] = data
             this.sceneBar =  [...workbenchModel.MODEL.items]
             console.log("workbenchModel.MODEL.items>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",workbenchModel.MODEL.items)
             this.$refs.sceneThumb[sceneIndex].className = "";
         }
          console.log("sceneBar>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.sceneBar)
      },
      /** Description: edit story */
      _editStory: function(_data) {
        this.sceneFromCombineEdit([_data],"editStory")
      },

      /** Description: combine story */
      _combineStories: function(_data) {
          this.sceneFromCombineEdit(_data,"combineStory")
      },

      /** Description: Item push in workbench*/
      itemPushWorkBench: function(_data) {
            let lastIndex = workbenchModel.MODEL.index;        
            _data.index = lastIndex,   
            workbenchModel.MODEL.items.push(_data)
            lastIndex++
            workbenchModel.MODEL.index = lastIndex
            this.sceneBar =  [...workbenchModel.MODEL.items]
       },

      /** Description: load scene from edit and combine story list*/
      sceneFromCombineEdit: function(_data,status) {
          this._reset()
          EventBus.$emit("resetPopup")
          let PopupStoryID = []

          new Promise((resolve) => {
              const items = [];
              let lastIndex = 0;
               _data.forEach((storyData) => {  
                  storyData.Scenes.forEach((scene) => {  
                    const obj =
                      {
                        index: lastIndex,
                        StoryID:storyData.ID,
                        SourceID:scene.SourceID,
                        SessionID:scene.SessionID,
                        StartTimestamp:scene.StartTimestamp,
                        EndTimestamp:scene.EndTimestamp,
                        ThumbnailURL: this.thumbnailFromFrontcover(storyData.FrontCover,scene.SourceID),
                        SpeedRate:"0.5"
                      }
                    workbenchModel.MODEL.items.push(obj)
                    lastIndex++
                    workbenchModel.MODEL.index = lastIndex
                  })
                  PopupStoryID.push(storyData.ID)
                  if (status === "editStory") {
                    workbenchModel.MODEL.editMode = true
                    workbenchModel.MODEL.editStoryId = storyData.ID
                  }
               })
              resolve()
            })
            .then(()=>{
                EventBus.$emit("showWorkbench")
                console.log("workbenchModel.MODEL>>>>>>>", workbenchModel.MODEL)
            })
            .catch((error) => {
                console.log(error)
            })
      },

      /** Description: load scene from edit and combine story list*/
      thumbnailFromFrontcover: function(data, sourceId) {
        if(data === null) return null
        else {
            var path = data
            let split = path.split("/")
            let getSource = sourceId.replace(/[&\/\\#,+()$~%.'":*?<>{}]/gi, "").replace(/ /gi,"_")
            split[split.length - 3] = getSource
            var ThubnailURL = split.slice(0, split.length - 1).join("/") + "/"
            return ThubnailURL
        }
      },

       /** Description: create replay */
       replayFromTimeline: function() {
         EventBus.$emit("resetPopup")
         EventBus.$emit("showWorkbench")
         EventBus.$emit("getCurrentSelectedScene");
       },
       _createReplay: function(_data) {
            this.itemPushWorkBench(_data)
            // let lastIndex = workbenchModel.MODEL.index;        
            // _data.index = lastIndex,   
            // workbenchModel.MODEL.items.push(_data)
            // lastIndex++
            // workbenchModel.MODEL.index = lastIndex
            
            
       },

      /** Description: reset workbench */
      _reset: function() {
        if (this.$refs.sceneThumb) {
          this.$refs.sceneThumb.map((scene) => {
                return scene.className = "";
          })
        }
        workbenchModel.MODEL.items = []
        workbenchModel.MODEL.index = 0
        workbenchModel.MODEL.editMode = false
        workbenchModel.MODEL.editStoryId = null
        this.sceneBar = workbenchModel.MODEL.items
        EventBus.$emit("removeEditSource");
      },
      
  }
};
</script>

<style>
</style>