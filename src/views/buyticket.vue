<template>
  <div>
    <head-wrap></head-wrap>

    <el-steps :space="300" :active="2" align-center>
      <el-step title="选择影片场次"></el-step>
      <el-step title="选择座位"></el-step>
      <el-step title="14分钟内付款"></el-step>
      <el-step title="影院取票观影"></el-step>
    </el-steps>
    <div class="center-seat-wrap">
      <div class="center-left">
        <div class="seat-example">
          <div class="selectable-example example">
            <span>可选座位</span>
          </div>
          <div class="sold-example example">
            <span>已售座位</span>
          </div>
          <div class="selected-example example">
            <span>已选座位</span>
          </div>
          <div class="couple-example example">
            <span>情侣座位</span>
          </div>
        </div>
        <div class="screen">荧幕中央</div>
        <div class="main-seat">
          <div class="setChoice">
            <ul class="line" v-for="(item, row) in seats" :key="row">
              <li>{{ row + 1 }}</li>
            </ul>
          </div>

          <div class="seat-pic">
            <!-- eslint-disable-next-line -->
            <div class="row" v-for="(item, row) in seats" :key="row">
              <!-- eslint-disable-next-line -->
              <span v-for="(index, col) in item" :key="col">
                <img
                  id="seat"
                  :src="show(index)"
                  @click="choose(row, col, index, $event)"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="center-right">
        <div class="side">
          <div class="movie-info clearfix">
            <div class="poster">
              <img :src="scheduleInFo.cover" />
            </div>
            <div class="content">
              <p class="name text-ellipsis">{{ scheduleInFo.movie }}</p>
              <div class="info-item">
                <span>类型 :</span>
                <span class="value">{{ scheduleInFo.type }}</span>
              </div>
              <div class="info-item">
                <span>时长 :</span>
                <span class="value">{{ scheduleInFo.length }}</span>
              </div>
            </div>
          </div>

          <div class="show-info">
            <div class="info-item">
              <span>影院 :</span>
              <span class="value text-ellipsis">汉唐影院</span>
            </div>
            <div class="info-item">
              <span>影厅 :</span>
              <span class="value text-ellipsis">{{ scheduleInFo.studio }}</span>
            </div>
            <div class="info-item">
              <span>版本 :</span>
              <span class="value text-ellipsis">{{
                scheduleInFo.language
              }}</span>
            </div>
            <div class="info-item">
              <span>场次 :</span>
              <span class="value text-ellipsis screen"
                >{{ scheduleInFo.schedule_day }}
                {{ scheduleInFo.schedule_time }}</span
              >
            </div>
            <div class="info-item">
              <span>票价 :</span>
              <span class="value text-ellipsis"
                >￥{{ scheduleInFo.price }}/张</span
              >
            </div>
          </div>

          <div class="ticket-info">
            <div class="no-ticket" v-if="this.tickets.length == 0">
              <p class="buy-limit">座位：一次最多选4个座位</p>
              <p class="no-selected">请<span>点击左侧</span>座位图选择座位</p>
            </div>
            <div class="has-ticket" v-if="!this.tickets.length == 0">
              <span class="text">座位：</span>
              <div class="ticket-container">
                <span
                  class="ticket"
                  v-for="(item, index) in tickets"
                  :key="index"
                  >{{ item[0] + 1 }}排{{ item[1] + 1 }}座</span
                >
              </div>
            </div>

            <div class="total-price">
              <span>总价 :</span>
              <span class="price">{{ totalPrice }}</span>
            </div>
          </div>

          <div class="login">
            <!-- <input type="text" placeholder="请输入手机号" v-if="isShow" />
            <input type="password" placeholder="请输入密码" v-if="isShow" />
            <div class="cellphone" v-if="!isShow">
              <span>手机号 :</span>
              <span class="phone-num">{{ showPhone }}</span>
            </div>
            <button @click="locking()">确认选座</button> -->
            <div v-if="isShow">
              <input autocomplete="off" type="text" id="tltel" placeholder="请输入手机号" />
              <input type="password" id="tlpwd" placeholder="请输入密码" />
              <button @click="Tlogin()">确认选座</button>
            </div>
            <div v-if="!isShow">
              <div class="cellphone">
                <span>手机号 :</span>
                <span class="phone-num">{{ showPhone }}</span>
              </div>
              <button @click="locking()">确认选座</button>
            </div>
          </div>
        </div>
      </div>
      <div id="clear"></div>
    </div>
    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name: "buyticket",
  components: {
    HeadWrap,
    FooterWrap,
  },
  data() {
    return {
      seats: [],
      imgobj: {
        0: " ../assets/img/S1.png",
        //没有不可选的图像
        "-1": "../assets/img/S1.png",
        "-2": "",
      },
      tickets: [],
      //是否登录
      isShow: true,
      scheduleInFo: {},
    };
  },
  created() {
    this.getSeat();
    this.changeIsShow();
    this.getScheduleInFo();
  },
  computed: {
    show: function () {
      return function (index) {
        // switch(index){
        //   case '0':
        //     return require("../assets/img/S1.png");
        //   case '-1':
        //     return require("../assets/img/S1.png");
        //   case '-2':
        //     return ""
        //   case '1':
        //     return require("../assets/img/S3.png");
        //   default:
        //     return require("../assets/img/S2.png");
        // }
        if (index == "0") return require("../assets/img/S1.png");
        if (index == "-1") return require("../assets/img/S1.png");
        if (index == "-2") return "";
        if (index == "1") return require("../assets/img/S3.png");
        return require("../assets/img/S2.png");
      };
    },
    //手机号显示
    showPhone: function () {
      let tel = this.$store.state.tel;
      // console.log(this.$store.state.tel);.splice(3, 4, "****")
      // return this.$store.state.tel
      return tel.substring(0, 3) + "****" + tel.substring(7);
    },
    //总价
    totalPrice: function () {
      let price = this.scheduleInFo.price;
      let num = this.tickets.length;
      return price * num;
    },
  },
  methods: {
    //获取座位表
    //0:可选座位
    //正数:哪位顾客买的  id填入
    //-1:座位是损坏的 才不能选
    //-2:没有安排座位
    getSeat() {
      this.$axios({
        url: "http://localhost:5500/seats",
        params: {
          scheduleid: this.$route.query.schedule,
          movieid: this.$route.query.movie,
        },
      })
        .then((req) => {
          // console.log(req.data);
          this.seats = JSON.parse(req.data);
        })
        .catch((err) => err);
    },

    //选票
    choose(row, col, index, event) {
      // row = row + 1;
      // col = col + 1;
      if (index == "0") {
        if (this.tickets.length >= 4) {
          alert("最多选四张票！");
          return;
        }
        index = "1";
        this.seats[row].splice(col, 1, index);
        this.tickets.push([row, col]);
        // console.log(this.tickets);
      } else if (index == "1") {
        index = "0";
        this.seats[row].splice(col, 1, index);
        for (let i = 0; i < this.tickets.length; i++) {
          if (this.tickets[i][0] === row && this.tickets[i][1] === col) {
            this.tickets.splice(i, 1);
            i--;
          }
        }
        // console.log(this.tickets);
      }
    },
    //改变是否登录
    changeIsShow() {
      // console.log(this.$store.state.tel);
      if (this.$store.state.tel == "") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },

    //获取影片信息
    getScheduleInFo() {
      this.$axios({
        url: "http://localhost:5500/Tschedule",
        params: {
          scheduleid: this.$route.query.schedule,
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.scheduleInFo = res.data;
        })
        .catch((err) => err);
    },
    //座位加锁  跳转到新的页面
    locking() {
      if (this.tickets.length == 0) {
        this.$message.error("请至少选择一个座位!");
        return;
      }
      //在vuex中存储票的信息
      this.$store.commit("updatetickets", this.tickets);
      // 跳转页面
      this.$router.push({
        path: "/order",
        query: { schedule: this.$route.query.schedule },
      });
    },
    //登录进去
    Tlogin() {
      let tltel = document.getElementById("tltel").value;
      let tlpwd = document.getElementById("tlpwd").value;
      let obj = { ltel: tltel, lpwd: tlpwd };
      // console.log(obj);
      this.$axios({
        method: "get",
        url: "http://localhost:5500/clogin",
        params: obj,
      })
        .then((res) => {
          // console.log(res.data.state);
          if (res.data.state == 1) {
            //将登录状态储存在cookies中
            this.$store.commit("addtel", res.data.tel);
            if (this.tickets.length == 0) {
              this.$message.error("请至少选择一个座位!");
              return;
            }
            //在vuex中存储票的信息
            this.$store.commit("updatetickets", this.tickets);
            this.$router.push({
              path: "/order",
              query: { schedule: this.$route.query.schedule },
            });
          }
          if (res.data.state == 0) {
            this.$message.error("用户不存在 请重新输入");
            document.getElementById("tltel").value = "";
            document.getElementById("tlpwd").value = "";
          }
          if (res.data.state == -1) {
            this.$message.error("密码错误 请重新输入");
            document.getElementById("tlpwd").value = "";
          }
          if (res.data.state == 2) {
            this.$message.error("用户已被封号");
            document.getElementById("tltel").value = "";
            document.getElementById("tlpwd").value = "";
          }
        })
        .catch((err) => err);
    },
  },
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}
.el-steps {
  width: 70%;
  margin: 30px auto;
}

.el-steps .el-step .el-step__head.is-finish {
  color: rgba(136, 9, 9, 0.7) !important;
  border-color: rgba(136, 9, 9, 0.7) !important;
}
.el-steps .el-step .el-step__title.is-finish {
  color: rgba(136, 9, 9, 0.7) !important;
}

.center-seat-wrap {
  width: 78%;
  height: 100%;
  border: 2px solid rgba(226, 226, 226, 0.979);
  margin: 20px auto;
  margin-bottom: 40px;
}
.center-left {
  float: left;
  width: 70%;
  /* background-color: aquamarine; */
}

.center-left .seat-example {
  margin: 30px 0 30px 118px;
}
.center-left .seat-example .example {
  display: inline-block;
  font-size: 16px;
  color: #666;
  height: 26px;
  line-height: 26px;
  padding-left: 38px;
  background-repeat: no-repeat;
  margin-right: 50px;
}
.center-left .seat-example .example span {
  font-size: 16px;
  color: #666;
}
.center-left .seat-example .selectable-example {
  background-image: url("../assets/img/S1.png");
}
.center-left .seat-example .sold-example {
  background-image: url("../assets/img/S2.png");
}
.center-left .seat-example .selected-example {
  background-image: url("../assets/img/S3.png");
}
.center-left .seat-example .couple-example {
  background-image: url("../assets/img/S4.png");
}
.center-left .seat-example .couple-example span {
  padding-left: 40px;
}
.center-left .screen {
  font-size: 20px;
  color: #666;
  width: 100px;
  text-align: center;
  margin: 10px auto;
}
.center-left .main-seat {
  margin-bottom: 40px;
  position: relative;
  margin: 0 auto;
}
.center-left .setChoice {
  width: 20px;
  position: relative;
  margin-left: 40px;
}
.center-left .setChoice .line {
  color: #666;
}
.center-left .setChoice .line li {
  display: block;
  height: 30px;
  text-align: center;
  line-height: 26px;
  /* margin-top: 5px; */
  padding-top: 5px;
}

.center-left .seat-pic {
  position: absolute;
  top: 0;
  left: 150px;
}
.center-left .seat-pic div {
  margin-top: 5px;
}
.center-left .seat-pic span {
  width: 30px;
  height: 26px;
  display: inline-block;
}

.center-right {
  /* position: relative;
  right: 0; */
  display: block;
  float: right;
  width: 30%;
}

.side {
  box-sizing: border-box;
  width: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  display: inline-block;
}

.side .movie-info .poster img {
  width: 115px;
  height: 158px;
  border: 2px solid #fff;
  float: left;
}
.poster:after {
  clear: both;
}
.side .movie-info .content {
  margin-left: 140px;
}
.side .movie-info .content .name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 14px;
}
.side .info-item {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.side .info-item span {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.side .info-item .value span {
  color: #151515;
  margin-left: 2px;
}
.clearfix:after {
  clear: both;
}
.clearfix:after,
.clearfix:before {
  content: " ";
  display: table;
}
.side .show-info {
  margin-top: 20px;
}
.side .show-info .info-item {
  margin-bottom: 9px;
}
.side .ticket-info {
  padding: 20px 0 10px;
  border-top: 1px dashed #e5e5e5;
  border-bottom: 1px dashed #e5e5e5;
}
.side .ticket-info .buy-limit {
  font-size: 14px;
  color: #999;
  margin: 0;
}
.side .ticket-info .no-selected {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin: 28px 0 39px;
}
.side .ticket-info .no-selected span {
  font-size: 14px;
  color: #f03d37;
}
.side .ticket-info .text {
  font-size: 14px;
  color: #999;
  float: left;
}
.side .ticket-info .ticket-container {
  margin-left: 42px;
  margin-bottom: 20px;
  position: relative;
  top: -5px;
}
.side .ticket-info .total-price {
  font-size: 14px;
  color: #333;
}
.side .ticket-info .total-price span {
  font-size: 14px;
  color: #333;
}
.side .ticket-info .total-price .price {
  color: #f03d37;
  font-size: 24px;
}
.login {
  margin: 30px;
}
.login input {
  display: block;
  width: 230px;
  height: 35px;
  border-radius: 15px;
  outline: none;
  padding-left: 15px;
  border: 1px solid #999;
  margin: 10px 0px;
  font-size: 18px;
}
.login button {
  display: block;
  width: 250px;
  height: 35px;
  border-radius: 15px;
  border: 1px solid #999;
  background-color: #999;
  color: white;
  line-height: 35px;
}
.login button:hover {
  background-color: rgba(136, 9, 9, 0.7);
}
.login .cellphone {
  margin-bottom: 20px;
}
.side .ticket-info .ticket-container {
  margin-left: 42px;
  margin-bottom: 20px;
  position: relative;
  top: -5px;
}
.side .ticket-info .ticket {
  cursor: default;
  position: relative;
  font-size: 12px;
  color: #f03d37;
  display: inline-block;
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 12px 10px 0;
}

.login .cellphone span {
  color: #000;
  font-size: 16px;
}
.show-info .info-item span {
  color: #000;
}
.show-info .info-item .value {
  color: #666;
}
.center-left .setChoice .line li {
  display: block;
  height: 30px;
  text-align: center;
  line-height: 26px;
  padding-top: 5px;
}
#clear {
  clear: both;
}
</style>

<style>
.el-step__head.is-finish {
    color: rgb(136, 9, 9);
    border-color: rgb(136, 9, 9);
}
.el-step__title.is-finish {
    color: rgb(136, 9, 9);
}
</style>