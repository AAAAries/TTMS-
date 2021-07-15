<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/message/screens' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>影厅管理</el-breadcrumb-item>
      <el-breadcrumb-item>影厅详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部卡片 -->
    <el-card class="headcard">
      <div slot="header">
        <span>{{ showData.name }}</span>
        <el-button style="float: right" type="danger" @click="deleteScreem()"
          >删除影厅</el-button
        >
      </div>
      <div class="setstatus">
        座位总数 :
        <span id="green"></span>
        {{ showData.row * showData.col }}
        <span id="red"></span>
        0
        <span id="grey"></span>
        0
      </div>
    </el-card>
    <!-- 底部卡片 -->
    <el-card>
      <div slot="header">
        <span style="fontweight: bold">座位分布图</span>

        <el-button
          type="primary"
          round
          style="float: right"
          @click="updateSeat($route.query.id)"
          >修改</el-button
        >
        <div id="tip">
          单击左键更改座位为损坏 单击右键更改座位为不存在 再次点击即可恢复正常
        </div>
        <hr />
        <div class="seatarea">
          <div v-for="(item, i) in setList" class="row" :key="i">
            <div class="sitleft">
              {{ i + 1 }}
            </div>
            <div
              :class="[
                'sit',
                { 'bg-sited': item1 == -1 },
                { 'bg-sit': item1 == 0 },
                { 'bg-nosit': item1 == -2 },
              ]"
              v-for="(item1, j) in item"
              :key="j"
              @click="warnState($event, i, j)"
              @contextmenu.prevent="noneState($event, i, j)"
            ></div>
          </div>
        </div>
      </div>
      <div></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "detalied",
  data() {
    return {
      showData: {},
      setList: [],
      warnseats: [],
      noneseats: [],
    };
  },
  created() {
    this.showInFoById();
  },
  methods: {
    // 查找影厅信息
    //查找座位信息
    showInFoById() {
      let id = this.$route.query.id;
      // console.log(id);
      this.$axios({
        url: "http://localhost:5500/screen/" + id,
      })
        .then((res) => {
          // console.log(res.data);
          this.showData = res.data.screen[0];
          //座位列表
          this.setList = JSON.parse(res.data.seat);
        })
        .catch((err) => err);
    },

    //删除影厅
    deleteScreem() {
      let id = this.$route.query.id;
      this.$confirm("此操作将永久删除该影厅信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$axios({
            method: "delete",
            url: "http://localhost:5500/screen/" + id,
          })
            .then((res) => {
              // console.log(res);
              if (res.data == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                // 返回上级
                this.$router.go(-1);
              } else {
                this.$message({
                  type: "warning",
                  message: "删除失败",
                });
              }
            })
            .catch((err) => err);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //改变座位情况
    warnState(event, i, j) {
      if (event.target.className == "sit bg-sit") {
        // console.log("左键点击了" + i+" " + j);
        this.warnseats[this.warnseats.length] = [i, j];
        // console.log(this.warnseats);
        event.target.className = "sit bg-sited";
      } else if (event.target.className == "sit bg-sited") {
        for (let k = 0; k < this.warnseats.length; k++) {
          if (this.warnseats[k][0] == i && this.warnseats[k][1] == j) {
            this.warnseats.splice(k, 1);
            break;
          }
        }
        // console.log(this.warnseats);
        event.target.className = "sit bg-sit";
      }
    },

    noneState(event, i, j) {
      if (event.target.className == "sit bg-sit") {
        // console.log("右键点击了" + i+" " + j);
        this.noneseats[this.noneseats.length] = [i, j];
        event.target.className = "sit bg-nosit";
      } else if (event.target.className == "sit bg-nosit") {
        for (let k = 0; k < this.noneseats.length; k++) {
          if (this.noneseats[k][0] == i && this.noneseats[k][1] == j) {
            this.noneseats.splice(k, 1);
            break;
          }
        }
        event.target.className = "sit bg-sit";
      }
    },

    //更新座位信息
    updateSeat(id) {
      // let arrjson = JSON.stringify(arr);
      this.$axios({
        method: "post",
        url: "http://localhost:5500/seat/" + id,
        data: { warnseats: this.warnseats, noneseats: this.noneseats },
      })
        .then((res) => {
          // console.log(res);
          if (res.data == 1) {
            this.$message.success("修改成功!")
          }
        })
        .catch((err) => err);
    },
  },
};
</script>

<style scoped>
hr {
  margin: 20px 5px;
}
.headcard {
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
}
.setstatus {
  font-size: 14px;
  font-weight: normal;
}
.setstatus span {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
#green {
  background-color: seagreen;
}
#grey {
  background-color: #8c939d;
}
#red {
  background-color: #f56c6c;
}
.seatarea {
  /* float: left; */
  margin: 20px;
}
.sit {
  display: inline-block;
  height: 20px;
  width: 20px;
  min-height: 10px;
  min-width: 10px;
  margin: 4px 4px 4px 4px;
  background-size: cover;
}
.sitleft {
  display: inline-block;
  margin: 4px 4px 4px 4px;
  line-height: 20px;
  position: relative;
  width: 20px;
  height: 20px;
  top: -6px;
  text-align: center;
}

/* 可选座位 */
.bg-sit {
  background-color: seagreen;
}

.bg-sit:hover {
  cursor: pointer;
}

/* 损坏座位 */
.bg-sited {
  background-color: #f56c6c;
}

/* 无座 */
.bg-nosit {
  background-color: grey;
}

.row {
  /* 清除格式并换行 */
  height: 30px;
  clear: both;
}
#tip {
  color: #8c939d;
  margin-top: 5px;
  font-size: 14px;
}
</style>