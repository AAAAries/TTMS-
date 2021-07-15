<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售额统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
const echarts = require("echarts");

export default {
  name: "count",
  data() {
    return {};
  },
  created() {},
  // 此时页面上的元素已经被渲染完毕
  mounted() {
    //3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    //4. 指定图表的配置项和数据
    var option = {
      //标题
      title: {
        text: "销售额统计",
      },
      //工具箱
      //保存图片
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
          },
        },
      },
      //图例-每一条数据的名字叫销量
      legend: {
        data: ["销量"],
      },
      grid: {
        // left: "10%",
        // bottom: "35%",
        y2:140
      },
      //x轴
      xAxis: {
        data: [
          "情书",
          "悬崖之上",
          "我的姐姐",
          "钱学森",
          "秘密访客",
          "猫和老鼠",
          "哥斯拉大战金刚",
        ],
        axisLabel: {
          interval: 0,
          rotate: 40,
        },
      },
      //y轴没有显式设置，根据值自动生成y轴
      yAxis: {},
      //数据-data是最终要显示的数据
      series: [
        {
          name: "销量",
          type: "line",
          data: [40, 20, 35, 60, 55, 10, 33],
        },
      ],
    };

    //5.展示数据 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
  methods: {},
};
</script>

<style>
</style>