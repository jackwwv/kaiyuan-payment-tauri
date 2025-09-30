<!--
 * @Author: hua
 * @Date: 2019-07-10 10:50:03
 * @description: 房间详情
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:16:08
 -->
<template>
    <div class="room_details">
        <div v-if="status">
            <!-- 利用v-if…v-else切换 展开 和 收起 两个画面，template包裹多个元素 -->
            <template v-if="isHide">
                <!-- 只显示摘要的画面 -->
                <div class="hideBg">
                    <div class="summary">
                        <ul class="user_header_wrapper">
                            <li style="width:25%;text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;" v-for="(item, index) in list" :key="index">
                                <vImg :style="item.users.online ? '' : 'background: grey;opacity: 0.5'"
                                    :imgUrl="item.users.head_img"></vImg>
                                <span>{{ item.users.nick_name }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="showBtn">
                        <!-- 绑定点击事件onShow，点击展开全文 -->
                        <a href="#" @click.stop.prevent="onShow">
                            展开查看全部&nbsp;
                            <!-- 向下的角箭头符号，用css画 -->
                            <span class="downArrow"></span>
                        </a>
                    </div>
                </div>
            </template>
            <template v-else>
                <!-- 显示完整内容的画面 -->
                <div class="showBg">
                    <div>
                        <ul class="user_header_wrapper">
                            <li style="width:25%;text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;" v-for="(item, index) in list" :key="index" @click="handleGoPersonInfo(item)">
                                <vImg :imgUrl="item.users.head_img"></vImg>
                                <span>{{ item.users.nick_name }}</span>
                            </li>
                            <li style="width:25%" @click="handleAddCustomer">
                                <div style="font-size: 0.8rem;margin-top:0.3rem" class="icon-custom-jia"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="hideBtn">
                        <!-- 绑定点击事件onHide，点击收起内容 -->
                        <a href="#" @click.stop.prevent="onHide">
                            收起&nbsp;
                            <!-- 向上的角箭头符号 -->
                            <span class="upArrow"></span>
                        </a>
                    </div>
                </div>
            </template>
            <!-- 房间名称 -->
            <yd-cell-item style="background: #fff;">
                <span slot="left" style="font-weight: bold">房间名称</span>
                <span slot="right"  v-if="selectType==0">{{ currentRoomName }}</span>
                <span slot="right" @click="handleChangeRoomName" v-else>{{ currentRoomName }}</span>

            </yd-cell-item>
             <!-- 房间图像 -->
             <yd-cell-item style="background: #fff;" @click.native="bindFile('image_file')">
                <span slot="left" style="font-weight: bold">修改房间图片</span>
                <span slot="right">
                    <span class="icon-custom-you icon-right"></span>
                </span>
            </yd-cell-item>
            <!--新消息提醒-->
            <!-- <yd-cell-item style="background: #fff;">
                <span slot="left" style="font-weight: bold">新的消息提醒</span>
                <span slot="right">
                    <yd-switch v-model="alert">
                    </yd-switch>
                </span>
            </yd-cell-item> -->
            <!-- 聊天数据离线保存 -->
            <!-- <yd-cell-item style="background: #fff;">
                <span slot="left" style="font-weight: bold">聊天云端保存</span>
                <span slot="right">
                    <yd-switch v-model="save_action">
                    </yd-switch>
                </span>
            </yd-cell-item> -->
            <CrossLine></CrossLine>
            <!--聊天历史记录-->
            <yd-cell-item style="background: #fff;" @click.native="$router.push({ name: 'roomMsgList' })">
                <span slot="left" style="font-weight: bold">聊天历史记录</span>
                <span slot="right">
                    <span class="icon-custom-you icon-right"></span>
                </span>
            </yd-cell-item>
            <CrossLine></CrossLine>
            <!--清空聊天历史记录-->
            <yd-cell-item style="background: #fff;" @click.native="handleDelRoomMsg">
                <span slot="left" style="font-weight: bold">清空聊天历史记录</span>
                <span slot="right">
                </span>
            </yd-cell-item>
            <!--删除并退出-->
            <yd-button size="large" type="hollow" @click.native="handleDelRoom" v-if="selectType!=0">删除并退出</yd-button>
            <!-- 模态窗 -->
            <!--  <vModal 
                ref="DelRoomRef"
                @onConfirm="handleDelRoom"
                :title="'提示'"
                :text="'删除房间'"
                :description="'删除后聊天记录将清空'"
            >
            </vModal> -->
        </div>
        <div v-else style="    position: absolute;
    font-size: 30px;
    left: 50%;
    margin-left: -30px;
    top: 50%;
    margin-top: -20px;">暂无</div>
     <input type="file" id="image_file" @change="bindImg" style="display:none;">
    <!-- 裁剪图 -->
    <header v-if="cropperShow" style="background-color: rgb(255, 255, 255);
    color: rgb(228, 228, 228);
    position: fixed;
    top: 0px;
    width: 100%;
    height: 1rem !important;z-index:100001">
        <div  style="height: 1rem;">
            <div class="yd-navbar-center">
                <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;line-height: 1rem;">拖动框进行裁剪</span>
                <span  @click="confirmCropper"  style="color: rgb(92, 92, 92);font-size: 0.3rem;padding-right: 12px;line-height: 1rem; position: fixed;right: 0px;top: 0px;z-index:100002;">使用</span>
            </div>
        </div> 
    </header>
     <vueCropper
        v-if="cropperShow"
        ref="cropper_image"
        style="height:100%;position:fixed;z-index:100000;top:1rem "
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :canMoveBox="option.canMoveBox"
        :canMove="option.canMove"
        :autoCrop="true"
        :centerBox="option.centerBox"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"
    ></vueCropper>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { Confirm } from "vue-ydui/dist/lib.rem/dialog";
import vModal from '@/components/v-modal/v-modal'
import storage from "@/utils/localstorage"
import vImg from '@/components/v-img/v-img'
import { joinChatSend } from '@/socketIoApi/chat'
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import { delRoomMsg } from '@/utils/indexedDB'
import { roomMsgDel, roomDel, roomNameChange, roomChangeImage } from '@/socketioApi/room'
import { Alert, Toast, Loading } from 'vue-ydui/dist/lib.rem/dialog'
import { VueCropper } from "vue-cropper"
import {uploadBase64} from '@/socketioApi/common'
import lrz from 'lrz'
import { userRoomRelationGetByRoomUuid, userRoomRelationUpdateAlert, userRoomRelationUpdateSaveAction } from '@/socketioApi/userRoomRelation'
export default {
    data() {
        return {
            status: true,
            isHide: true, //初始值为true，显示为折叠画面
            alert: true,
            save_action: false,
            list: [],
            option: {
                img: "",
                size: 1,
                canScale: true,
                outputType: "png",
                canMove: true,
                canMoveBox: true,
                centerBox: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 250,
                autoCropHeight: 250,
                // 开启宽度和高度比例
                fixed: true,
                fixedNumber: [4, 4]
            },
            cropperShow: false,
            selectType: 0
        };
    },
    components: { vImg, vModal, CrossLine, VueCropper },
    computed: {
        ...mapGetters([
            "currentRoomUuid",
            "currentRoomName",
            "currentRoomType",
            "currentRoomSaveAction",
            "userInfo"
        ])
    },
    created() {
        this.init()
    },
    mounted() {
    },
    methods: {
        init() {
            //console.log("333333", this.currentRoomUuid)
            userRoomRelationGetByRoomUuid({ room_uuid: this.currentRoomUuid }).then(res => {
                console.log(res)
                if (!res.data.room) {
                    this.status = false;
                    return;
                }
                this.list = res.data.list.reverse()
                const title = document.getElementsByClassName('yd-navbar-center-title')
                title[0].innerHTML = `房间详情(${this.list.length})`
                console.log("this.list ",this.list)
                this.list.forEach(item=>{
                    if(this.userInfo.id == item.users.id) {
                        this.selectType = item.type 
                    }
                })
                if (res.data.room.is_alert) {
                    this.alert = true
                } else {
                    this.alert = false
                }
                if (res.data.room.save_action) {
                    this.save_action = true
                } else {
                    this.save_action = false
                }
            })
        },
        bindFile(name) {
            let btn = document.getElementById(name);
            btn.click();
        },
        bindImg() {
            let file = event.target.files[0];
            if (file.type.indexOf("image/") == -1) {
                Alert({ mes: "请上传图片!" });
                return;
            }
            lrz(file,{width:1080})
            .then( (rst) =>{
                // 处理成功会执行
                if(rst.filelen > 204800){
                    Alert({mes: "上传图片不能大于2M"})
                }else{
                    this.option.img = rst.base64;
                    this.cropperShow = true;
                }
                console.log(rst)
                
            }).catch(function (err) {
                // 处理失败会执行
                Toast({
                    mes: err,
                    icon: 'error',
                    timeout: 1500
                })
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
        },
        confirmCropper() {
            this.$refs.cropper_image.getCropData(data => {
                //console.log( process.env)
                this.option.img = data;
                Loading.open('正在上传...')
                uploadBase64({ imgDatas: this.option.img})
                .then(async res => {
                    Loading.close()
                    await roomChangeImage({ image:import.meta.env.VUE_APP_CLIENT_SOCKET+res.data.path, room_uuid: this.currentRoomUuid })
                    Toast({ mes: "房间图片修改成功" })
                })
                this.cropperShow = false;
            });
        },
        onShow: function () {
            this.isHide = false; //点击onShow切换为false，显示为展开画面
        },
        onHide: function () {
            this.isHide = true; //点击onHide切换为true，显示为折叠画面
        },
        /* handleDelRoom(){      
            setTimeout(()=>{
                roomDel({room_uuid:this.currentRoomUuid}).then(res=>{
                    Alert({
                        'mes':'删除并退出成功',
                        callback:()=>{
                            this.$router.push({name:'home'})
                        }
                    })
                }) 
            },500)    
        }, */
        handleGoPersonInfo(item) {
            console.log(item)
            this.$router.push({ name: 'personInfo', query: { item } })
        },
        handleChangeRoomName() {
            Confirm({
                title: '修改房间名称',
                mes: `<input type="text" placeholder="请输入房间名称" id="room-name-input" style="margin-left: 50%;
    width: 180px;
    position: relative;
    left: -90px;
    margin-top: 12px;
    border: none;
    border-bottom: 1px solid #45BAF4;
    padding-bottom: 6px;">`,
                opts: [
                    {
                        txt: '取消',
                    },
                    {
                        txt: '确定',
                        callback: async () => {
                            const roomName = document.getElementById('room-name-input').value;
                            document.getElementById('room-name-input').value = ''

                            if (roomName !== '') {
                                await roomNameChange({ room_name: roomName, room_uuid: this.currentRoomUuid })
                                this.$store.dispatch("updateCurrentRoomName", roomName)
                                Toast({ mes: "房间名称修改成功" })
                                return true;
                            } else {
                                this.$dialog.notify({ mes: '请输入房间名称', timeout: 5000 });
                                return false;
                            }
                        }
                    }
                ]
            })
        },
        handleDelRoom() {
            Confirm({
                title: '提示',
                mes: '删除房间，确认删除？',
                opts: [
                    {
                        txt: '取消',
                        color: false,
                        callback: () => {
                        }
                    },
                    {
                        txt: '确定',
                        color: true,
                        callback: () => {
                            roomDel({ room_uuid: this.currentRoomUuid }).then(res => {
                                Alert({
                                    'mes': '删除并退出成功',
                                    callback: () => {
                                        this.$router.push({ name: 'home' })
                                    }
                                })
                            })
                        }
                    }
                ]
            });
        },
        handleDelRoomMsg() {
            Confirm({
                title: '提示',
                mes: '只能删除本地记录，确认删除？',
                opts: [
                    {
                        txt: '取消',
                        color: false,
                        callback: () => {
                        }
                    },
                    {
                        txt: '确定',
                        color: true,
                        callback: () => {
                            if (this.currentRoomSaveAction == 0) {
                                delRoomMsg(this.currentRoomUuid).then(res => {
                                    Toast({ 'mes': '删除成功' })
                                })
                            }/* else if(this.currentRoomSaveAction == 1){
                                roomMsgDel({room_uuid:this.currentRoomUuid}).then(res=>{
                                    Toast({'mes':'删除成功'})
                                })
                            } */
                        }
                    }
                ]
            });
        },
        handleAddCustomer() {
            this.$store.dispatch("updatePersonList", this.list)
            this.$router.push({ name: "groupChat", query: { room_uuid: this.currentRoomUuid, room_name: this.currentRoomName } });
        }
    },
    destroyed() {
    },
    beforeRouteLeave(to, from, next) {
        if (to.name == 'groupRoom') {
            joinChatSend({
                name: this.currentRoomName,
                room_uuid: this.currentRoomUuid,
                type: this.currentRoomType,
                save_action: this.currentRoomSaveAction
            })
        }
        next()
    },
    watch: {
        alert: {
            handler() {
                userRoomRelationUpdateAlert({ is_alert: this.alert, room_uuid: this.currentRoomUuid })
            }
        },
        save_action: {
            handler() {
                userRoomRelationUpdateSaveAction({ save_action: this.save_action, room_uuid: this.currentRoomUuid }).then(res => {
                    this.$store.commit('updateCurrentRoomSaveAction', this.save_action)
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import './scss/details.scss';
</style>
