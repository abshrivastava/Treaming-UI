<template>
<div class="time-slider">
    <div class="time-slider-container">
        <a href="#" class="left-arrow" @click="scrollPrevious"></a>
        <span class="start-time">{{displayStartTime}}</span>
        <span class="end-time">{{displayEndTime}}</span>
        <div class="time-scale">
            <span class="time-point"></span>
            <span class="time-point"></span>
            <span class="time-point"></span>
            <span class="time-point"></span>
            <span class="time-point"></span>
            <span class="time-point"></span>
        </div>
        <a href="#" class="right-arrow" @click="scrollNext"></a>
    </div>
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
    name: "timeslider",

    props: {
        startTime: Number,
        endTime: Number,
        currentTime: Number,
        zoomLevel: Number
    },

    data() {
        return {
            timeLineStartTime: 0,
            timeLineEndTime: this.currentTime,
            timeLineZoomLevel: this.zoomLevel,
            displayStartTime: 0,
            displayEndTime: COMMON_UTILITIES.epochToTime(this.currentTime),
            timeLineCurrentZoomTime: ThumbListConst.ZOOM1,
            sourceCurrentTime: this.currentTime,
            timeDiffrence: ThumbListConst.ZOOM1 * 60 * 1000,
        }
    },

    methods: {
        scrollNext() {
            if (this.endTime === 0 || (this.timeLineStartTime + 1000) <= this.endTime) {
                this.timeLineStartTime += 1000;
                this.timeLineEndTime += 1000;
                this.displayStartTime = COMMON_UTILITIES.epochToTime(this.timeLineStartTime);
                this.displayEndTime = COMMON_UTILITIES.epochToTime(this.timeLineEndTime);
                let data = {
                    startTime: this.timeLineStartTime,
                    endTime: this.timeLineEndTime
                };
                EventBus.$emit(TimeLinePanelEvent.SCROLLRIGHT);
            }
        },

        scrollPrevious() {
            if ((this.timeLineStartTime - 1000) >= this.startTime) {
                this.timeLineStartTime -= 1000;
                this.timeLineEndTime -= 1000;
                this.displayStartTime = COMMON_UTILITIES.epochToTime(this.timeLineStartTime);
                this.displayEndTime = COMMON_UTILITIES.epochToTime(this.timeLineEndTime);
                let data = {
                    startTime: this.timeLineStartTime,
                    endTime: this.timeLineEndTime
                };
                EventBus.$emit(TimeLinePanelEvent.SCROLLLEFT);
            }

        },

        zoomIn() {
            if (this.timeLineZoomLevel < ThumbListConst.MAXZOOM) {
                this.timeLineZoomLevel++;
                this.zoom(this.timeLineZoomLevel);
            }
        },

        zoomOut() {
            if (this.timeLineZoomLevel > ThumbListConst.MINZOOM) {
                this.timeLineZoomLevel--;
                this.zoom(this.timeLineZoomLevel);
            }
        },

        zoom(zoomLevel) {
            this.upDateTimeDiff(zoomLevel);
            this.scrollToTime(this.timeLineStartTime);
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
        scrollToTime(time, zoomLevel = -1) {
            if (zoomLevel !== -1) {
                this.upDateTimeDiff(zoomLevel);
                this.timeLineStartTime = time;
                this.timeLineEndTime = this.timeLineStartTime + this.timeDiffrence;

            } else {
                if ((time + this.timeDiffrence) > this.sourceCurrentTime) {
                    this.timeLineEndTime = this.sourceCurrentTime;
                    this.timeLineStartTime = this.timeLineEndTime - this.timeDiffrence;
                } else {
                    this.timeLineStartTime = time;
                    this.timeLineEndTime = this.timeLineStartTime + this.timeDiffrence;
                }
            }
            this.displayStartTime = COMMON_UTILITIES.epochToTime(this.timeLineStartTime);
            this.displayEndTime = COMMON_UTILITIES.epochToTime(this.timeLineEndTime);
        },

        updateCurrentTime(time) {
            if (this.endTime === 0 || time <= this.endTime) {
                this.sourceCurrentTime = time;
            }
        }
    },

    ready() {

    },

    mounted() {
        this.timeLineStartTime = this.sourceCurrentTime - (ThumbListConst.ZOOM1 * 60 * 1000);
        this.displayStartTime = COMMON_UTILITIES.epochToTime(this.timeLineStartTime);
        EventBus.$on(TimeLinePanelEvent.NEXTSECOND, this.scrollNext);
        EventBus.$on(TimeLinePanelEvent.ZOOMIN, this.zoomIn);
        EventBus.$on(TimeLinePanelEvent.ZOOMOUT, this.zoomOut);
        EventBus.$on(TimeLinePanelEvent.SCROLLTOTIME, this.scrollToTime);
        EventBus.$on(TimeLinePanelEvent.UPDATECURRENTTIME, this.updateCurrentTime);

    }
};
</script>

<style scoped>
/* timeline slider */
.time-slider {
    position: relative;
    left: 91px;
    width: 982px;
    color: rgba(255, 255, 255, .9);
    top: -28px;
    border-top: solid 2px rgba(255, 255, 255, .5);
    font-size: 11px;
}

.time-slider-container{
        width:1020px;
        margin-left:180px;
}

.time-slider .start-time {
    left: 3px;
    position: absolute;
    top: 2px;
}

.time-slider .end-time {
    position: absolute;
    right: 3px;
    top: 2px;
}

.time-slider .time-scale .time-point {
    width: 2px;
    height: 17px;
    background: rgba(255, 255, 255, .5);
    display: inline-block;
    position: absolute;
    top: -2px;
}

.time-slider .time-scale span.time-point:nth-child(1) {
    left: 0%;
}

.time-slider .time-scale span.time-point:nth-child(2) {
    left: 20%;
}

.time-slider .time-scale span.time-point:nth-child(3) {
    left: 40%;
}

.time-slider .time-scale span.time-point:nth-child(4) {
    left: 60%;
}

.time-slider .time-scale span.time-point:nth-child(5) {
    left: 80%;
}

.time-slider .time-scale span.time-point:nth-child(6) {
    left: 100%;
}

.time-slider .left-arrow,
.time-slider .right-arrow {
    position: absolute;
    color: #fff;
    text-decoration: none;
    top: -3px;
    background: url("../../assets/images/icons.png") no-repeat;
    width: 15px;
    height: 20px;
}

.time-slider .left-arrow {
    left: -15px;
    background-position: -145px 0;
}

.time-slider .right-arrow {
    right: -19px;
    background-position: -162px 0;
}

/* end timeline slider */
</style>
