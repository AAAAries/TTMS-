<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>演出计划管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogOpen"
            >添加演出计划</el-button
          >
        </el-col>
        <el-col style="float: right" :span="4">
          <el-button type="danger" @click="deleteDialogVisible = true"
            >删除过期演出计划</el-button
          >
        </el-col>
      </el-row>

      <!-- 演出计划列表 -->
      <el-table :data="scheduleList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="电影名称" prop="movie">
          <!-- <template slot-scope="scope">
            {{getMovie(scope.row.movie_id)}}
          </template> -->
        </el-table-column>
        <el-table-column label="影厅名称" prop="studio"></el-table-column>
        <el-table-column label="放映日期" prop="schedule_day"></el-table-column>
        <el-table-column
          label="放映时间"
          prop="schedule_time"
        ></el-table-column>
        <el-table-column label="票价" prop="price"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template v-slot:default="scope">
            <!-- {{scope.row}} -->
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeMovieById(scope.row.schedule_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加演出计划的对话框 -->
    <el-dialog
      title="添加演出计划"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="电影名称">
          <template>
            <el-select
              style="width: 90%"
              v-model="addForm.mValue"
              placeholder="请选择影片名称"
            >
              <el-option
                v-for="item in movies"
                :key="item.id"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="演出厅名称">
          <template>
            <el-select
              style="width: 90%"
              v-model="addForm.sValue"
              placeholder="请选择放映的影厅"
            >
              <el-option
                v-for="item in studios"
                :key="item.id"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="放映日期">
          <template>
            <div class="block">
              <el-date-picker
                style="width: 90%"
                v-model="addForm.dValue"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="放映时间">
          <template>
            <el-time-picker
              v-model="addForm.tValue"
              value-format="HH:mm:ss"
              style="width: 90%"
              placeholder="选择时间"
            >
            </el-time-picker>
          </template>
        </el-form-item>
        <el-form-item label="票价" prop="price">
          <el-input
            style="width: 90%"
            v-model="addForm.price"
            placeholder="请输入票价"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSchedule()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除演出计划确定框 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要删除所有的过期演出计划吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteOverduePlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Qs from "qs";

export default {
  name: "play",
  data() {
    return {
      queryInfo: {
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      scheduleList: [],
      addDialogVisible: false,
      deleteDialogVisible: false,
      addForm: {
        mValue: "",
        sValue: "",
        dValue: "",
        tValue: "",
        price: "",
      },
      addFormRules: {
        price: [
          { required: true, message: "请输入票价", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            },
          },
        ],
      },

      movies: [],
      studios: [],
    };
  },
  created() {
    this.getScheduleList();
  },
  computed: {
    // getMovie:function(){
    //   return async function(movie_id){
    //     let res =  await this.$axios({
    //       url:"http://localhost:5500/schedule/m/" + movie_id
    //     })
    //     console.log(res.data);
    //     return res.data
    //   }
    // }
  },
  methods: {
    async getScheduleList() {
      const { data: res } = await this.$axios.get(
        "http://localhost:5500/message/schedule",
        {
          params: this.queryInfo,
        }
      );
      // console.log(res);
      // for(let item in res.schedules){
      //   let obj = {
      //     movieid:  res.schedules[item].movie_id,
      //     studioid: res.schedules[item].studio_id,
      //     item:item
      //   }
      //   this.$axios({
      //     url:'http://localhost:5500/schedule/ms',
      //     params:obj,
      //   }).then(res => {
      //     this.scheduleList[item].movie = res.data.movie
      //     this.scheduleList[item].studio = res.data.studio
      //     // console.log(this.scheduleList);
      //   })
      // }
      this.scheduleList = res.schedules;
      this.total = res.totalpage[0].total;
    },
    //展示演出计划的电影名和影厅名
    // showMovieStudio(obj) {
    //   // console.log(obj);
    //   this.$axios({
    //     url: "http://localhost:5500/schedule/ms",
    //     params: obj,
    //   })
    //     .then((res) => {
    //       // console.log(res.data);
    //       this.scheduleList[res.data.item].movie = res.data.movie;
    //       this.scheduleList[res.data.item].studio = res.data.studio;
    //       // console.log(this.scheduleList);
    //     })
    //     .catch((err) => err);
    // },

    //页码改变函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getScheduleList();
    },
    //删除计划
    removeMovieById(id) {
      // console.log(id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "http://localhost:5500/schedule/" + id,
          })
            .then((res) => {
              // console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getScheduleList();
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

    //获取电影列表
    getMovies() {
      this.$axios({
        url: "http://localhost:5500/movies",
      })
        .then((res) => {
          // console.log(res.data);
          this.movies = res.data;
          // console.log(this.movies);
        })
        .catch((err) => err);
    },
    //获取演出厅列表
    getStudios() {
      this.$axios({
        url: "http://localhost:5500/studios",
      })
        .then((res) => {
          // console.log(res.data);
          this.studios = res.data;
          // console.log(this.movies);
        })
        .catch((err) => err);
    },
    //关闭添加对话框
    addDialogClosed() {
      (this.addForm.mValue = ""),
        (this.addForm.sValue = ""),
        (this.addForm.dValue = ""),
        (this.addForm.tValue = ""),
        this.$refs.addFormRef.resetFields();
    },
    //打开添加对话框
    addDialogOpen() {
      this.addDialogVisible = true;
      this.getMovies();
      this.getStudios();
    },
    //通过YY-MM-DD hh:mm:ss获取时间戳
    getTimestamp(stringTime) {
      // var stringTime = "2014-07-10 10:21:12";
      var timestamp2 = stringTime.replace(/-/g, "/"); //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
      timestamp2 = Date.parse(timestamp2); //返回'2018-9-12 9:11:23'的时间戳
      // console.log(stringTime + "的时间戳为：" + timestamp2);
      return timestamp2;
    },
    //确认添加演出计划

    addSchedule() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        //添加时间戳
        // console.log(this.addForm.dValue + " " + this.addForm.tValue);
        // console.log(this.getTimestamp(this.addForm.dValue + " " + this.addForm.tValue));
        this.addForm.timestamp = this.getTimestamp(
          this.addForm.dValue + " " + this.addForm.tValue
        );
        this.$axios({
          method: "post",
          url: "http://localhost:5500/message/schedule",
          data: Qs.stringify(this.addForm),
        })
          .then((res) => {
            if (res.data == 1) {
              this.$message.success("添加成功");
              // 隐藏对话框
              this.addDialogVisible = false;
              // 刷新列表
              this.getScheduleList();
            }else{
              this.$message.warning("时间矛盾 添加失败!");
              // 隐藏对话框
              this.addDialogVisible = false;
            }
          })
          .catch((err) => err);
      });
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
    //系统时间时间戳
    getNowTimestamp() {
      return new Date(this.getNowDate()).getTime();
    },

    //删除过期的演出计划
    deleteOverduePlan() {
      let time = this.getNowTimestamp();
      this.$axios({
        method: "put",
        url: "http://localhost:5500/message/overdue",
        params: {
          time,
        },
      })
        .then((res) => {
          this.$message.success("删除成功");
          // 隐藏对话框
          this.deleteDialogVisible = false;
          // 刷新列表
          this.getScheduleList();
        })
        .catch((err) => err);
    },
  },
};
</script>

<style scoped>
</style>