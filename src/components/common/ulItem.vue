<template>
  <ul :class="classname" id="storyList">
    <LiItem v-for="(item, index) in items" :key="item.id" :item="item" :index="index" :type="type" :selectState="selectState"/>
  </ul>
</template>

<script>
import LiItem from "../common/liItem.vue";

export default {
  name: "ulComp",
  components: {
    LiItem
  },
  props: {
    classname: String,
    type: Number,
    items: {
      type: Array,
      required: true
    },
    selectState:Number
  }
};
</script>