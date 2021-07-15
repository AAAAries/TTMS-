<template>
  <div>
    <head-wrap></head-wrap>
    <div class="middle">
      <div class="left">
        <el-menu
          :default-active="activePath"
          :router="true"
          background-color="#f4f3f4"
        >
          <div class="menu-title">个人中心</div>
          <el-menu-item index="/user/myorder">
            <span slot="title">我的订单</span>
          </el-menu-item>
          <el-menu-item index="/user/personal">
            <span slot="title">基本信息</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
      <div id="clear"></div>
    </div>
    <footer-wrap> </footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name: "user",
  components: {
    HeadWrap,
    FooterWrap,
  },
  data() {
    return {
      activePath:"/message/play"
    };
  },
  created(){
    this.activePath = this.$route.path
  },
  methods: {},
};
</script>

<style scoped>
.middle {
  width: 75%;
  margin: 35px auto;
  border: 2px solid #ccc;
  margin-bottom: 80px;
}
.middle .left {
  float: left;
  width: 20%;
}
.middle .right {
  float: right;
  width: 80%;
}
.el-menu .menu-title {
  text-align: center;
  font-size: 26px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin-top: 40px;
  margin-bottom: 10px;
  color: rgb(136, 9, 9);
}
.el-menu-item span{
  color: black;
  font-size: 16px;
}
.el-menu-item {
  text-align: center;
  font-size: 18px;
}
.is-active {
  display: block;
  background-color: rgb(136, 9, 9) !important;
  color: white;
}
.is-active span{
  color: white;
}
#clear {
  clear: both;
}
</style>