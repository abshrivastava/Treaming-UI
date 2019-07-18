<template>
<div>
    <div class="replay-container">
        <div class="play-controls">
            <div class="zoom-opt">
                <a href="#" class="plus" @click="zoomIn">+</a>
                <a href="#" class="minus" @click="zoomOut">-</a>
            </div>
            <a href="#" class="backward" @click="moveAtStart"></a>
            <a href="#" class="pause" @click="playPause"></a>
            <a href="#" class="forward" @click="moveAtEnd"></a>
            <span class="time-start">{{displayStartTime}}</span>
            <TimeProgressbar v-model="value2" :min="startTime" :max="currentTime" :processStyle="slider.processStyle" :lineHeight="slider.lineHeight" :tooltipStyles="{ backgroundColor: '#979797', borderColor: '#979797' }" />
            <span class="time-end">{{displayEndTime}}</span>
        </div>
        <button class="btn-green btn-replay" @click="moveAtEnd">Replay</button>

    </div>
    <!-- <div style="color: gray">{{value2}}</div> -->
</div>
</template>

<script>
import
TimeProgressbar
from "./timeprogressbar";
import {
    TimeLinePanelEvent
} from "../../constants/timelinepanel.event";
import EventBus from "../common/event-bus";
import {
    COMMON_UTILITIES
} from "../common/commonutility";
export default {
    name: "trickplay",
    components: {
        TimeProgressbar
    },
    props: {
        startTime: Number,
        currentTime: Number,
        endTime: Number,
    },
    data() {
        return {
            timer: null,
            play: true,
            value2: this.currentTime,
            sourceCurrentTime: this.currentTime,
            slider: {
                lineHeight: 10,
                processStyle: {
                    backgroundColor: '#979797'
                }
            },
            displayStartTime: COMMON_UTILITIES.epochToTime(this.startTime),
            displayEndTime: COMMON_UTILITIES.epochToTime(this.currentTime),
        }
    },
    methods: {
        zoomIn() {
            EventBus.$emit(TimeLinePanelEvent.ZOOMIN);
        },
        zoomOut() {
            EventBus.$emit(TimeLinePanelEvent.ZOOMOUT);
        },
        moveAtEnd() {
            console.log("move at end");
            let time = this.currentTime;
            if (this.endTime != 0) {
                time = this.endTime;
            } else {
                time = this.sourceCurrentTime;
            }
            EventBus.$emit(TimeLinePanelEvent.SCROLLTOTIME, time);
        },
        moveAtStart() {
            console.log("move at start");
            EventBus.$emit(TimeLinePanelEvent.SCROLLTOTIME, this.startTime);
        },
        playPause() {
            console.log("play pause")
            if (this.play) {
                this.endTimer();
                this.play = false;
            } else {
                this.startTimer();
                this.play = true;
            }
        },
        startTimer() {
            let self = this;
            this.timer = setInterval(() => {
                EventBus.$emit(TimeLinePanelEvent.NEXTSECOND);
            }, 1000);
        },
        endTimer() {
            if (this.timer != null) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    },
    mounted() {
        this.startTimer();
        //	window.setInterval(()=>{EventBus.$emit(TimeLinePanelEvent.NEXTSECOND)},1000);
    }
};
</script>

<style>
/* Start Replay Container */
.replay-container {
    background: #4b4b4b;
    padding: 5px 0;
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.replay-container .btn-replay {
    position: absolute;
    right: 5%;
}

.play-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
}

.zoom-opt {
    margin-right: 220px;
}

.play-controls a.plus {
    background: none;
    width: 25px;
    height: 25px;
    display: inline-block;
    margin: 0 10px;
    color: #fff;
    text-decoration: none;
    font-size: 30px;
    margin-top: -5px;
}

.play-controls a.minus {
    background: none;
    width: 25px;
    height: 25px;
    display: inline-block;
    margin: 0 10px;
    color: #fff;
    text-decoration: none;
    font-size: 45px;
    margin-top: -24px;
}

.play-controls .backward {
    background: url("../../assets/images/icons.png") no-repeat;
    background-position: 0 3px;
}

.play-controls .pause {
    background: url("../../assets/images/icons.png") no-repeat;
    background-position: -39px 2px;
}

.play-controls .play {
    background: url("../../assets/images/icons.png") no-repeat;
    background-position: -107px 2px;
}

.play-controls .forward {
    background: url("../../assets/images/icons.png") no-repeat;
    background-position: -76px 3px;
}

.progress-bar {
    min-width: 300px;
    background: #979797;
    border-radius: 12px;
    height: 10px;
    margin: 0 10px;
    position: relative;
}

.progress-bar .progress-point {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #27d700;
    border-radius: 50%;
    top: -4px;
}

.progress-bar .progress-point .arrow-down {
    position: absolute;
    top: 20px;
    left: -5px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #363636;
}

/* End */
</style>
