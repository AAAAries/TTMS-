<template>
  <div class="rmiddle">
    <div class="htitle">我的订单</div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未放映" name="1"></el-tab-pane>
      <el-tab-pane label="已放映" name="0"></el-tab-pane>
      <el-tab-pane label="已退款" name="-1"></el-tab-pane>
    </el-tabs>

    <div class="order-box" v-for="(item, index) in porders" :key="index">
      <!-- {{ item }} -->
      <div class="order-header">
        <span class="order-date">{{ item.paytime }}</span>
        <span class="order-id">汉唐订单号:{{ item.order_id }}</span>
        <span class="del-order"></span>
      </div>

      <div class="order-body">
        <div class="poster">
          <img :src="item.cover" />
        </div>

        <div class="order-content">
          <div class="movie-name">《{{ item.movie }}》</div>
          <div class="cinema-name">汉唐影剧院</div>
          <div class="hall-ticket">
            <span>{{ item.studio }}</span>
            <span>
              <span v-for="(s, i) in item.seats" :key="i"
                >{{ s[0] + 1 }}排{{ s[1] + 1 }}座</span
              >
            </span>
          </div>
          <div class="show-time">
            {{ item.schedule_day }} {{ item.schedule_time }}
          </div>
        </div>

        <div class="order-price">￥{{ item.order_price }}</div>

        <div class="order-status" v-if="item.order_status == 1">
          <el-button type="danger" round @click="drawback(item.order_id,item.seats)"
            >退款</el-button
          >
        </div>
        <div class="order-status" style="color:red;" v-if="item.order_status == -1">已退款</div>
        <div class="order-status" v-else>已完成</div>

        <div class="actions">
          <div>
            <a
              class="order-detail"
              data-act="orders-detail-click"
              data-bid="b_y190atas"
              >查看详情</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "myorder",
  data() {
    return {
      //-1退款 0已放映  1-未放映 -2未支付
      status: "1",
      porders: [],
      activeName: "1",
    };
  },
  created () {
    // 组件刚一创建就遍历修改订单的状态
    this.judgingState();
  },
  mounted() {
    this.getorderInfo();
  },
  methods: {
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
    //系统时间时间戳
    getNowTimestamp() {
      return new Date(this.getNowDate()).getTime();
    },

    // 展示订单信息
    getorderInfo() {
      this.$axios({
        url: "http://localhost:5500/porder",
        params: {
          tel: this.$store.state.tel,
          status: this.status,
        },
      })
        .then((res) => {
          this.porders = res.data;
          this.porders = this.porders.map((val) => {
            val.paytime = this.formatDate(val.order_pay_time * 1);
            return val;
          });
          // console.log(this.porders);
          for (let i = 0; i < this, this.porders.length; i++) {
            this.porders[i].seat = JSON.parse(this.porders[i].seat);
            let seats = [];
            for (let j = 0; j < this.porders[i].seat.length; ) {
              seats[seats.length] = [
                this.porders[i].seat[j],
                this.porders[i].seat[j + 1],
              ];
              j = j + 2;
            }
            this.porders[i].seats = seats;
          }
        })
        .catch((err) => err);
    },
    //将时间戳转成yyyy-mm-dd hh:mm:ss
    formatDate(date) {
      var date = new Date(date);
      var YY = date.getFullYear() + "-";
      var MM =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hh =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var mm =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return YY + MM + DD + " " + hh + mm + ss;
    },
    //切换订单状态
    handleClick(tab) {
      // console.log(tab.name);
      this.status = tab.name;
      this.getorderInfo();
    },
    // 退票弹框
    drawback(id,seats) {
      let con = confirm("是否退票");
      if (con == true) {
        this.$axios({
          method:"put",
          url: "http://localhost:5500/retorder",
          data: {
            id: id,
            seats:seats
          },
        }).then(res => {
          if(res.data == 1){
            this.$message.success("退款成功！");
            this.getorderInfo();
          }
        }).catch(err => err)
      }
    },
    // 遍历修改订单状态
    judgingState(){
      let time = this.getNowTimestamp();
      this.$axios({
        method: "put",
        url: "http://localhost:5500/changeState",
        params: {
          time,
        },
      }).then((res) => {
        // console.log(res);
        this.getorderInfo();
      }).catch(err => err)
    }
  },
};
</script>

<style scoped>
.rmiddle {
  margin: 30px;
  margin-left: 40px;
}
.rmiddle .htitle {
  width: 100%;
  font-size: 20px;
  color: rgb(136, 9, 9);
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

.order-box {
  border: 1px solid #e5e5e5;
  margin: 0 40px 30px 0;
}
.order-box .order-header {
  background-color: #f7f7f7;
  font-size: 14px;
  padding: 16px 20px;
}
.order-box .order-header .order-date {
  color: #333;
  display: inline-block;
  margin-right: 30px;
}
.order-box .order-header .order-id {
  color: #999;
}
.order-box .order-header .del-order {
  width: 15px;
  height: 16px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAP5JREFUKBVjZMACZs2alfTv3z95kNT///9FOTg4qhITEz+gK2UEKlQDKhBEklAG8ksZGRk3QDWzAPmhLCws0UADWWDqBAUFz7MABVKAAvYwQaBCVnZ2drekpKTXMLEZM2Y8/fv37wwg/x9M7MuXLz4wNnk00NTkmTNnppGiG6jnCEg9E9BvMkCnSsM0T58+/T8+NlAtE1DeCqQGxCAbjGomMegoDrAvwLgzglmamZnJiI89Z84cdaB6sBpgemeZ9evXrx5g4rgLTDALgRqZYZrRaaA8858/f6qBdCZIDmwCMHmyAjNIDpDPz8TEBE9h6JqBNv4Fih3PyMjYC5IDACkobU1JvS12AAAAAElFTkSuQmCC)
    no-repeat;
  float: right;
}
.order-box .order-body {
  padding: 20px;
  padding-right: 0;
}
.order-box .order-body .poster {
  border: 2px solid #fff;
  box-shadow: 0 1px 2px 0 hsl(0deg 0% 53% / 50%);
  margin-right: 11px;
  font-size: 0;
}
.order-box .order-body .poster img {
  width: 70px;
  height: 95px;
}
.order-box .order-body .order-content {
  width: 49%;
}
.order-box .order-body > div {
  display: inline-block;
  vertical-align: top;
}
.order-box .order-body .movie-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 4px 0 7px -6px;
}
.order-box .order-body .cinema-name,
.order-box .order-body .hall-ticket {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.order-box .order-body .cinema-name,
.order-box .order-body .hall-ticket {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.order-box .order-body .hall-ticket span {
  display: inline-block;
  margin-right: 5px;
  color: black;
}
.order-box .order-body .show-time {
  font-size: 12px;
  color: #f03d37;
}
.order-box .order-body .actions,
.order-box .order-body .order-price,
.order-box .order-body .order-status {
  font-size: 14px;
  color: #333;
  width: 12%;
  line-height: 95px;
}
.order-box .order-body .order-status {
  width: 15%;
}
.order-box .order-body .actions {
  text-align: center;
}
.order-box .order-body .actions > div {
  line-height: normal;
  display: inline-block;
  vertical-align: middle;
}
.order-box .order-body .actions .order-detail {
  color: #333;
}
</style>

<style>
.el-tabs__item.is-active {
  color: rgb(136, 9, 9);
}
.el-tabs__item:hover {
  color: rgb(136, 9, 9);
  cursor: pointer;
}
.el-tabs__active-bar {
  background-color: rgb(136, 9, 9);
}
</style>