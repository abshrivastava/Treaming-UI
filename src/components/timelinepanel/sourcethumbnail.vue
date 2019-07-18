<template>
<!-- <RecordThumbnail/> -->
<div class="scene-list">
    <ThumbnailSelector :startTime="startTime" :currentTime="currentTime" :endTime="endTime" :zoomLevel="zoomLevel" :sourceId="sourceId" :baseUrl="baseUrl"/>
    <div class="scene-list-cointainer" :style="{width:cointainerWidth}" ref="content">
        <div class="vscroll-content-spacer" :style="{ width: topSpacerWidth, marginLeft: topSpacerMarginLeft, marginRight: topSpacerMarginRight }"></div>
        <SourceThumbnailItem v-for="data in windowedItems" :key="data" :source="data" :baseUrl ="baseUrl" :IP ="IP">
        </SourceThumbnailItem>
        <div class="vscroll-content-spacer" :style="{  width: bottomSpacerWidth, marginLeft: bottomSpacerMarginLeft, marginRight: bottomSpacerMarginRight }"></div>
    </div>
</div>
</template>

<script>
import SourceThumbnailItem from "./sourcethumbnailitem";
import RecordThumbnail from "./recordthumbnail";
import ThumbnailSelector from "./sourcethumbnailselector";
import Vue from "vue";
import EventBus from "../common/event-bus";

import {
    TimeLinePanelEvent
} from "../../constants/timelinepanel.event";
import {
    ThumbListConst,
    timeSliderConst,
    sourceThumbnailListConst
} from "../../constants/timelinepanel.constant";
export default {
    name: "sourcethumbnail",
    components: {
        SourceThumbnailItem,
        ThumbnailSelector,

    },
    props: {
        sourceId: String,
        baseUrl: String,
        startTime: Number,
        zoomLevel: Number,
        currentTime: Number,
        endTime: Number,  
        IP : String     
    },

    data() {
        return {
            // react window componeent code ///
            thumbBaseUrl: this.baseUrl,
            thumbSourceStartTime: this.startTime,
            timeLineZoomLevel: this.zoomLevel,
            thumbMaxVisibleItem: this.maxVisibleItem,
            thumbCurrentTime: this.currentTime,
            itemWidth: 0,
            itemHeight: 85,
            SCROLL_SPEED: 1000,
            timeLineStartTime: this.thumbSourceStartTime,
            timeLineEndTime: 0,
            ///////////////////////////////////

            scrollPos: 0, // how much distance timeline scroll in 1 second
            thumbNailMovementTime: 5, // this represent in how much second 1 thumbnail represent initally it represent 5 seconds
            TIMEDIFFRENCE: 5, // this represent the how much time will increese on zoom level  // need to optimize more this part use pawan sir logic
            dataAdded: 0,
            animationDuration: 1000,

            ///////////////////////////////////// scroll variable /////////////////////////
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            el: {}, //
            pagesPerChunk: 2000,
            pagesToScroll: 1,
            needItemHeightUpdate: false,
            pendingItemHeightUpdate: false,
            minScrollLeft: 0,
            maxScrollLeft: 0,
            items: [],
            windowedItems: [],
            itemAdded: 0,
            updateScroll: false,
            ///////////////////////////////////////////////////////////////////////////////

            /// windowing variables /////
            topSpacerWidth: 0,
            topSpacerMarginLeft: 0,
            topSpacerMarginRight: 0,
            bottomSpacerWidth: 0,
            bottomSpacerMarginLeft: 0,
            bottomSpacerMarginRight: 0,
            cointainerWidth: "300px",
            pushingItem : false,

            ////////////////////////////
        };
    },

    methods: {
        //////////////////////////////////////// Time line methods ////////////////////////////////////////////////////////////////
        intializeThumbnails(time, zoomLevel = -1, sourceId = null ,intializeScroll = true) {
            if (zoomLevel !== -1) {
                this.updateThumbNailMovementTime(zoomLevel);
                this.timeLineZoomLevel = zoomLevel;
            }
            if (time + this.thumbNailMovementTime * 12 * 1000 > this.thumbCurrentTime) {
                time = this.thumbCurrentTime - this.thumbNailMovementTime * 12 * 1000;
            }
            this.intializeDataSource(time, intializeScroll);
            this.bind();
            this.update(this.items);
        },

        intializeDataSource(intialTime, intializeScroll) {
            this.itemAdded = 0;
            this.updateScroll = false;
            this.topSpacerWidth = 0;
            this.topSpacerMarginLeft = 0;
            this.topSpacerMarginRight = 0;
            this.bottomSpacerWidth = 0;
            this.bottomSpacerMarginLeft = 0;
            this.bottomSpacerMarginRight = 0;

            this.height = 0;
            this.marginTop = 0;
            this.marginBottom = 0;
            this.pagesPerChunk = 2000;
            this.pagesToScroll = 1;
            this.needItemHeightUpdate = false;
            this.pendingItemHeightUpdate = false;
            this.minScrollLeft = 0;
            this.maxScrollLeft = 0;
            this.items = [];
            this.windowedItems = [];
            this.dataAdded = 0;
            let intialThumbnail = intialTime;
            this.el = {};
            this.el = this.$refs.content; //document.querySelector(".scene-list-cointainer");
            this.timeLineStartTime = intialTime;
            this.timeLineEndTime =
                this.timeLineStartTime * (1000 * 12 * this.thumbNailMovementTime);
            if (intialThumbnail < this.thumbSourceStartTime) {
                intialThumbnail = this.thumbSourceStartTime;
            }

            for (let i = 0; i < 14; i++) {
                let time = intialThumbnail + i * 1000 * this.thumbNailMovementTime;
                this.items.push(time);
            }
            if (intializeScroll) {
                this.el.scrollLeft = 0;
            }
        },

        addDataAtEnd(items) {
            let data = items;
            let endData = data[data.length - 1];
                data.push(endData + 1000 * this.thumbNailMovementTime);
                return data;
              

        },
        addDataAtStart() {
            let startData = this.items[0];

            if (
                startData - 1000 * this.thumbNailMovementTime >
                this.thumbSourceStartTime
            ) {
                this.items.unshift(startData - 1000 * this.thumbNailMovementTime);
                this.el.scrollLeft += this.itemWidth;
            }
        },
        scrollLeft() {
            this.$nextTick();

            if (this.el.scrollLeft === 0) {
                this.addItems(true, false);
            }
            this.timeLineStartTime -= 1000;
            this.timeLineEndTime -= 1000;
            const content = this.$refs.content;
            this.scrollTo(content, -this.scrollPos, this.animationDuration);
        },

        scrollRight() {
            this.$nextTick();
            this.$forceUpdate();
            //console.log("scroll to right ");
            if (this.endTime === 0 || (this.timeLineEndTime + 1000) <= this.endTime) {
                //  console.log("1221323423 scroll to right ");
                    let itemScrolled = Math.floor(
                    (this.el.scrollLeft + this.el.clientWidth) / this.itemWidth
                );
                //consolele.log("value of this is ", this);
                //consolele.log("item length is ", this.items.length);
                //consolele.log("item scrolled is ", itemScrolled);
                if ((this.items.length - itemScrolled <= 2) && !this.pushingItem) {
                    //consolele.log("item added  is " , this.pushingItem);
                    this.addItems(false, true);
                    //consolele.log("new item added length is ", this.items.length);
                }
                this.timeLineStartTime += 1000;
                this.timeLineEndTime += 1000;
                const content = this.$refs.content;
                this.scrollTo(content, this.scrollPos, this.animationDuration);
            
            }
        },

        scrollTo(element, scrollPixels, duration) {
            const scrollPos = element.scrollLeft;
            // console.log("scroll me " +(element.clientWidth + scrollPos) +" scroll width is " + element.scrollWidth +" scroll pixel is " +scrollPixels +" scroll pos is " +scrollPos );
            if (!((scrollPos === 0 || scrollPixels > 0) && (element.clientWidth + scrollPos === element.scrollWidth || scrollPixels < 0))) {
                //console.log("scroll me");
                // Get the start timestamp
                const startTime =
                    "now" in window.performance ?
                    performance.now() :
                    new Date().getTime();

                function scroll(timestamp) {
                    //Calculate the timeelapsed
                    const timeElapsed = timestamp - startTime;
                    //Calculate progress
                    const progress = Math.min(timeElapsed / duration, 1);
                    //Set the scrolleft
                    element.scrollLeft = scrollPos + scrollPixels * progress;
                    //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
                    if (timeElapsed < duration) {
                        //Request for animation
                        window.requestAnimationFrame(scroll);
                    } else {
                        return;
                    }
                }
                //Call requestAnimationFrame on scroll function first time
                window.requestAnimationFrame(scroll);
            }
        },

        getZoomLevel() {
            return this.zoomLevel;
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
            this.updateThumbNailMovementTime(zoomLevel);
            this.intializeThumbnails(this.timeLineStartTime);
        },

        updateThumbNailMovementTime(zoomLevel) {
            switch (zoomLevel) {
                case 1:
                    this.thumbNailMovementTime = ThumbListConst.ZOOM1 * 60 / 12;
                    break;
                case 2:
                    this.thumbNailMovementTime = ThumbListConst.ZOOM2 * 60 / 12;
                    break;
                case 3:
                    this.thumbNailMovementTime = ThumbListConst.ZOOM3 * 60 / 12;
                    break;
                case 4:
                    this.thumbNailMovementTime = ThumbListConst.ZOOM4 * 60 / 12;
                    break;
            }
            this.animationDuration = 1000;
            this.scrollPos = this.itemWidth / this.thumbNailMovementTime;
            while (this.scrollPos <= 1) {
                this.scrollPos += this.itemWidth / this.thumbNailMovementTime;
                this.animationDuration += 1000;
            }
        },

        //////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////// React window concept ////////////////////////
        ///////////////////////////////////get px //////////////////////////////////////
        getPx(style, key) {
            var value = style;
            if (key) {
                value = style.getPropertyValue(key);
            } // end if

            if (typeof value == "number") {
                return value;
            } else {
                var match = /^([0-9.-]+)(?:px)?$/.exec(value);
                if (match) {
                    return parseInt(match[1], 10);
                } // end if
            } // end if
        }, // end getPx
        //////////////////////////////////////////////////////////////////////////////////////

        bind() {
            this.el = this.$refs.content; //document.querySelector(".scene-list-cointainer");
            var computedStyle = window.getComputedStyle(this.el, null);
            this.topSpacerWidth = 0;
            this.topSpacerMarginLeft = 0;
            this.topSpacerMarginRight = 0;

            this.bottomSpacerWidth = 0;
            this.bottomSpacerMarginLeft = 0;
            this.bottomSpacerMarginRight = 0;

            this.needItemHeightUpdate = false;
            this.itemWidth = this.getPx(this.itemWidth);
            if (!this.itemWidth) {
                this.itemWidth =
                    this.getPx(computedStyle, "line-height") ||
                    this.getPx(computedStyle, "font-size") ||
                    0;
                this.needItemHeightUpdate = true;
            } // end if

            this.pagesPerChunk =
                typeof this.pagesPerChunk == "string" ?
                parseInt(this.pagesPerChunk, 10) :
                this.pagesPerChunk || 5;
            this.pagesToScroll =
                typeof this.pagesToScroll == "string" ?
                parseInt(this.pagesToScroll, 10) :
                this.pagesToScroll || 3;

            this.itemsPerPage = 50;
            this.itemsPerChunk = this.itemsPerPage * this.pagesPerChunk;

            this.el.style.overflow = "hidden";

            this.checkScrollPosition = this.checkScrollPosition.bind(this);

            this.el.addEventListener("scroll", this.checkScrollPosition);
            this.el.addEventListener("wheel", this.checkScrollPosition);

            this.$scrollContext = {
                inScrollWindow: this.inScrollWindow.bind(this),
                items: []
            };

            this.windowedItems = [];

            this.windowedItemsKey = this.arg || "$scrollWindowedItems";
        },

        update(items) {
            this.items = items;

            this.updateItemWidth();

            this.updateWindowExtents();
        },

        inScrollWindow(item, index) {
            return index >= this.firstItemIndex && index <= this.lastItemIndex;
        },

        updateItemWidth(tries = 0) {
            if (this.pendingItemHeightUpdate) {
                return;
            } // end if

            if (this.needItemHeightUpdate) {
                this.pendingItemHeightUpdate = true;
                Vue.nextTick(() => {
                    this.pendingItemHeightUpdate = false;

                    if (this.el.children.length > 2) {
                        var firstChildItem =
                            this.el.querySelector(".v-scroll-item") || this.el.children[1];
                        if (firstChildItem.offsetHeight > 0) {
                            var computedItemStyle = window.getComputedStyle(
                                firstChildItem,
                                null
                            );

                            var marginLeft = this.getPx(computedItemStyle, "margin-left");
                            var marginRight = this.getPx(computedItemStyle, "margin-right");

                            this.itemWidth =
                                firstChildItem.offsetWidth + Math.max(marginLeft, marginRight);

                            this.topSpacerMarginLeft = marginLeft;
                            this.topSpacerMarginRight = marginRight;
                            this.bottomSpacerMarginLeft = marginLeft;
                            this.bottomSpacerMarginRight = marginRight;

                            this.needItemHeightUpdate = false;

                            this.updateWindowExtents();
                        } else {
                            // Child item has no height; try again later.
                            setTimeout(() => {
                                this.updateItemHeight(tries + 1);
                            }, 200);
                        } // end if
                    } // end if
                });
            } // end if
        },

        updateViewportInfo() {
            if (this.el.clientWidth != this.lastClientWidth) {
                this.lastClientWidth = this.el.clientWidth;

                this.itemsPerPage = Math.ceil(this.el.clientWidth / this.itemWidth);

                // Cache the configured number of items.
                this.itemsPerChunk = this.itemsPerPage * this.pagesPerChunk;
            }
        },

        checkScrollPosition() {
            var el = this.el;

            // Load a new chunk if the viewport has scrolled beyond the configured number of scrollable pages.
            if (
                !this.minScrollLeft ||
                el.scrollLeft < this.minScrollLeft ||
                el.scrollLeft > this.maxScrollLeft
            ) {
                this.updateWindowExtents();
            }
        },

        updateWindowExtents() {
            this.updateViewportInfo();
            var curScrollLeft = this.el.scrollLeft;
            var scrollMid = curScrollLeft + this.el.clientWidth / 2;
            // Figure out what item would be in the middle of the viewport.
            var itemIndexAtScrollMid = Math.floor(scrollMid / this.itemWidth);
            var itemsPerScrollArea = this.itemsPerPage * this.pagesToScroll;
            var scrollAreaHeight = itemsPerScrollArea * this.itemWidth;

            this.firstItemIndex = Math.floor(
                Math.max(0, itemIndexAtScrollMid - this.itemsPerChunk / 2)
            );
            this.lastItemIndex = this.firstItemIndex + this.itemsPerChunk;

            var scrollAreaFirstItemIndex =
                this.firstItemIndex + (this.itemsPerChunk - itemsPerScrollArea) / 2;
            this.minScrollLeft = scrollAreaFirstItemIndex * this.itemWidth;
            this.maxScrollLeft = this.minScrollLeft + scrollAreaHeight;

            var topSpacerWidth = this.firstItemIndex * this.itemWidth;

            this.topSpacerWidth = topSpacerWidth + "px";
            var bottomSpacerWidth =
                Math.max(this.items.length - this.lastItemIndex, 0) * this.itemWidth;
            this.bottomSpacerWidth = bottomSpacerWidth + "px";

            this.updateWindowedItems();
        },

        updateWindowedItems() {
            this.windowedItems.splice.apply(
                this.windowedItems,
                [0, this.windowedItems.length].concat(
                    this.items.slice(this.firstItemIndex, this.lastItemIndex)
                )
            );
        },

        addItems(start, end) {
            if (start) {
                for (let i = 0; i < 2; i++) {
                    this.addDataAtStart();
                }
                var maxScrollLeft = this.el.scrollWidth - this.el.clientWidth;
            } else {
                //consolele.log("i am adding the item");
                this.pushingItem = true;
                for (let i = 0; i < 2; i++) {
                  this.items =  this.addDataAtEnd(this.items);
                }
                this.pushingItem = false;
                //consolele.log(" items are added ", this.items.length);
            }
            this.update(this.items);
            this.$forceUpdate();
        },

        updateCurrentTime(time) {
            this.thumbCurrentTime = time;
        }

        /////////////////////////////////////////////////////////////////////////////////
    },

    watch: {
        zoomlevel(newValue, oldValue) {
            if (newValue <= MAXZOOM && newValue >= MINZOOM) {
                if (oldValue > newValue) {
                    updateThumbnailArray(-(1000 * thumbNailMovementTime));
                } else {
                    updateThumbnailArray(1000 * thumbNailMovementTime);
                }
            }
        }
    },

    mounted() {
        let time = this.thumbCurrentTime - 12 * 1000 * this.thumbNailMovementTime;
        this.intializeThumbnails(time, -1, false);
        EventBus.$on(TimeLinePanelEvent.ZOOMIN, this.zoomIn);
        EventBus.$on(TimeLinePanelEvent.ZOOMOUT, this.zoomOut);
        EventBus.$on(TimeLinePanelEvent.SCROLLLEFT, this.scrollLeft);
        EventBus.$on(TimeLinePanelEvent.SCROLLRIGHT, this.scrollRight);
        EventBus.$on(TimeLinePanelEvent.SCROLLTOTIME, this.intializeThumbnails);
        EventBus.$on(TimeLinePanelEvent.NEXTSECOND, this.scrollRight);
        EventBus.$on(TimeLinePanelEvent.UPDATECURRENTTIME, this.updateCurrentTime);
        let self = this;
        this.$nextTick(function () {
            let child = this.$children;
            this.itemWidth = child[1].$el.clientWidth;
            this.cointainerWidth = this.itemWidth * 12 + "px";
            this.scrollPos = parseInt(this.itemWidth) / ((ThumbListConst.ZOOM1 * 60) / 12);
        });
    }
};
</script>

<style>
.scene-list-cointainer {
    float: left;
    overflow: hidden;
    white-space: nowrap;
    height: 75px;
    display: flex;
}

.vscroll-content-spacer {
    height: 100%;
    opacity: 0;
    position: relative;
    clear: both;
    display: inline-block;
}
</style>
