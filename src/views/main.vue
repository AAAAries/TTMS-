<template>
  <div>
    <head-wrap></head-wrap>
    <div class="banner"></div>
    <div class="center-wrap">
      <div class="tab-movie-tit">
        <a class="current" @click="changeCurrent($event)">正在热映({{total}})</a>
        <a @click="changeCurrent($event)">即将上映</a>
        <span @click="gotoSmovie">查看更多></span>
      </div>
      <div class="tab-content">
        <div class="tab-movie-list">

          <div class="movie-card-wrap" v-for="movie in movieList" :key="movie.id" >
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
                <span class="bt-l">{{movie.title}}</span>
                <span class="bt-r">{{movie.score}}</span>
              </div>
            </a>
            <a v-if="movie.id" @click="gotoDetali(movie.id)" class="movie-bought">选座购票</a>
          </div>
        </div>
      </div>
    </div>
    <div class="process-wrap"></div>
    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name:'index',
  data(){
    return{
      movieList:[],
      total:0,
    }
  },
  components: {
    HeadWrap,
    FooterWrap,
  },
  created(){
    this.getMovieList()
  },
  methods: {
    changeCurrent(event) {
      if (event.target.tagName == "A") {
        for (let i of event.currentTarget.parentElement.childNodes) {
          i.classList.remove("current");
        }
        event.target.classList.add("current");
      }
    },
    //获取十个电影
    getMovieList(){
      this.$axios({
        url:"http://localhost:5500/index",
      }).then( res => {
        // console.log(res.data);
        this.movieList = res.data.movies
        // console.log(res.data.totalpage);
        this.total = res.data.totalpage[0].total
      }).catch( err => err)
    },

    //跳转到电影详情页面
    gotoSmovie(){
      this.$router.push({path:'/smovie'})
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
.process-wrap {
  display: block;
  width: 100%;
  height: 88px;
  background: url(//img.alicdn.com/tps/i2/TB1Qf3_FVXXXXacXFXXnZ6pJVXX-990-88.png)
    center center no-repeat #f4f4f4;
}
.banner {
  width: 100%;
  height: 360px;
  background-image: url("../assets/img/back.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #37374f;
}
.center-wrap {
  width: 70%;
  /* height: 400px; */
  margin: 0 auto;
}

.center-wrap .tab-movie-tit {
  height: 60px;
  width: 100%;
  border-bottom: 1px #e5e5e5 solid;
  margin-bottom: 10px;
}
.center-wrap .tab-movie-tit a {
  display: inline-block;
  color: #3e3e3e;
  margin-top: 32px;
  margin-right: 25px;
  font-size: 20px;
  font-weight: 500;
}
.center-wrap .tab-movie-tit a:hover {
  cursor: pointer;
}
.center-wrap .tab-movie-tit .current {
  color: rgb(136, 9, 9);
  border-bottom: 2px solid rgb(136, 9, 9);
}
.center-wrap .tab-movie-tit span {
  float: right;
  margin-top: 32px;
  color: rgb(136, 9, 9);
  font-size: 14px;
  cursor: pointer;
}
.center-wrap .tab-content {
  margin-top: 15px;
}
.movie-card-wrap {
  display: inline-block;
  width: 20%;
  height: 270px;
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
.movie-card-wrap .movie-bought{
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

</style>