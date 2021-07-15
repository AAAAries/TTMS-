<template>
  <div>
    <head-wrap></head-wrap>
    <!-- {{ tickets }}
    {{ tickets[0] }} -->

    <!-- {{this.$route.query.tickets}} -->
    <el-steps :space="300" :active="3" align-center>
      <el-step title="选择影片场次"></el-step>
      <el-step title="选择座位"></el-step>
      <el-step title="14分钟内付款"></el-step>
      <el-step title="影院取票观影"></el-step>
    </el-steps>

    <div class="container">
      <div class="count-down-wrapper">
        <p class="time-left">
          请 在
          <span class="minute">{{ m }}</span>
          分钟
          <span class="second">{{ s }} </span>秒内
          <!-- <span class="minute">尽快</span> -->
          完成支付
        </p>
        <p class="tip">
          超时订单会自动取消，如遇支付问题，请致电汉唐客服：1010-5335
        </p>
      </div>

      <p class="warning">
        请仔细核对场次信息，出票后将<span class="attention"
          >无法退票和改签</span
        >
      </p>

      <table class="order-table">
        <thead>
          <tr>
            <th>影片</th>
            <th>时间</th>
            <th>影厅</th>
            <th>座位</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="movie-name">《{{ orderInfo.movie }}》</td>
            <td
              class="showtime"
              v-if="orderInfo.schedule_time && orderInfo.schedule_day"
            >
              {{ orderInfo.date }}
              {{ orderInfo.schedule_day.substring(5, 10) }}
              {{ orderInfo.schedule_time.substring(0, 5) }}
            </td>
            <td class="cinema-name">{{ orderInfo.studio }}</td>
            <td>
              <div class="seats">
                <div>
                  <span v-for="(item, index) in tickets" :key="index">
                    <i>{{ item[0] * 1 + 1 }}</i
                    >排<i>{{ item[1] * 1 + 1 }}</i
                    >座
                  </span>
                </div>
                <div></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="right">
        <div class="price-wrapper">
          <span>实际支付 :</span>
          <span class="price">{{ orderInfo.price * tickets.length }}</span>
        </div>
        <div>
          <div
            class="pay-btn"
            data-order-id="22466022057"
            data-act="pay-click"
            data-bid="b_u30afks6"
            @click="dialogVisible = true"
          >
            确认支付
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认支付吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pay()">确 定</el-button>
      </span>
    </el-dialog>

    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
import HeadWrap from "../components/nav/HeadWrap";
import FooterWrap from "../components/nav/FooterWrap";

export default {
  name: "order",
  components: {
    HeadWrap,
    FooterWrap,
  },
  data() {
    return {
      orderInfo: {},
      tickets: [],
      pretime: "",
      orderid: "",
      customerid: "",
      dialogVisible: false,
      str: "",
      m: "",
      s: "",
    };
  },
  created() {
    this.getOrderInfo();
    // this.getTickets()
  },
  mounted() {
    this.getTickets();
    this.locking();
  },
  methods: {
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
    //当前时间时分秒
    getNowDate() {
      var myDate = new Date();
      var year = myDate.getFullYear(); //获取当前年
      var mon = myDate.getMonth() + 1; //获取当前月
      var date = myDate.getDate(); //获取当前日
      var hours = myDate.getHours(); //获取当前小时
      var minutes = myDate.getMinutes(); //获取当前分钟
      var seconds = myDate.getSeconds(); //获取当前秒
      var now =
        year +
        "-" +
        mon +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return now;
    },
    //时间戳
    getTimestamp() {
      return new Date(this.getNowDate()).getTime();
    },

    //展示订单列表
    //影片时间影院座位
    getOrderInfo() {
      this.$axios({
        url: "http://localhost:5500/Oschedule",
        params: { scheduleid: this.$route.query.schedule },
      })
        .then((res) => {
          // console.log(res.data);
          this.orderInfo = res.data;
          if (res.data.schedule_day == this.getNowFormatDate()) {
            this.orderInfo.date = "今天";
          } else {
            this.orderInfo.date = "明天";
          }
        })
        .catch((err) => err);
    },
    //获取影票信息
    getTickets() {
      if (typeof this.$store.state.tickets == "string") {
        let tickets = [];
        let str = this.$store.state.tickets;

        str = str.split("[").join("");
        str = str.split("]").join("");
        str = str.split('"').join("");
        let strs = str.split(",");
        for (let i = 0; i < strs.length; ) {
          tickets[tickets.length] = [strs[i], strs[i + 1]];
          i = i + 2;
        }
        this.tickets = tickets;
      } else {
        this.tickets = this.$store.state.tickets;
      }
    },
    //加锁 更改ticket表的情况 新生成一条order记录
    locking() {
      let tickets = [];
      if (typeof this.$store.state.tickets == "string") {
        let str = this.$store.state.tickets;
        str = str.split("[").join("");
        str = str.split("]").join("");
        str = str.split('"').join("");
        tickets = str.split(",");
        tickets = tickets.map((num) => {
          return Number(num);
        });
        // console.log(tickets);
      } else {
        // console.log(this.$store.state.tickets.toString());
        // tickets = this.$store.state.tickets.toString()
        let str = this.$store.state.tickets.toString();
        tickets = str.split(",");
        tickets = tickets.map((num) => {
          return Number(num);
        });
      }

      tickets = JSON.stringify(tickets);
      this.str = tickets;
      // console.log(tickets);
      let scheduleid = this.$route.query.schedule;
      let tel = this.$store.state.tel;
      let time = this.getTimestamp();
      let count = this.tickets.length;
      this.pretime = new Date().getTime();
      this.$axios({
        url: "http://localhost:5500/locking",
        params: {
          tickets: tickets,
          scheduleid: scheduleid,
          tel: tel,
          time: time,
          count: count,
          pretime: this.pretime,
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.orderid = res.data.orderid;
          this.customerid = res.data.customerid;
          this.countdown();
        })
        .catch((err) => err);
    },
    //支付
    pay() {
      this.$axios({
        method: "put",
        url: "http://localhost:5500/payoff",
        data: {
          scheduleid: this.$route.query.schedule,
          orderid: this.orderid,
          customerid: this.customerid,
          paytime: new Date().getTime(),
          tickets: this.str,
        },
      })
        .then((res) => {
          if (res.data == 1) {
            this.$message.success("支付成功！");
            //更改状态
            this.dialogVisible = false;
            this.$router.go(-2);
          }
        })
        .catch((err) => err);
    },
    //设置定时器  十五分钟后提示超时  跳转到选场次页面,同时清除session
    countdown() {
      //获取订单提交时间
      this.$axios({
        url: "http://localhost:5500/countdown",
        params: { id: this.orderid },
      })
        .then((res) => {
          // console.log(res.data);
          let pretime = res.data;
          let nowtime = new Date().getTime();
          const fifteen = 900000;
          let m = Math.floor((fifteen - (nowtime - pretime)) / (60 * 1000));
          let s = Math.floor(
            ((fifteen - (nowtime - pretime)) % (60 * 1000)) / 1000
          );
          this.m = m;
          this.s = s;
          if (this.m < 10) {
            this.m = "0" + this.m;
          }
          if (this.s < 10) {
            this.s = "0" + this.s;
          }
          let event = setInterval(() => {
            s--;
            if (s == 0) {
              m--;
              s = 59;
            }
            if ( m < 0) {
              clearTimeout(event);
              //删除订单信息
              alert("该订单信息已失效，请重新选择！");
              this.$axios({
                method:"delete",
                url: "http://localhost:5500/delorder/" + this.orderid,
              })
                .then((res) => {
                  if (res.data == 1) this.$router.go(-2);
                })
                .catch((err) => err);
            }
            this.m = m;
            this.s = s;
            if (this.m < 10) {
              this.m = "0" + this.m;
            }
            if (this.s < 10) {
              this.s = "0" + this.s;
            }
          }, 1000);
        })
        .catch((err) => err);
    },
  },
};
</script>

<style scoped>
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

.container {
  width: 80%;
  margin: 0 auto;
}
.container .count-down-wrapper {
  background-color: rgba(136, 9, 9, 0.1);
  height: 90px;
  padding-top: 20px;
  padding-left: 30px;
  font-size: 18px;
  margin-bottom: 40px;
}
.container .count-down-wrapper .time-left {
  padding-bottom: 10px;
  height: 41px;
  vertical-align: bottom;
}
.container .count-down-wrapper .time-left span {
  color: rgba(136, 9, 9, 1);
  font-size: 24px;
}

.container .count-down-wrapper .tip {
  font-size: 16px;
  color: rgba(136, 9, 9, 0.7);
}
.container .warning {
  font-size: 12px;
  color: #666;
  padding-left: 18px;
  background: url("../assets/img/warning.png") no-repeat;
  background-size: 12px;
  background-position-y: 2px;
  margin-bottom: 8px;
  margin: 20px 0;
}
.container .warning .attention {
  color: #faaf00;
}
.container .order-table {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-spacing: 0;
  margin-bottom: 60px;
}
.container .order-table thead {
  background-color: #f7f7f7;
}
.container .order-table thead th {
  font-size: 16px;
  color: #333;
  width: 25%;
  padding: 14px 0;
  font-weight: 400;
}
.container .order-table tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.container .order-table td {
  font-size: 16px;
  text-align: center;
  padding: 20px 0;
  color: #333;
}
.container .order-table td i {
  font-style: normal;
}
.right {
  text-align: right;
  margin-bottom: 50px;
}
.right .price-wrapper {
  font-size: 14px;
  color: #333;
  margin-bottom: 17px;
}
.right .price-wrapper .price {
  font-size: 36px;
  color: #f03d37;
}
.right .price-wrapper .price:before {
  content: "\FFE5";
  font-size: 24px;
}
.btn,
.pay-btn {
  cursor: pointer;
  display: inline-block;
  width: 190px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #fff;
  background-color: #f03d37;
  border-radius: 100px;
  box-shadow: 0 2px 10px -2px #f03d37;
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