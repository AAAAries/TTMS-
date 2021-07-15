<template>
  <div>
    <head-wrap></head-wrap>
    <div class="center">
      <el-breadcrumb class="Breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>影片</el-breadcrumb-item>
        <el-breadcrumb-item>西安</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="notice">
        <span class="notice-item"
          >3步轻松购票:1.选座购票/买券2.收电子码3.影院取票</span
        >
      </div>
      <div class="center-movie-cinema">
        <div class="movie-list">
          <div class="tab-movie-tit">
            <a class="current" @click="changeCurrent($event)">正在热映</a>
            <a @click="changeCurrent($event)">即将上映</a>
          </div>
          <div class="tab-content">
            <div class="tab-movie-list">
              <div
                class="movie-card-wrap"
                v-for="movie in movieList"
                :key="movie.id"
              >
                <a href="#" class="movie-card">
                  <div class="movie-card-poster">
                    <img
                      width="160"
                      height="224"
                      :data-src="movie.cover"
                      :src="movie.cover"
                    />
                  </div>
                  <div class="movie-card-name">
                    <span class="bt-l">{{ movie.title }}</span>
                    <span class="bt-r">{{ movie.score }}</span>
                  </div>
                </a>
                <a v-if="movie.id" @click="gotoDetali(movie.id)" class="movie-bought">选座购票</a>
              </div>
            </div>
          </div>
        </div>
        <div class="cinema-list">
          <div class="tab-cinema-tit">
            <span>热门影院</span>
            <a href="#">查看全部影院></a>
          </div>
          <div class="cinema-item">
            <span class="name">奥斯卡国际影城城南新天地店</span>
            <span class="address"
              >西安市长安区西长安街和府东一路口交叉东南角</span
            >
            <span class="buynow"><a>选座购票</a></span>
          </div>
        </div>
      </div>
    </div>

    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name: "smovie",
  components: {
    HeadWrap,
    FooterWrap,
  },
  data() {
    return {
      movieList: [],
    };
  },
  created() {
    this.getMovieList();
  },
  mounted() {
    this.changetitle();
  },
  methods: {
    changetitle() {
      let change = document.getElementById("change");
      for (let i of change.childNodes) {
        i.classList.remove("current");
        if (i.childNodes[0].innerText == "影片") {
          i.classList.add("current");
        }
      }
    },
    changeCurrent(event) {
      if (event.target.tagName == "A") {
        for (let i of event.currentTarget.parentElement.childNodes) {
          i.classList.remove("current");
        }
        event.target.classList.add("current");
      }
    },
    //获取所有电影
    getMovieList() {
      this.$axios({
        url: "http://localhost:5500/smovie",
      })
        .then((res) => {
          // console.log(res.data);
          this.movieList = res.data;
        })
        .catch((err) => err);
    },
    //根据id跳转详情页面
    gotoDetali(id){
      // console.log(id);
      this.$router.push({ path:'/showdetail' ,query:{id:id}})
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.center {
  width: 70%;
  margin: 0 auto;
}
.Breadcrumb {
  width: 100%;
  margin: 15px auto;
  padding: 15px 0px;
}
.notice {
  font-size: 12px;
  color: #c4c4c4;
  position: relative;
}
.notice .notice-item {
  position: absolute;
  top: -43px;
  left: 74%;
}
.center-movie-cinema {
  position: relative;
}
.movie-list {
  box-sizing: border-box;
  width: 65%;
  border: 1px solid #e7e7e7;
}
.movie-list .tab-movie-tit {
  margin: 0 30px;
  font-size: 16px;
  border-bottom: 1px solid #e7e7e7;
  color: #6e6e6e;
}
.movie-list .tab-movie-tit a {
  display: inline-block;
  color: #3e3e3e;
  margin-top: 32px;
  margin-right: 25px;
}
.movie-list .tab-movie-tit a:hover {
  cursor: pointer;
}
.movie-list .tab-movie-tit .current {
  color: rgb(136, 9, 9);
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(136, 9, 9);
}

.tab-content {
  margin-top: 15px;
  width: 100%;
  margin: 0 auto;
}
.movie-card-wrap {
  display: inline-block;
  width: 25%;
  height: 270px;
  margin-left: 40px;
  margin-top: 10px;
}
.movie-card .movie-card-name {
  width: 160px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
  top: -34px;
  font-size: 14px;
  line-height: 35px;
}
.movie-card .movie-card-name .bt-r {
  float: right;
  width: 20%;
}
.movie-card .movie-card-name .bt-l {
  float: left;
  width: 70%;
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.movie-card-wrap .movie-bought {
  display: inline-block;
  width: 160px;
  height: 40px;
  color: white;
  background-color: rgb(136, 9, 9);
  position: relative;
  top: -40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
}

.cinema-list {
  box-sizing: border-box;
  width: 35%;
  /* height: 200px; */
  border: 1px solid #e7e7e7;
  position: absolute;
  top: 0;
  left: 65%;
  background-color: #fcfbfb;
}
.cinema-list .tab-cinema-tit {
  position: relative;
  font-size: 16px;
  margin: 0 30px;
  padding-bottom: 9px;
  border-bottom: 1px solid #e7e7e7;
}
.cinema-list .tab-cinema-tit span {
  display: inline-block;
  margin-top: 32px;
  margin-right: 25px;
  font-weight: 600;
  color: black;
}
.cinema-list .tab-cinema-tit a {
  font-size: 12px;
  color: rgb(136, 9, 9);
  position: absolute;
  top: 35px;
  right: 0px;
}
.cinema-list .cinema-item {
  position: relative;
  width: 90%;
  margin: 20px auto;
}
.cinema-item .name {
  display: block;
  font-size: 16px;
  color: #6e6e6e;
  margin: 10px 0;
}
.cinema-item .address {
  display: block;
  font-size: 14px;
  color: #6e6e6e;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cinema-item .buynow {
  display: block;
  width: 60px;
  height: 30px;
  background-color: rgb(136, 9, 9);
  position: absolute;
  top: 0px;
  right: 15px;
}
.cinema-item .buynow a {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: white;
  line-height: 30px;
  font-size: 12px;
}
</style>