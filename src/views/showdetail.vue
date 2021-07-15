<template>
  <div>
    <head-wrap></head-wrap>
    <div class="detail-cont">
      <div class="center-wrap">
        <h3 class="cont-title">
          {{ MovieInfo.title }}
          <em class="score">{{ MovieInfo.score }}</em>
        </h3>
        <div class="cont-pic">
          <img with="230" heigh="300" :src="MovieInfo.cover" alt="" />
        </div>
        <ul class="cont-info">
          <li>导演：{{ MovieInfo.direct }}</li>
          <li>主演：{{ MovieInfo.actor }}</li>
          <li>类型：{{ MovieInfo.type }}</li>
          <li>制片国家/地区：{{ MovieInfo.area }}</li>
          <li>片长：{{ MovieInfo.filmlen }}</li>
          <li class="J_shrink shrink">
            剧情介绍： {{ MovieInfo.introduction }}
          </li>
        </ul>
        <div class="cont-time">上映时间：{{ MovieInfo.date }}</div>
      </div>
    </div>

    <div class="show-list">
      <div class="title-wrap">
        <div class="center-wrap">
          <h3>选座购票</h3>
        </div>
      </div>

      <div class="show-date">
        <span>观影时间 :</span>
        <span class="date-item current" @click="showToday($event)">今天</span>
        <span class="date-item" @click="showTomorrow($event)">明天</span>
      </div>

      <!-- 演出计划列表 -->
      <el-table :data="scheduleList" stripe>
        <el-table-column label="放映时间" prop="time">
          <!-- <template slot-scope="scope">
            {{getMovie(scope.row.movie_id)}}
          </template> -->
        </el-table-column>
        <el-table-column label="电影时长" prop="length"></el-table-column>
        <el-table-column label="语言版本" prop="language"></el-table-column>
        <el-table-column label="放映厅" prop="studio"></el-table-column>
        <el-table-column
          label="票价"
          prop="price"
          width="100px"
        ></el-table-column>
        <el-table-column label="选座购票">
          <template v-slot:default="scope">
            <!-- scope.row.schedule_id -->
            <el-button type="danger" round @click="gotoTicket(scope.row.id)">选座购票</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name: "showdetail",
  components: {
    HeadWrap,
    FooterWrap,
  },
  data() {
    return {
      MovieInfo: {},
      scheduleList: [],
    };
  },
  created() {
    this.getInfoById();
  },
  mounted() {
    this.changetitle();
    this.showToday();
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
    //通过传过来的id获取影片信息
    getInfoById() {
      let id = this.$route.query.id;
      // console.log(id);
      this.$axios({
        url: "http://localhost:5500/mdetail/" + id,
      })
        .then((res) => {
          // console.log(res.data);
          this.MovieInfo = res.data;
          // console.log(this.MovieInfo);
        })
        .catch((err) => err);
    },

    //获取系统时间
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    //获取明天时间
    getTomFormatDate() {
      let date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    //根据日期查询放映计划
    showToday(event) {
      let id = this.$route.query.id;
      if (event) {
        for (let i of event.currentTarget.parentElement.childNodes) {
          i.classList.remove("current");
        }
        event.target.classList.add("current");
      }
      let time = this.getNowFormatDate();
      // console.log(time);
      this.$axios({
        url: "http://localhost:5500/sdetail/" + id,
        params: { time: time },
      })
        .then((res) => {
          // console.log(res.data);
          this.scheduleList = res.data;
        })
        .catch((err) => err);
    },
    showTomorrow(event) {
      let id = this.$route.query.id;
      for (let i of event.currentTarget.parentElement.childNodes) {
        i.classList.remove("current");
      }
      event.target.classList.add("current");
      let time = this.getTomFormatDate();
      // console.log(time);
      this.$axios({
        url: "http://localhost:5500/sdetail/" + id,
        params: { time: time },
      })
        .then((res) => {
          // console.log(res.data);
          this.scheduleList = res.data;
        })
        .catch((err) => err);
    },
    //跳转到购票页面
    gotoTicket(id){
      this.$router.push({ path:'/buyticket' ,query:{schedule:id,movie:this.$route.query.id}})
    }
  },
};
</script>

<style scoped>
ul,
li {
  list-style-type: none;
}
a {
  text-decoration: none;
}
.detail-cont {
  width: 100%;
  padding-top: 10px;
  color: #fff;
  background-color: rgb(185, 185, 185);
  padding-bottom: 30px;
}
.center-wrap {
  width: 990px;
  min-width: 990px;
  margin: 0 auto;
}
.detail-cont .cont-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  border-bottom: 1px solid #7a7a7a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 16px;
}
.detail-cont .cont-pic {
  /* display: inline-block; */
  float: left;
  width: 225px;
}
.detail-cont .cont-info {
  float: left;
  width: 590px;
  font-size: 14px;
}
.detail-cont .cont-info li {
  width: 100%;
  padding-bottom: 12px;
  display: inline-block;
}
.detail-cont .cont-time {
  float: right;
  width: 156px;
  height: 22px;
  text-align: right;
  line-height: 22px;
  font-size: 14px;
}
.center-wrap:after {
  content: "\0020";
  display: block;
  height: 0;
  clear: both;
}
.show-list {
  width: 990px;
  margin: 0 auto;
  margin-bottom: 20px;
}
.title-wrap {
  width: 100%;
  margin-top: 20px;
}
.center-wrap {
  width: 990px;
  min-width: 990px;
  margin: 0 auto;
}
.title-wrap h3 {
  display: inline-block;
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 20px;
  border-bottom: 1px solid #e5e5e5;
}
.center-wrap:after {
  display: block;
  height: 0;
  clear: both;
}
.show-list .show-date {
  margin: 10px 0;
  color: #7a7a7a;
}
.show-list .show-date span{
  color: #7a7a7a;
  margin: 0 10px;
  line-height: 20px;
}
.show-list .show-date .date-item {
  display: inline-block;
  /* background-color: rgba(136, 9, 9, 0.7); */
  width: 60px;
  height: 20px;
  margin: 0 10px;
  line-height: 20px;
  text-align: center;
  /* border-radius: 15px;
  color: #fff; */
}
.show-list .show-date .date-item:hover {
  cursor: pointer;
}
.show-list .show-date .current {
  background-color: rgba(136, 9, 9, 0.7);
  border-radius: 15px;
  color: #fff;
}
</style>