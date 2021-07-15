<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>剧目管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getMovieList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getMovieList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加影片</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="movieList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="电影名称" prop="title"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="片长" prop="filmlen"></el-table-column>
        <el-table-column label="上映时间" prop="date"></el-table-column>
        <el-table-column label="评分" prop="score"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:default="scope">
            <!-- {{scope.row}} -->
            <el-tooltip
              class="item"
              effect="dark"
              content="查看影片信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-aim"
                size="small"
                @click="showMovieInfo(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeMovieById(scope.row.id)"
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

    <!-- 添加电影的对话框 -->
    <el-dialog
      title="添加影片"
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
        <el-form-item label="电影名称" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="导演名称" prop="direct">
          <el-input v-model="addForm.direct"></el-input>
        </el-form-item>
        <el-form-item label="演职员表" prop="actor">
          <el-input v-model="addForm.actor"></el-input>
        </el-form-item>
        <el-form-item label="电影类型" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="制片地区" prop="area">
          <el-input v-model="addForm.area"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="addForm.language"></el-input>
        </el-form-item>
        <el-form-item label="上映日期" prop="date">
          <el-input v-model="addForm.date"></el-input>
        </el-form-item>
        <el-form-item label="片长" prop="filmlen">
          <el-input v-model="addForm.filmlen"></el-input>
        </el-form-item>
        <el-form-item label="影片简介" prop="introduction">
          <el-input type="textarea" v-model="addForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="豆瓣评分" prop="score">
          <el-input v-model="addForm.score"></el-input>
        </el-form-item>
        <el-form-item label="电影封面" prop="cover">
          <el-upload
            action="http://localhost:5500/posts"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-remove="uploadRemove"
            accept="image/*"
            :limit="1"
            :class="{ hide: isDisplay }"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMovie()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改电影的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="电影名称">
          <el-input v-model="editForm.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="导演名称" prop="direct">
          <el-input v-model="editForm.direct"></el-input>
        </el-form-item>
        <el-form-item label="演职员表" prop="actor">
          <el-input v-model="editForm.actor"></el-input>
        </el-form-item>
        <el-form-item label="电影类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="制片地区" prop="area">
          <el-input v-model="editForm.area"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="editForm.language"></el-input>
        </el-form-item>
        <el-form-item label="上映日期" prop="date">
          <el-input v-model="editForm.date"></el-input>
        </el-form-item>
        <el-form-item label="片长" prop="filmlen">
          <el-input v-model="editForm.filmlen"></el-input>
        </el-form-item>
        <el-form-item label="影片简介" prop="introduction">
          <el-input type="textarea" v-model="editForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="豆瓣评分">
          <el-input v-model="editForm.score"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeMovie()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看电影详细信息 -->
    <el-dialog title="电影详情页" :visible.sync="showdialogVisible" width="50%">
      <div class="exhibit">
        <div>
          <img :src="showInfo.cover" alt="" />
        </div>
        <div>
          <span class="infodes">电影名称：</span>
          <span>{{ showInfo.title }}</span>
        </div>
        <div>
          <span class="infodes">导演：</span>
          <span>{{ showInfo.direct }}</span>
        </div>
        <div>
          <span class="infodes">主演：</span>
          <span>{{ showInfo.actor }}</span>
        </div>
        <div>
          <span class="infodes">类型：</span>
          <span>{{ showInfo.type }}</span>
        </div>
        <div>
          <span class="infodes">制片国家/地区：</span>
          <span>{{ showInfo.area }}</span>
        </div>
        <div>
          <span class="infodes">语言：</span>
          <span>{{ showInfo.language }}</span>
        </div>
        <div>
          <span class="infodes">上映时间：</span>
          <span>{{ showInfo.date }}</span>
        </div>
        <div>
          <span class="infodes">片长：</span>
          <span>{{ showInfo.filmlen }}</span>
        </div>
        <div>
          <span class="infodes">剧情介绍：</span>
          <p>{{ showInfo.introduction }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "play",
  data() {
    return {
      //获取电影列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      movieList: [],
      total: 0,
      //控制添加电影对话框的隐藏和显示
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        title: "",
        direct: "",
        actor: "",
        type: "",
        area: "",
        language: "",
        date: "",
        filmlen: "",
        introduction: "",
        score: "",
        cover: "",
      },
      // 添加用户的表单的验证规则对象
      addFormRules: {
        title: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
        direct: [
          { required: true, message: "请输入导演姓名", trigger: "blur" },
        ],
        actor: [{ required: true, message: "请输入主演姓名", trigger: "blur" }],
        type: [{ required: true, message: "请输入电影类型", trigger: "blur" }],
        area: [{ required: true, message: "请输入制片地区", trigger: "blur" }],
        language: [
          { required: true, message: "请输入电影语言", trigger: "blur" },
        ],
        date: [{ required: true, message: "请输入上映日期", trigger: "blur" }],
        filmlen: [
          { required: true, message: "请输入电影时长", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入电影简介", trigger: "blur" },
        ],
        score: [
          { required: true, message: "请输入电影豆瓣评分", trigger: "blur" },
        ],
      },

      // 修改对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      //修改表单的验证规则
      editFormRules: {
        direct: [
          { required: true, message: "请输入导演姓名", trigger: "blur" },
        ],
        actor: [{ required: true, message: "请输入主演姓名", trigger: "blur" }],
        type: [{ required: true, message: "请输入电影类型", trigger: "blur" }],
        area: [{ required: true, message: "请输入制片地区", trigger: "blur" }],
        language: [
          { required: true, message: "请输入电影语言", trigger: "blur" },
        ],
        date: [{ required: true, message: "请输入上映日期", trigger: "blur" }],
        filmlen: [
          { required: true, message: "请输入电影时长", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入电影简介", trigger: "blur" },
        ],
        score: [
          { required: true, message: "请输入电影豆瓣评分", trigger: "blur" },
        ],
      },
      // 展示对话框的显示与隐藏
      showdialogVisible: false,
      // 电影展示信息
      showInfo: {},
      //图片
      dialogImageUrl: "",
      dialogVisible: false,
      //图片框是否展示
      isDisplay: false,
    };
  },
  created() {
    this.getMovieList();
  },
  methods: {
    // 获取电影列表
    async getMovieList() {
      // console.log(this.queryInfo.query);
      // get返回promise对象
      const { data: res } = await this.$axios.get(
        "http://localhost:5500/message/play",
        {
          params: this.queryInfo,
        }
      );
      this.movieList = res.movies;
      this.total = res.totalpage[0].total;
      // console.log(res.totalpage[0].total);
    },
    // 监听页码值改变的
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getMovieList();
    },
    //上传头像
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    //监听对话框关闭 清空
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加电影信息
    addMovie() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        // 发起网络请求
        // addDialogVisible = false
        // console.log(this.addForm);
        this.$axios
          .post("http://localhost:5500/message/addmovie", {
            data: this.addForm,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((res) => {
            if (res.data == 1) {
              this.$message.success("添加成功");
              // 隐藏对话框
              this.addDialogVisible = false;

              //图片相关
              this.addForm.cover = "";
              this.addForm.path = "";
              // 刷新列表
              this.getMovieList();
            } else {
              // alert("电影名不能重复！");
              this.$message.warning("电影名不能重复");
              this.addForm.title = "";
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
        // console.log(res);
      });
    },
    //监听修改对话框打开
    showEditDialog(id) {
      this.editDialogVisible = true;
      // console.log(id);
      // 根据id查询电影信息
      this.$axios({
        url: "http://localhost:5500/movie/" + id,
      }).then((res) => {
        // console.log(res.data);
        this.editForm = res.data;
      });
    },
    //监听对话框关闭 清空
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改电影信息并提交
    changeMovie() {
      this.$refs.editFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;
        let editForm = this.editForm;
        this.$axios({
          method: "put",
          url: "http://localhost:5500/movie/" + this.editForm.id,
          data: editForm,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.data == 1) {
              // 隐藏对话框
              this.editDialogVisible = false;
              // 刷新列表
              this.getMovieList();
              //提示修改成功
              this.$message.success("更新电影信息成功");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    },
    //根据Id删除电影对话框
    removeMovieById(id) {
      // 弹框
      this.$confirm("此操作将永久删除该电影信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$axios({
            method: "delete",
            url: "http://localhost:5500/movie/" + id,
          });
          if (res == 1) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新列表
            this.getMovieList();
          } else {
            this.$message({
              type: "warning",
              message: "删除失败",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //展示电影详情
    showMovieInfo(id) {
      this.showdialogVisible = true;
      this.$axios({
        method: "get",
        url: "http://localhost:5500/movie/" + id,
      })
        .then((res) => {
          // console.log(res.data);
          this.showInfo = res.data;
        })
        .catch((err) => console.log(err));
    },
    //图片
    uploadSuccess(res) {
      this.addForm.cover = res.data.path.substring(14);
      this.addForm.path = res.data.path;
      // console.log(this.addForm);
      this.isDisplay = true;
    },
    uploadBefore(file) {
      let limitMax = 5000 * 1024;
      if (file.size > limitMax) {
        this.$messageTips("大小超出限制");
        return false;
      }
    },
    uploadRemove() {
      this.$axios({
        url: "http://localhost:5500/disposts",
        params: { filepath: this.addForm.path },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => err);
      this.addForm.cover = "";
      this.addForm.path = "";
      // console.log(this.addForm);
      this.isDisplay = false;
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
