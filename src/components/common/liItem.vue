<template>
  <li>
    <input
      :checked="isChecked(item.ID)"
      type="checkbox"
      :style="{display: display}"
      v-on:change="showData(item)"
    >
    <ThumbnailItem :item="item" :index="index" :type="type"/>
  </li>
</template>

<script>
import ThumbnailItem from "./thumbnailitem.vue";
import EventBus from "./event-bus";

export default {
  name: "LiItemComp",
  methods: {
    showData: function(_item) {
      EventBus.$emit("toggleCheckbox", _item);
    },
    isChecked: function(_data) {
      return this.checkedStories && this.checkedStories.includes(_data);
    }
  },
  props: {
    item: Object,
    index: Number,
    type: Number,
    selectState: Number
  },
  computed: {
    display: function() {
      return this.selectState ? "none" : "block";
    }
  },
  components: {
    ThumbnailItem
  }
};
</script>

<style>
</style>
