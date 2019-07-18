<template>
  <div class="play-video">
    <div class="btn-row text-right">
      <button @click="justSave()" class="link-btn">Just Save</button>
      <button class="btn-green btn-big">Ready</button>
    </div>
    <img src="../../assets/images/video-b.png" class="image-responsive">
    <div class="btn-row flex-v-center">
      Transition
      <span class="transition-color"></span>
    </div>
  </div>
</template>

<script>
import EventBus from "../common/event-bus";
import { workbenchModel } from "../../models/workbench.model";
import { storyActions } from "../../actions/story.action";
import {alertConstants} from '../../constants/alert.constants.js';

export default {
  name: "storypreviewpanel",
  methods: {
       /**
       * Description: Save Story
       */
      justSave: function() {  
        if(workbenchModel.MODEL.items.length <= 0) {
          alert("No story or scene selected")
          return
        } 
        let queryData = [...workbenchModel.MODEL.items]
        queryData = queryData.map((scene) => {
            delete scene.index            
            return scene
        })

        if(workbenchModel.MODEL.editMode === true) {
          let frontcover = queryData[0].ThumbnailURL+queryData[0].StartTimestamp+".jpg"
          if (queryData[0].ThumbnailURL === null) frontcover = null
          let item = { 
                      "ID": workbenchModel.MODEL.editStoryId, 
                      "Title": "Nice", 
                      "Scenes":queryData,
                      "FrontCover":frontcover
                      //"FrontCover":null
                    }   
          console.log("item>>>>>>>>>",queryData) 


          storyActions.editStory(JSON.stringify(item)).then(res=>{
              if( res.data.ErrorMessage.toLowerCase() === alertConstants.SUCCESS){
                  EventBus.$emit("resetWorkbench")
                EventBus.$emit("resetPopup")
                EventBus.$emit("refreshComponent")
                alert("Story Edited")
              }else{
                console.log(res.data.ErrorMessage);
              }
              
            }).catch(e=>{
              console.log(e)
            })
        }
        if(workbenchModel.MODEL.editMode === false) {
            let item = { 
                          "Title": "Nice", 
                          "Tags": [], 
                          "Author": "editor@pp.com",
                          "Scenes":queryData,
                          "FrontCover":queryData[0].ThumbnailURL+queryData[0].StartTimestamp+".jpg"
                          // "FrontCover":null
                        }   
            console.log("item>>>>>>>>>",item)


            storyActions.addStory(JSON.stringify(item)).then(res=>{
              if( res.data.ErrorMessage.toLowerCase() === alertConstants.SUCCESS){
                  EventBus.$emit("resetWorkbench")
                  EventBus.$emit("resetPopup")
                  EventBus.$emit("refreshComponent")
                  alert("Story Saved")
              }else{
                console.log(res.data.ErrorMessage);
              }
              
            }).catch(e=>{
              console.log(e)
            })

        }          
        
      },
      
  }
};
</script>

<style>
</style>