<template>
  <div>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
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
              @clear="getStaffList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getStaffList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加员工</el-button
            >
          </el-col>
        </el-row>

        <!-- 表格区域 -->
        <el-table :data="staffList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="emp_user" label="用户名"> </el-table-column>
          <el-table-column prop="emp_gender" label="性别"> </el-table-column>
          <el-table-column prop="emp_tel" label="电话"> </el-table-column>
          <el-table-column prop="emp_status" label="状态">
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.emp_status"
                @change="updateInfo(scope.row.emp_id, scope.row.emp_status)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot:default="scope">
              <!-- {{scope.row}} -->
              <!-- 作用域插槽 -->
              <!-- 修改按钮 scope.row.id -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="showEditDialog(scope.row.emp_id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteStaff(scope.row.emp_id)"
              ></el-button>
              <!-- 修改密码按钮 -->
              <el-button
                type="warning"
                icon="el-icon-key"
                size="small"
                @click="showChangeDialog(scope.row.emp_id)"
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

        <!-- 添加员工对话框 -->
        <el-dialog
          title="添加员工"
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
            <el-form-item label="用户名" prop="emp_user">
              <el-input v-model="addForm.emp_user"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="emp_pwd">
              <el-input :type="typePwd" v-model="addForm.emp_pwd"
                ><el-button
                  slot="append"
                  icon="el-icon-view"
                  circle
                  @click="showPwd"
                ></el-button
              ></el-input>
            </el-form-item>
            <el-form-item label="员工电话" prop="emp_tel">
              <el-input v-model="addForm.emp_tel"></el-input>
            </el-form-item>
            <el-form-item label="员工邮箱" prop="emp_email">
              <el-input v-model="addForm.emp_email"></el-input>
            </el-form-item>
            <el-form-item label="员工性别">
              <el-radio v-model="addForm.emp_gender" label="0">女</el-radio>
              <el-radio v-model="addForm.emp_gender" label="1">男</el-radio>
            </el-form-item>
            <el-form-item label="员工权限">
              <el-radio v-model="addForm.emp_status" label="1"
                >普通管理员</el-radio
              >
              <el-radio v-model="addForm.emp_status" label="0"
                >超级管理员</el-radio
              >
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStaff">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改员工信息对话框 -->
        <el-dialog
          title="修改员工信息"
          :visible.sync="editDialogVisible"
          width="50%"
          @closed="editHandleClose"
        >
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="emp_user">
              <el-input v-model="editForm.emp_user" disabled></el-input>
            </el-form-item>
            <el-form-item label="员工电话" prop="emp_tel">
              <el-input v-model="editForm.emp_tel"></el-input>
            </el-form-item>
            <el-form-item label="员工邮箱" prop="emp_email">
              <el-input v-model="editForm.emp_email"></el-input>
            </el-form-item>
            <el-form-item label="员工性别">
              <el-radio v-model="editForm.emp_gender" label="女">女</el-radio>
              <el-radio v-model="editForm.emp_gender" label="男">男</el-radio>
            </el-form-item>
            <el-form-item label="员工权限">
              <el-radio v-model="editForm.emp_status" label="1"
                >普通管理员</el-radio
              >
              <el-radio v-model="editForm.emp_status" label="0"
                >超级管理员</el-radio
              >
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeStaff">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改密码对话框 -->
        <el-dialog
          title="修改员工信息"
          :visible.sync="pwdDialogVisible"
          width="50%"
          @closed="editHandleClose"
        >
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="100px"
          >
            <el-form-item label="新密码" prop="emp_pwd">
              <el-input :type="typePwd" v-model="editForm.emp_pwd"
                ><el-button
                  slot="append"
                  icon="el-icon-view"
                  circle
                  @click="showPwd"
                ></el-button
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changePwd">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'

export default {
  name: "staff",
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      staffList: [],
      // 添加员工弹框是否展示
      addDialogVisible: false,
      addForm: {
        emp_user: "",
        emp_pwd: "",
        emp_role: "1",
        emp_gender: "0",
        emp_tel: "",
        emp_email: "",
        emp_status: "1",
      },

      addFormRules: {
        emp_pwd: [
          {
            min: 4,
            max: 15,
            message: "长度在 4 到 15 个字符",
            trigger: "blur",
          },
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        emp_user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        emp_tel: [
          {
            validator: function (rule, value, callback) {
              if (value == "") {
                callback();
              } else {
                if (/^1[34578]\d{9}$/.test(value) == false) {
                  callback(new Error("手机号格式错误"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        emp_email: [
          {
            validator: function (rule, value, callback) {
              if (value == "") {
                callback();
              } else {
                if (
                  /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                    value
                  ) == false
                ) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
      },
      // 展示密码
      typePwd: "password",
      // 修改信息
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        emp_pwd: [
          {
            min: 4,
            max: 15,
            message: "长度在 4 到 15 个字符",
            trigger: "blur",
          },
          // { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        emp_user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        emp_tel: [
          {
            validator: function (rule, value, callback) {
              if (!value) {
                callback();
              } else {
                if (/^1[34578]\d{9}$/.test(value) == false) {
                  callback(new Error("手机号格式错误"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        emp_email: [
          {
            validator: function (rule, value, callback) {
              if (!value) {
                callback();
              } else {
                if (
                  /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                    value
                  ) == false
                ) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
      },
      // 修改密码
      pwdDialogVisible: false,
      //旧密码
      pwd: "",
    };
  },
  created() {
    this.getStaffList();
  },
  methods: {
    getStaffList() {
      this.$axios({
        url: "http://localhost:5500/message/staff",
        params: this.queryInfo,
      })
        .then((res) => {
          // console.log(res);
          // console.log(res.data.employees);
          this.total = res.data.totalpage[0].total;
          this.staffList = res.data.employees;
          for (let item of this.staffList) {
            if (item.emp_status == 1) {
              item.emp_status = true;
            } else {
              item.emp_status = false;
            }
          }
          // console.log(this.staffList);
          // console.log(res.data.employees);
        })
        .catch((err) => err);
    },
    //页码改变函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getScreenList();
    },
    //关闭添加员工弹框
    addHandleClose() {
      this.confirmPwd = "";
      this.$refs.addFormRef.resetFields();
    },
    // 展示密码
    showPwd() {
      this.typePwd = this.typePwd === "password" ? "text" : "password";
    },
    // 添加员工
    addStaff() {
      // const formData = new FormData()
      // formData.append('role', 1)

      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.$axios({
          method: "post",
          url: "http://localhost:5500/message/addstaff",
          data: Qs.stringify(this.addForm),
          // headers:{
          //   'Content-Type': 'application/x-www-form-urlencoded'
          // }
        })
          .then((res) => {
            if (res.data == 1) {
              this.$message.success("添加用户成功");
              this.addDialogVisible = false;
              this.getStaffList();
            } else {
              this.$message.waring("用户名不能重复");
              this.addForm.emp_user = "";
            }
          })
          .catch((err) => err);
      });
    },
    //删除员工
    deleteStaff(id) {
      // console.log(id);
      this.$confirm("此操作将删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          this.$axios({
            method: "delete",
            url: "http://localhost:5500/staff/" + id,
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getStaffList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //状态改变函数
    updateInfo(id, status) {
      status = status == false ? 0 : 1;
      // console.log(status);
      let emp_status = { status: status };
      console.log(emp_status);

      this.$axios({
        method: "put",
        url: "http://localhost:5500/staff/" + id,
        params: emp_status,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res);
          if (res.data == 1) this.$message.success("修改状态成功");
        })
        .catch((err) => err);
    },
    //修改员工信息
    changeStaff() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        let editForm = this.editForm;
        this.$axios({
          method: "put",
          url: "http://localhost:5500/staff/" + this.editForm.emp_id,
          params: editForm,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.data == 1) {
              // 隐藏对话框
              this.editDialogVisible = false;
              // 刷新列表
              this.getStaffList();
              //提示修改成功
              this.$message.success("更新员工信息成功");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    },
    //监听对话框打开与关闭
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.$axios({
        url: "http://localhost:5500/staff/" + id,
      })
        .then((res) => {
          // console.log(res.data[0]);
          this.editForm = res.data[0];
        })
        .catch((err) => err);
    },
    editHandleClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改密码
    showChangeDialog(id) {
      this.pwdDialogVisible = true;
      this.$axios({
        url: "http://localhost:5500/staff/" + id,
      })
        .then((res) => {
          this.editForm = res.data[0];
          this.pwd = this.editForm.emp_pwd;
          this.editForm.emp_pwd = "";
        })
        .catch((err) => err);
    },
    changePwd() {
      // console.log(this.editForm.emp_pwd);
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        if (!this.editForm.emp_pwd) {
          this.pwdDialogVisible = false;
          this.$message("未修改密码");
          return;
        } else {
          // console.log(this.editForm.emp_pwd);
          this.$axios({
            method: "put",
            url: "http://localhost:5500/staff/" + this.editForm.emp_id,
            params: { pwd: this.editForm.emp_pwd },
          })
            .then((res) => {
              if (res.data == 1) {
                // 隐藏对话框
                this.pwdDialogVisible = false;
                // 刷新列表
                this.getStaffList();
                //提示修改成功
                this.$message.success("修改密码成功");
              }
            })
            .catch((err) => err);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>



