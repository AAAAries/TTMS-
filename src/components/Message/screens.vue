<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>影厅管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getScreenList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getScreenList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 添加放映厅 -->
        <el-col :span="6">
          <el-button @click="addDialogVisible = true" type="primary"
            >添加演出厅</el-button
          >
        </el-col>
      </el-row>

      <!-- 展示列表 -->
      <el-row :gutter="20">
        <el-col :span="4" v-for="item in screenList" :key="item.id">
          <el-card :body-style="{ padding: '0px' }" class="showcard">
            <div style="padding: 7px">
              <span id="screentitle" @click="goToNewPage(item.id)">{{
                item.name
              }}</span>
              <hr />
              <div class="setstatus">
                <div>
                  <span id="green"></span>
                  {{ item.row * item.col }}
                </div>
                <div>
                  <span id="red"></span>
                  0
                </div>
                <div>
                  <span id="grey"></span>
                  0
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加影厅对话框 -->
      <el-dialog
        title="添加影厅"
        :visible.sync="addDialogVisible"
        width="50%"
        @closed="addHandleClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="影厅名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="影厅行数" prop="row">
            <el-input v-model="addForm.row"></el-input>
          </el-form-item>
          <el-form-item label="影厅列数" prop="col">
            <el-input v-model="addForm.col"></el-input>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-radio v-model="addForm.status" label="1">启用</el-radio>
            <el-radio v-model="addForm.status" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addScreen()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "screens",
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        pagesize: 12,
      },
      //影厅总条数
      total: 0,
      //影厅列表
      screenList: [],
      // 添加影厅弹框是否展示
      addDialogVisible: false,
      //添加影厅数据
      addForm: {
        name: "",
        row: "",
        col: "",
        status: "1",
        setList: "",
      },
      //添加数据验证规则
      addFormRules: {
        name: [{ required: true, message: "请输入影厅名称", trigger: "blur" }],
        row: [
          { required: true, message: "请输入座位行数", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            },
          },
        ],
        col: [
          { required: true, message: "请输入座位列数", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            },
          },
        ],
        status: [{}],
      },
    };
  },
  created() {
    this.getScreenList();
  },
  computed: {},
  methods: {
    getScreenList() {
      this.$axios({
        url: "http://localhost:5500/message/screens",
        params: this.queryInfo,
      })
        .then((res) => {
          // console.log(res.data);
          this.screenList = res.data.screens;
          this.total = res.data.totalpage[0].total;
        })
        .catch((err) => err);
    },
    //页码改变函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getScreenList();
    },
    //关闭添加影厅弹框
    addHandleClose() {
      this.$refs.addFormRef.resetFields();
    },
    //添加影厅
    addScreen() {
      // console.log(this.addForm.status);
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        let arr = [];
        for (let i = 0; i < this.addForm.row; i++) {
          arr[i] = []; //每行的列数
          for (let j = 0; j < this.addForm.col; j++) {
            arr[i][j] = 0;
          }
        }
        this.addForm.setList = JSON.stringify(arr);
        this.$axios({
          method: "post",
          url: "http://localhost:5500/message/addscreen",
          params: this.addForm,
        })
          .then((res) => {
            // console.log(res);
            if (res.data == 1) {
              this.$message.success("添加成功");
              this.addDialogVisible = false;
              this.getScreenList();
            } else {
              this.$message.warning("影厅名不能重复");
              this.addForm.name = "";
            }
          })
          .catch((err) => err);
      });
    },
    //路由跳转
    goToNewPage(id) {
      this.$router.push({
        path: "/message/detalied",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.showcard {
  margin: 15px;
}
#screentitle {
  display: block;
  margin: 5px auto;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
#screentitle:hover {
  cursor: pointer;
}
#screentitle:hover {
  color: #409eff;
}
hr {
  margin: 10px 0px;
}
.setstatus {
  text-align: center;
}
.setstatus span {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
.setstatus div {
  font-size: 14px;
  margin: 5px;
}
#green {
  background-color: #67c23a;
}
#grey {
  background-color: #8c939d;
}
#red {
  background-color: #f56c6c;
}
</style>