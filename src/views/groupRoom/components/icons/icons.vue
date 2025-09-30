<!--
 * @Author: hua
 * @Date: 2019-07-18 08:54:06
 * @description: 表情页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:17:37
 -->
<template>
  <div class="icons_wrapper">
    <div class="row">
      <Picker :data="emojiIndex" set="twitter" @select="showEmoji" />
    </div>

    <div class="row">
      <div>
        {{ emojisOutput }}
      </div>
    </div>
  </div>
</template>
<script>
// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
let emojiIndex = new EmojiIndex(data);
export default {
    components: {
        Picker
    },
    data(){
        return{
          emojiIndex: emojiIndex,
          emojisOutput: ""
        }
    },
    created(){

    },
     methods: {
    showEmoji(emoji) {
      this.emojisOutput = this.emojisOutput + emoji.native;
      console.log(this.emojisOutput);
      this.$emit('recInsertIcon',this.emojisOutput)
    }
  }
}
</script>
<style scope >
.icons_wrapper {
    height: 200px !important;
    width: 100%;
    max-width: 750px;
    min-width: 300px;
    border-top: 1px solid #e9e9e9;
    text-align: left;
    overflow-x: auto;
    background: #fff;
    flex-wrap: wrap;
    position:fixed;
    bottom:0rem;
}
</style>