<template>
<div class="internal1" :id= "'a'+src">
<img :src="src || '../../assets/images/scene.jpg'">
</div>
</template>

<script>

export default {
    name: 'SourceThumbnailItem',
    props:{
        baseUrl : String,
        source : Number,
        IP : String
    },
    data(){
        return {src : this.baseUrl ? (this.IP+this.baseUrl + this.source + ".jpg") : "",};
    }

}
</script>

<style lang="">
    .internal img{
        width:85px;
	    height:75px;
    }

    .internal{
         width:85px;
 height: 100%;
 display: inline-block;
}
</style>