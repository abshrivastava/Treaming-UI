<template>
<div class="selection" ref="selector">

</div>
</template>

<script>
import {
    timeSliderConst,
    ThumbListConst
} from "../../constants/timelinepanel.constant";
import {
    TimeLinePanelEvent
} from "../../constants/timelinepanel.event";
import EventBus from "../common/event-bus";

import {
    COMMON_UTILITIES
} from "../common/commonutility";
export default {
    name: "thumnailselector",

    props: {
        sourceId: String,
        startTime: Number,
        endTime: Number,
        currentTime: Number,
        zoomlevel: Number,
        baseUrl: String,
    },

    data() {
        return {

            
            timeLineEndTime: this.endTime ? this.endTime : this.currentTime,
            timeLineZoomLevel: this.zoomlevel,
            timeDiffrence: ThumbListConst.ZOOM1 * 60 * 1000,
            timeLineStartTime: this.timeLineEndTime - this.timeDiffrence,

            // Minimum resizable area
            minWidth: 60,
            minHeight: 40,

            // Thresholds
            FULLSCREEN_MARGINS: -10,
            MARGINS: 4,

            // End of what's configurable.
            clicked: null,
            onRightEdge: 0,
            onBottomEdge: 0,
            onLeftEdge: 0,
            onTopEdge: 0,

            rightScreenEdge: 0,
            bottomScreenEdge: 0,

            preSnapped: 0,

            b: 0,
            x: 0,
            y: 0,

            redraw: false,

            pane: null,
            e: null,
            parentData: null,
            index: null,
        }
    },

    methods: {
        onMouseDown(e) {
            this.onDown(e);
            e.preventDefault();
        },

        onDown(e) {
            this.calc(e);

            let isResizing = this.onRightEdge || this.onLeftEdge;
            var style = window.getComputedStyle(this.pane, null);
            var width = style.getPropertyValue("width");
            // console.log("width is ",width.split('px')[0]);
            this.clicked = {
                x: this.x,
                y: this.y,
                cx: e.clientX,
                cy: e.clientY,
                w: parseInt(width.split('px')[0]),
                h: this.b.height,
                isResizing: isResizing,
                onTopEdge: this.onTopEdge,
                onLeftEdge: this.onLeftEdge,
                onRightEdge: this.onRightEdge,
                onBottomEdge: this.onBottomEdge
            };
        },

        calc(e) {
            this.b = this.pane.getBoundingClientRect();
            this.x = e.clientX - this.b.left;
            this.onLeftEdge = this.x < this.MARGINS;
            this.onRightEdge = this.x >= this.b.width - this.MARGINS;
        },

        onMove(ee) {
            this.calc(ee);

            this.e = ee;

            this.redraw = true;

        },

        animate() {
            requestAnimationFrame(this.animate);
            if (!this.redraw) return;
            this.redraw = false;
            if (this.clicked && this.clicked.isResizing) {
                if (this.clicked.onRightEdge && this.e.clientX <= (this.parentData.x + this.parentData.width - 4)) {
                    console.log("Right clicked");
                    let x = this.pane.style.left;
                    this.pane.style.width = Math.max(this.x, this.minWidth) + 'px';
                    this.pane.style.left = x + "px";
                }
                if (this.clicked.onLeftEdge && this.e.clientX >= this.parentData.x) {
                    // debugger;
                     console.log("Left clicked");
                    var currentWidth = Math.max(this.clicked.cx - this.e.clientX + this.clicked.w, this.minWidth);
                    if (currentWidth > this.minWidth) {
                        if ((currentWidth + (this.e.clientX - this.parentData.x)) >= this.parentData.width-8) {
                            currentWidth = this.parentData.width - (this.e.clientX - this.parentData.x)-8;
                        }
                        this.pane.style.width = (currentWidth) + 'px';
                        this.pane.style.left = (this.e.clientX - this.parentData.x) + 'px';
                    }
                }
                return;
            }

            // This code executes when mouse moves without clicking

            // style cursor
            if (this.onRightEdge || this.onLeftEdge) {
                this.pane.style.cursor = 'ew-resize';
            } else {
                this.pane.style.cursor = 'default';
            }
        },

        onUp(e) {
            if (this.clicked) {
                this.calculateTime();
            }
            this.calc(e);
            this.clicked = null;
        },

        zoomIn() {
            if (this.timeLineZoomLevel < ThumbListConst.MAXZOOM) {
                this.timeLineZoomLevel++;
                this.upDateTimeDiff(this.timeLineZoomLevel);
                this.updateTimeOnZoom();
            }
        },

        zoomOut() {
            if (this.timeLineZoomLevel > ThumbListConst.MINZOOM) {
                this.timeLineZoomLevel--;
                this.upDateTimeDiff(this.timeLineZoomLevel);
                this.updateTimeOnZoom();
            }
        },

        updateTimeOnZoom() {
            if (this.timeLineStartTime + this.timeDiffrence > this.currentTime) {
                this.timeLineEndTime = this.currentTime;
                this.timeLineStartTime = this.timeLineEndTime - this.timeDiffrence;
            } else {
                this.timeLineEndTime = this.timeLineStartTime + this.timeDiffrence;
            }
        },

        upDateTimeDiff(zoomLevel) {
            switch (zoomLevel) {
                case 1:
                    this.timeDiffrence = (ThumbListConst.ZOOM1 * 60 * 1000);
                    break;
                case 2:
                    this.timeDiffrence = (ThumbListConst.ZOOM2 * 60 * 1000);;
                    break;
                case 3:
                    this.timeDiffrence = (ThumbListConst.ZOOM3 * 60 * 1000);;
                    break;
                case 4:
                    this.timeDiffrence = (ThumbListConst.ZOOM4 * 60 * 1000);;
                    break;
            }
        },

        updateCurrentTime() {
            if (this.endTime === 0 || (this.timeLineEndTime + 1000) <= this.endTime) {
                this.timeLineEndTime += 1000;
            }
        },

        nextTick() {
            if (this.endTime === 0 || (this.timeLineEndTime + 1000) <= this.endTime) {
                this.timeLineStartTime += 1000;
                this.timeLineEndTime += 1000;
            }
        },

        previousTick() {
            this.timeLineStartTime -= 1000;
            this.timeLineEndTime -= 1000;
        },

        calculateTime(combineEventData = true) {
            let totalSeconds = (this.timeLineEndTime - this.timeLineStartTime) / 1000;
            let parentWidth = this.pane.parentElement.clientWidth;
            let pxPerSecond = (parentWidth / totalSeconds);
            let paneCordinate = COMMON_UTILITIES.getPosition(this.pane);
            let parentCordinate = COMMON_UTILITIES.getPosition(this.pane.parentElement);
            let boxStartTime = Math.round((paneCordinate.x - 4 - parentCordinate.x) / pxPerSecond) * 1000 + this.timeLineStartTime;
            let boxEndTime = boxStartTime + (Math.round((this.pane.clientWidth + 8) / pxPerSecond) * 1000);
            let timeData = {
                StartTimestamp: boxStartTime,
                EndTimestamp: boxEndTime,
                SourceID: this.sourceId,
                index: this.index,
                SessionID: this.sessionIdFromThubnailURL(this.baseUrl),
                ThumbnailURL: this.baseUrl,
                SpeedRate: 0.5
            };
            if (combineEventData) {
                /*********** send scene in workbench */
                // console.log("drag event", timeData)
                EventBus.$emit("insertSceneFromSlider", timeData);
                this.index = null;
                EventBus.$emit("removeEditSource",this.sourceId);
            }
            
            return timeData;
        },

          sessionIdFromThubnailURL (data) {
              if(data === null) return null
              else {
                let split = data.split("/");
                let getSessionID = split[split.length - 4]
                return getSessionID
              }
          },

        scrollToTime(time, zoom = -1) {
            if (zoom != -1) {
                this.upDateTimeDiff(zoom);
            }
            if (time + this.timeDiffrence > this.currentTime) {
                this.timeLineEndTime = this.currentTime;
                this.timeLineStartTime = this.timeLineEndTime - this.timeDiffrence;
            } else {
                this.timeLineStartTime = time;
                this.timeLineEndTime = this.timeLineStartTime + this.timeDiffrence;
            }
        },

        updateSelector(startTime, endTime, sourceID = null, index = null) {
            // console.log("source id is " ,sourceID);
            // console.log("source start time is  is " ,startTime);
            // console.log("source end time is  is " ,endTime);
            this.index = index;
            if (sourceID != null && sourceID !== this.sourceId) {
                return;
            }
            let totalSeconds = (this.timeLineEndTime - this.timeLineStartTime) / 1000;
            // console.log("total seconds are ",totalSeconds);
            let parentWidth = this.pane.parentElement.clientWidth;
            // console.log("client width is  seconds are ",parentWidth);
            let pxPerSecond = (parentWidth / totalSeconds);
            let boxStart = ((startTime - this.timeLineStartTime) / 1000) * pxPerSecond;
            let boxWidth = ((endTime - startTime) / 1000) * pxPerSecond;
            // console.log("box width ",boxWidth)
            // console.log("box left  ",boxStart)
             boxStart = parentWidth - boxWidth -4;
            this.pane.style.width = (boxWidth-8) + 'px';
            this.pane.style.left = (boxStart) + 'px';
        },

        getCurrentSelectedScene() {
            // console.log("get the scene " + this.timeLineStartTime +" end time is "+this.timeLineEndTime);
            let selection = this.calculateTime(false);
            // console.log("data is  ",selection);
            EventBus.$emit(TimeLinePanelEvent.CURRENTSELECTEDSCENE, selection);
        }

    },

    ready() {

    },

    mounted() {
        this.pane = this.$refs.selector;
        this.$parent.$nextTick().then(() => {
            this.parentData = this.pane.parentElement.getBoundingClientRect();
            this.pane.addEventListener('mousedown', this.onMouseDown);
            document.addEventListener('mousemove', this.onMove);
            document.addEventListener('mouseup', this.onUp);
            this.animate();
            let boxLeft = this.parentData.width - ((this.parentData.width / 60) * 20);
            let boxWidth = (this.parentData.width / 60) * 20;
            this.minWidth = (boxWidth - 8);
            this.pane.style.width = (boxWidth - 8) + "px";
            this.pane.style.left = boxLeft + "px";
        });
        this.timeLineStartTime = this.timeLineEndTime - this.timeDiffrence;
        EventBus.$on(TimeLinePanelEvent.SCROLLTOTIME, this.scrollToTime);

        EventBus.$on(TimeLinePanelEvent.NEXTSECOND, this.nextTick);
        EventBus.$on(TimeLinePanelEvent.ZOOMIN, this.zoomIn);
        EventBus.$on(TimeLinePanelEvent.ZOOMOUT, this.zoomOut);
        EventBus.$on(TimeLinePanelEvent.SCROLLTOTIME, this.scrollToTime);
        EventBus.$on(TimeLinePanelEvent.UPDATECURRENTTIME, this.updateCurrentTime);
        EventBus.$on(TimeLinePanelEvent.SCROLLRIGHT, this.nextTick);
        EventBus.$on(TimeLinePanelEvent.SCROLLLEFT, this.previousTick);
        EventBus.$on(TimeLinePanelEvent.UPDATESELECTOR, this.updateSelector);
        EventBus.$on(TimeLinePanelEvent.GETCURRENTSELECTEDSCENE, this.getCurrentSelectedScene);
        EventBus.$on(TimeLinePanelEvent.REMOVESCENEINDEX, this.removeSceneIndex);
        
    }
};
</script>

<style scoped>
.selection {
    border: solid 4px #f79d49;
    height: 100%;
    position: absolute;
    top: 0px;
    height: 67px;
    left: 0px;
    width: 0px;
    z-index: 9;

}
</style>
