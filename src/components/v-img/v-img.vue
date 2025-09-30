<!--
 * @Author: hua
 * @Date: 2019-07-10 13:10:40
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-24 20:07:59
 -->
<template>
    <img  v-lazy="imgUrl || defaultImageUrl" :key="imgUrl || defaultImageUrl" />
    <!-- <img  :src="imgUrl" :key="imgUrl" /> -->
</template>
<script>
import { mapGetters } from "vuex";

export default {
    components: {
    },
    data() {
        return {
        };
    },
    props:{
        imgUrl: {
            type: String,
            default: function() {
                return this.DEFAULTIMG;
            }
        }
    },
    computed: {
        ...mapGetters([
            "DEFAULTIMG",
        ]),
        // 处理默认图片的完整URL
        defaultImageUrl() {
            if (!this.DEFAULTIMG) return '';
            // 如果是相对路径，添加基础路径
            if (this.DEFAULTIMG.startsWith('static/')) {
                return this.DEFAULTIMG;
            }
            // 如果是完整URL或base64，直接返回
            return this.DEFAULTIMG;
        }
    },
    created() {
      
    },
    mounted() {
    
    },
    watch: {
    
    },
    methods: {
        init(){
        }
    }
};
</script>
<style lang="scss" scoped>
</style>