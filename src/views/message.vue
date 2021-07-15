<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>TTMS后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="toggle-button">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :default-active = "activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :router="true"
        >
          <el-menu-item index="/message/play" @click="saveNavState('/message/play')">
            <template slot="title">
              <i class="el-icon-camera-solid"></i>
              <span>剧目管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/message/screens" @click="saveNavState('/message/screens')">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>影厅管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/message/plan" @click="saveNavState('/message/plan')">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>演出计划管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/message/staff" @click="saveNavState('/message/staff')">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>员工管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/message/customer" @click="saveNavState('/message/customer')">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>顾客管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/message/count" @click="saveNavState('/message/count')">
            <template slot="title">
              <i class="el-icon-data-line"></i>
              <span>报表统计</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
  
<script>
export default {
  name: "message",
  data() {
    return {
      activePath:"/message/play"
    };
  },
  created(){
    // this.activePath = window.sessionStorage.getItem("activePath")
    // console.log(this.activePath);
    window.sessionStorage.setItem("activePath",this.$route.path )
  },
  methods(){
    window.sessionStorage.setItem("activePath",this.$route.path )
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    //退出登录
    logout() {
      window.localStorage.clear();
      this.$router.push("/").catch(() => {});
    },
    //保存连接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      if(activePath == '/message/staff'){
        window.sessionStorage.setItem("activePath",this.$route.path )
      }
    }
  },
};
</script>

<style>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
}
.el-aside {
  background-color: #333744;
  
}

.el-main {
  background-color: #eaedf1;
}
.el-aside .toggle-button{
  background-color: #4A5064;
  color: #fff;
  height: 30px;
  line-height: 30px;
  text-align: center;
  
}
</style>

