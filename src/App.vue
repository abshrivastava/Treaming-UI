<template>
  <div id="app">
    <CusAppComp/>
  </div>
</template>

<script>
import CusAppComp from "./components/app/app";

export default {
  name: "AppComp",
  components: {
    CusAppComp
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>