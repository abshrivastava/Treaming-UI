<template>
<div class="recorded-video-container">

    <TrickPlay :startTime="sourceData[0].startTime" :currentTime="sourceData[0].currentTime" :endTime="sourceData[0].endTime" />
    <div class="video-list-container">
        <TimeSlider :startTime="sourceData[0].startTime" :currentTime="sourceData[0].currentTime" :endTime="sourceData[0].endTime" :zoomLevel="1" />
        <ul>
            <li v-for="(item, index) in sourceData" :key="index" @click ='itemClicked(index)' :class="[(slectedIndex=== index  ?'selected' :'deselected'),(item.sourceId=== editSource  ?'editActive' :'')]">
                <RecordList :startTime="item.startTime" :currentTime="item.currentTime" :endTime="item.endTime" :zoomLevel="1" :sourceId="item.sourceId" :baseUrl="item.baseUrl" :IP ="IP" />
            </li>
        </ul>

    </div>
</div>
</template>

<script>
import TrickPlay from "./trickplay";
import TimeSlider from "./timeslider";
import RecordList from "./recordlist";
import {
    timeSliderConst,
    ThumbListConst
} from "../../constants/timelinepanel.constant";
import EventBus from "../common/event-bus";
import {
    COMMON_UTILITIES
} from "../common/commonutility";
import { urlConstants } from "../../constants/uri.constants";
import {
    TimeLinePanelEvent
} from "../../constants/timelinepanel.event";
import { sourceActions } from "../../actions/source.action";

export default {
    name: "timelinepanel",
    components: {
        RecordList,
        TrickPlay,
        TimeSlider,
    },
    data() {
        return {
            slectedIndex : -1,
            IP: urlConstants.BASEURLHTTP,
            // sourceData: [{
            //         startTime: 1549972144000,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "0",
            //         baseUrl: ""
            //     },
            //     {
            //         startTime: 1549972144000,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "1",
            //         baseUrl: ""
            //     },
            //     {
            //         startTime: 1549972144000,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "2",
            //         baseUrl: ""
            //     },
            //     {
            //         startTime: 1549972144000,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "3",
            //         baseUrl: ""
            //     },
            // ],
            // sourceData: [{
            //         startTime: 1551348400229,
            //         currentTime: 1551348410329,
            //         endTime: 0,
            //         sourceId: "Default",
            //         baseUrl: "8488/Thumbnails/253e389c-a4b1-40d4-953d-a81c07b4f215/Default/ThumbNail/"
            //     },
            //     {
            //         startTime: 1551257634211,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "R 14 (R Shim)",
            //         baseUrl: "8488/Thumbnails/33bd8a10-a220-4fcc-b785-aca2494c107d/R_14_R_Shim/ThumbNail/"
            //     },
            //     {
            //         startTime: 1551257634491,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "R 16 (R Shim)",
            //         baseUrl: "8488/Thumbnails/33bd8a10-a220-4fcc-b785-aca2494c107d/R_16_R_Shim/ThumbNail/"
            //     },
            //     {
            //         startTime: 1551257634322,
            //         currentTime: 1549982944000,
            //         endTime: 0,
            //         sourceId: "R 15 (R Shim)",
            //         baseUrl: "8488/Thumbnails/33bd8a10-a220-4fcc-b785-aca2494c107d/R_15_R_Shim/ThumbNail/"
            //     },
            // ],
            sourceData: [],
            editSource:""
        }
    },
    methods: {
        itemClicked(index){
            this.slectedIndex = index;
        },
        editScene(data) {
            // console.log("i got the data ",data);
            let starttime = data.StartTimestamp;
            let endTime = data.EndTimestamp;
            let zoomData = this.findZoomLevel((endTime - starttime));
            
            if(data.index !== null) this.editSource = data.SourceID
            else this.removeEditSource()
            // console.log("zoom data is ",zoomData)
            EventBus.$emit(TimeLinePanelEvent.SCROLLTOTIME, endTime - zoomData.timediff, zoomData.zoom);
            setTimeout(()=>{EventBus.$emit(TimeLinePanelEvent.UPDATESELECTOR, starttime, endTime,data.SourceID,data.index);},300);
        },
        removeEditSource(data = null) {
          if (data === this.editSource || data === null)
             this.editSource = ""
        },
        findZoomLevel(time) {
            let zoom = 1;
            let timediff = 0;
            if (time <= 60000) {
                zoom = 1;
                timediff = ThumbListConst.ZOOM1 * 60 * 1000;
            } else if (time > 60000 && time <= 300000) {
                zoom = 2;
                timediff = ThumbListConst.ZOOM2 * 60 * 1000;
            } else if (time > 300000 && time <= 1200000) {
                zoom = 3;
                timediff = ThumbListConst.ZOOM3 * 60 * 1000;
            } else if (time > 1200000 && time <= 3600000) {
                zoom = 4;
                timediff = ThumbListConst.ZOOM4 * 60 * 1000;
            }
            return {
                zoom: zoom,
                timediff: timediff
            };
        },

        getSelection() {
            EventBus.$emit(TimeLinePanelEvent.GETCURRENTSELECTEDSCENE);
        },
        /******create reply workbench */
        selectedScene(data) {
            console.log("1234 ", data);
            EventBus.$emit("createReplay", data);
        },

        loadSource() {
          sourceActions.getAllSource()   
          .then((response)=> {
              let sourceArr = []
              console.log("response>>>>>>>",response)
              JSON.parse(response.data.ReturnValue).Sources.forEach((item) => {
                 if(item.Records.length > 0) {
                     let recordLength = item.Records.length - 1
                     let itemNo = item.Records[recordLength]
                     let obj = {
                        startTime: parseInt(itemNo.StartTimestamp),
                        currentTime: COMMON_UTILITIES.getCurrentEpochTime(),
                        endTime: parseInt(itemNo.EndTimestamp),
                        sourceId: itemNo.SourceID,
                        baseUrl: item.BaseUrlForThumbnail
                     }
                     this.sourceData.push(obj) 
                     console.log("this.sourceData>>>>>>>",obj)
                 }
                
              })
          })
          .catch((error) => {
           console.log(error)
          })
        }

    },
    mounted() {
        EventBus.$on(TimeLinePanelEvent.CURRENTSELECTEDSCENE, this.selectedScene)
        EventBus.$on(TimeLinePanelEvent.EDITSCENE, this.editScene);
        EventBus.$on(TimeLinePanelEvent.REMOVEDITSOURCE, this.removeEditSource);
        this.loadSource()
    }

};
</script>

<style>
.video-list-container {
    padding: 0 5%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    position: relative;
}

.vue-slide-bar-component[data-v-1bcc2866] {
    padding-left: 16px;
    padding-right: 16px;
}
.video-list-container ul li{
    position: relative;
    z-index: 0;
}
.video-list-container ul li.deselected{
    opacity: 0.5;
}
.video-list-container ul li.deselected:before{
    content:"";
    position:absolute;
    height:80px;
    width:100%;
    background:rgba(0,0,0,.5);
    z-index: 999999;
    left:0;
    top:0;
}
</style>
