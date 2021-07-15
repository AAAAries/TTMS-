<template>
  <div>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>顾客管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="9">
            <el-input
              placeholder="请输入电话"
              v-model="queryInfo.query"
              clearable
              @clear="getCustomerList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getCustomerList"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>

        <!-- 表格区域 -->
        <el-table :data="customerList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="user" label="用户名"> </el-table-column>
          <el-table-column prop="tel" label="电话"> </el-table-column>
          <el-table-column prop="emp_status" label="禁用">
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.isDelete"
                @change="updateInfo(scope.row.id, scope.row.isDelete)"
              >
              </el-switch>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "customer",
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      customerList: [],
    };
  },
  created() {
    this.getCustomerList();
  },
  methods: {
    //获取顾客列表
    getCustomerList() {
      this.$axios({
        url: "http://localhost:5500/message/customer",
        params: this.queryInfo,
      })
        .then((res) => {
          this.total = res.data.totalpage[0].total;
          this.customerList = res.data.customers;
          for (let item of this.customerList) {
            if (item.isDelete == 1) {
              item.isDelete = true;
            } else {
              item.isDelete = false;
            }
          }
        })
        .catch((err) => err);
    },
    //删除用户 将禁用按钮打开
    updateInfo(id, status) {
      status = status == false ? 0 : 1;
      let isDelete = { status: status };
      this.$axios({
        method: "put",
        url: "http://localhost:5500/customer/" + id,
        data: isDelete,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.data == 1) this.$message.success("修改状态成功");
        })
        .catch((err) => err);
    },
    //页码改变函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCustomerList();
    },

  },
};
</script>

<style scopedd>
</style>