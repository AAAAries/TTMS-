<template>
  <div class="head-wrap">
    <div class="center-wrap">
      <h1 class="logo">
        <img src="../../assets/img/logo.png" alt="" />
      </h1>
      <div class="city">
        <a href="">西安</a>
      </div>
      <div class="nav-wrap">
        <ul class="nav" id="change">
          <li
            @click="
              gotoIndex();
              showBorder($event);
            "
            class="nav-item current"
          >
            <a href="#">首页</a>
          </li>
          <li
            @click="
              gotoSmovie();
              showBorder($event);
            "
            class="nav-item"
          >
            <a href="#">影片</a>
          </li>
          <li @click="showBorder($event)" class="nav-item">
            <a href="#">影院</a>
          </li>
        </ul>
      </div>
      <div class="entrance-wrap">
        <ul class="entrance">
          <li class="entrance-item" v-if="isShow">
            <a style="cursor: pointer" @click="gotoLogin"
              ><span class="iconfont icon-shouji"></span>登录注册</a
            >
          </li>
          <li class="entrance-item" v-if="!isShow">
            <a style="cursor: pointer" @click="gotoUser"
              ><span></span>我的</a
            >
          </li>
          <li class="entrance-item">
            <a href="#"
              ><span class="iconfont icon-wang_light"></span>客服咨询</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadWrap",
  data() {
    return {
      isShow:true
    };
  },
  mounted(){
    this.changeIsShow()
  },
  methods: {
    showBorder(event) {
      // console.log(event.target.tagName);
      if (event.target.tagName == "LI") {
        // console.log(event.currentTarget.parentElement.childNodes);
        for (let i of event.currentTarget.parentElement.childNodes) {
          i.classList.remove("current");
        }
        event.target.classList.add("current");
      }
    },
    //跳转到电影详情页面
    gotoSmovie() {
      this.$router.push({ path: "/smovie" });
    },
    //跳到首页
    gotoIndex() {
      this.$router.push({ path: "/" });
    },
    //跳转到登录页面
    gotoLogin() {
      this.$router.push({ path: "/login" });
    },
    //跳转到我的页面
    gotoUser(){
      this.$router.push({ path: "/user" });
    },
    //改变是否显示我的
    changeIsShow(){
      if(this.$store.state.tel == ""){
        this.isShow = true
      }else{
        this.isShow = false
      }
    }
  },
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}
a {
  text-decoration: none;
  color: black;
}

.head-wrap {
  box-sizing: content-box;
  width: 100%;
  height: 72px;
  border-bottom: 2px solid #e7e7e7;
  padding: 10px 0;
}
.center-wrap {
  width: 70%;
  height: 100%;
  margin: 0 auto;
}
.head-wrap .center-wrap .logo img {
  height: 72px;
  float: left;
}
.head-wrap .center-wrap .city {
  float: left;
  height: 100%;

  margin: 0 10px;
}
.head-wrap .center-wrap .city a {
  line-height: 72px;
  font-size: 26px;
  font-weight: bold;
}
.head-wrap .center-wrap .nav-wrap {
  float: left;
  height: 41px;
  width: 230px;
}
.head-wrap .center-wrap .nav-wrap .nav {
  line-height: 41px;
  padding: 18px;
  display: flex;
  text-align: center;
}
.head-wrap .center-wrap .nav-wrap .nav-item {
  display: inline;
  padding: 0 14px;
  flex: 1;
}
.head-wrap .center-wrap .nav-wrap .nav-item a {
  font-size: 18px;
}
.head-wrap .center-wrap .entrance-wrap {
  float: right;
  height: 100%;
  width: 170px;
}
.head-wrap .center-wrap .entrance-wrap .entrance {
  line-height: 72px;
  display: flex;
  text-align: center;
}
.head-wrap .center-wrap .entrance-wrap .entrance a {
  font-size: 14px;
  color: rgb(150, 150, 150);
}
.head-wrap .center-wrap .entrance-wrap .entrance .entrance-item {
  display: inline;
  flex: 1;
}
.head-wrap .center-wrap .entrance-wrap .entrance .entrance-item span {
  color: rgb(150, 150, 150);
}
.current {
  border-bottom: 2.5px solid rgb(136, 9, 9);
}
.current a {
  color: rgb(136, 9, 9);
}
</style>