<template>
  <div v-if="details.type === 1">
    <img :src="details.src">
  </div>
  <div v-else-if="details.type === 2" class="video-thumbnail border-red">
    <div class="name">{{details.sourceName}}</div>
    <img :src="details.src">
  </div>
  <div v-else-if="details.type === 3">
    <span class="video-header">
      <span :class="details.circleColor"></span>
      {{details.storyType}}
    </span>
    <img :src="details.src" class="image-responsive">
    <div class="details">
      <div>
        <h3>{{details.storyName}}</h3>
        <div class="ratings">
          <span class="star" v-for="index in details.star" :key="index"></span>
        </div>
      </div>
      <div>{{details.time}}</div>
    </div>
  </div>
  <div v-else>Not A/B/C</div>
</template>

<script>
export default {
  name: "thumbnail",
  props: {
    details: Object
  }
};
</script>

<style>
#thumbnail {
  color: red;
}
</style>