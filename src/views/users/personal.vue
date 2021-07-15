<template>
  <div class="rmiddle">
    <div class="htitle">基本信息</div>
    <div class="mainInfo">
      <div id="img"></div>
      <div id="tel">{{ $store.state.tel }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "personal",
  data() {
    return {};
  },
  mounted() {
    let img = document.getElementById("img");
    img.style.backgroundColor = this.getRandomColor();
  },
  methods: {
    getRandomColor() {
      return (
        "#" +
        ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(
          -6
        )
      );
    },
  },
};
</script>

<style scoped>
.rmiddle {
  margin: 40px;
}
.rmiddle .htitle {
  width: 100%;
  font-size: 20px;
  color: rgb(136, 9, 9);
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 10px;
}
.mainInfo{
  position: relative;
}
#img {
  margin: 30px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: palegoldenrod;
}
#tel{
  float: right;
  position: absolute;
  font-size: 24px;
  top: 40px;
  left: 50%;
}
</style>