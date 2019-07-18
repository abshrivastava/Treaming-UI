<template>
  <div class="container">
    <Header/>
    <div class="main-container">
      <div class="left-container">
        <div class="sync-top-container">
          <SceneWorkBench/>
          <StoryPreviewPanel/>
        </div>
        <TimelinePanel/>
      </div>
      <StoryListPanel/>
    </div>
  </div>
</template>

<script>
import { testActions } from "../../actions/test.action";
import ThumbnailView from "../common/thumbnailview";
import Header from "../header/header";
import SceneWorkBench from "../sceneworkbench/sceneworkbench";
import StoryPreviewPanel from "../storypreviewpanel/storypreviewpanel";
import TimelinePanel from "../timelinepanel/timelinepanel";
import StoryListPanel from "../storylistpanel/storylistpanel";

export default {
  name: "TestComp",
  components: {
    ThumbnailView,
    Header,
    SceneWorkBench,
    StoryPreviewPanel,
    TimelinePanel,
    StoryListPanel
  },
  data() {
    return { data: {} };
  },
  methods: {
    getData() {
      testActions
        .getData()
        .then(this.successHandle)
        .catch(this.errorHandle);
    },
    successHandle(data) {
      return (data = data);
    },
    errorHandle(error) {}
  },
  mounted() {
    this.getData();
  }
};
</script>