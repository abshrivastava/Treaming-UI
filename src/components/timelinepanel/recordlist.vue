<template>
<div class="record-list-cointainer">
     <RecordThumbnail :startTime="startTime" :baseUrl="baseUrl"  :IP ="IP"/>
    
    <SourceThumbnail :startTime="startTime" :currentTime="currentTime" :endTime="endTime" :zoomLevel="zoomLevel" :baseUrl="baseUrl" :sourceId="sourceId" :IP ="IP"/>
</div>
</template>

<script>
import SourceThumbnail from "./sourcethumbnail";

import RecordThumbnail from "./recordthumbnail";
export default {
    name: 'RecordList',
    props: {
        baseUrl: String,
        startTime: Number,
        zoomLevel: Number,
        currentTime: Number,
        endTime: Number,
        sourceId :String,
        IP : String
    },
    components: {
        SourceThumbnail,
        
        RecordThumbnail
    },
}
</script>

<style lang="">
.record-list-cointainer {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
}
</style>
