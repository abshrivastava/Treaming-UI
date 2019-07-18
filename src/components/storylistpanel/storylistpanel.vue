<template>
  <div class="right-container" ref="rightContainer">
    <div class="being-action" ref="beingAction">
       <h3>Loading ...</h3>
    </div>
    <div class="header">
      <span>To preview</span>
      <div v-if="selectState==0" id="cancelselectbtn" class="cancel-select-btn1">
        <button class="link-btn" @click="cancelSelectStory()">Cancel</button>
        <button class="link-btn combine" @click="combineStory()">Combine</button>
      </div>
      <div v-if="selectState==1" id="selectwrapperbtn" class="select-wrapper-btn1">
        <button class="link-btn" @click="selectStory()">Select</button>
      </div>
    </div>

    <div v-if="stories.length>0" class="list-container">
      <UlItem :items="stories" :type="type" :selectState="selectState"/>
    </div>
    <div v-else class="list-container no-data">
      <p>No Story yet</p>
    </div>
  </div>
</template>

<script>
import { storyActions } from "../../actions/story.action.js";
import UlItem from "../common/ulItem.vue";
import EventBus from "../common/event-bus";
import Global from "../../helper/global.js";

export default {
  name: "StorylistpanelComp",
  components: {
    UlItem
  },
  data() {
    return {
      selectState: 1,
      checkedStories: [],
      stories: [],
      type: 3
    };
  },
  methods: {
    /**
     * Description: enable select label
     */
    enableSelect: function() {
      this.selectState = 1;
    },
    /**
     * Description: disable select label
     */
    disableSelect: function() {
      this.selectState = 0;
    },
    /**
     * Description: enable select label by clicking cancel label
     */
    cancelSelectStory: function() {
      //alert("cancelSelectStory");
      this.clearCheckedStories();
      this.enableSelect();
    },
    /**
     * Description: enable select label by clicking combine label
     */
    combineStory: function() {
      //alert("combineStory");
      if (this.checkedStories.length > 0) {
        EventBus.$emit("combineStories", this.checkedStories);
        this.enableSelect();
        this.clearCheckedStories();
      } else {
        alert("Please select atleast one story");
      }
    },
    /**
     * Description: disable select label by clicking select label
     */
    selectStory: function() {
      this.disableSelect();
    },
    /**
     * Description: Clear checked strories
     */
    clearCheckedStories: function() {
      //alert("selectStory");
      this.checkedStories = [];
    },
    getData() {
      storyActions
        .getAllStory()
        .then(this.successHandle,this)
        .catch(this.errorHandle);
    },
    successHandle(data,that) {
      console.log(data);
      return (this.stories = JSON.parse(data.data.ReturnValue));
    },
    errorHandle(e){
      console.log(e);
    }
  },
  mounted: function() {
    var that  = this;
    //below code will move to workbench module
    //refresh component
    EventBus.$on("refreshComponent", () => {
       that.getData();
    });

    EventBus.$on("eventStart", (text) => {
     that.$refs.beingAction.childNodes[0].textContent = text+"...";
     that.$refs.rightContainer.classList.add("loading-blur");
    });

    EventBus.$on("eventEnd", () => {
      that.getData();
      that.$refs.rightContainer.classList.remove("loading-blur");
    });

    EventBus.$on("selecteditem", (_data, _position) => {
      console.log("selecteditem......>", _data, _position);
	    EventBus.$emit("editStory",_data)
    });

    EventBus.$on("deleteitem", (_data, _position) => {
      console.log("deleteitem......>", _data, _position);
      Global.removeItemByPosition(this.stories, _position, 1);
    });

    EventBus.$on("additem", (_data, _position) => {
      console.log("additem.....>", _data, _position);
      Global.addItem(this.stories, _data);
    });

    EventBus.$on("toggleCheckbox", _item => {
      if (!Global.isAvailable(this.checkedStories, _item, "ID")) {
        Global.addItem(this.checkedStories, _item);
      } else {
        this.checkedStories = Global.removeItemByKey(
          this.checkedStories,
          _item,
          "ID"
        );
      }
    });
    this.getData();
  }
};
</script>
