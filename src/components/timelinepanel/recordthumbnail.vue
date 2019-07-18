<template>
<div class="video-thumbnail">
    <div class="name">Source Name</div>
    <img :src="src || '../../assets/images/scene.jpg'" />
</div>
</template>

<script>
export default {
    name: 'RecordThumbnail',
    props: {
        baseUrl: String,
        startTime: Number,
        IP:String
    },
    data() {
        return {
            src: this.baseUrl ? (this.IP+this.baseUrl + this.startTime + ".jpg") : "",
        };
    }

}
</script>

<style >
.video-thumbnail{
	margin-right:3%;
	position:relative;
}
.video-thumbnail .name{
	position:absolute;
	top:0;
	left:0;
	background:rgba(0,0,0,.5);
	color:#fff;
	font-size:11px;
	font-weight:600;
	padding:5px
}
.video-thumbnail img{
	width:150px;
    height: 75px;
}
</style>
