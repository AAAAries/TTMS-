<template>
  <div id="middle">
    <div
      class="container"
      :class="{ 'right-panel-active': isActive }"
      id="container"
    >
      <div class="form-container sign-up-container">
        <form>
          <h1>注册</h1>
          <input autocomplete="off" type="text" id="ruser" placeholder="用户名" />
          <input autocomplete="off" type="tel" id="rtel" placeholder="电话" />
          <input type="password" id="rpwd" placeholder="密码" />
          <button type="button" @click="register">注册</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form>
          <h1>登录</h1>
          <input autocomplete="off" type="tel" id="ltel" placeholder="电话" />
          <input type="password" id="lpwd" placeholder="密码" />
          <button type="button" @click="login">登录</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>欢迎回来</h1>
            <p>与我们保持联系请登录您的个人信息</p>
            <button class="ghost" id="signIn" @click="signInButton">
              登录
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>欢迎光临</h1>
            <p>输入您的个人资料，并与我们一起开始旅程</p>
            <button class="ghost" id="signUp" @click="signUpButton">
              注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    signUpButton() {
      this.isActive = true;
    },
    signInButton() {
      this.isActive = false;
    },
    register() {
      // console.log("注册");
      let ruser = document.getElementById("ruser").value;
      let rtel = document.getElementById("rtel").value;
      let rpwd = document.getElementById("rpwd").value;
      if (!ruser) {
        this.$message.warning("用户名不能为空");
        return;
      }
      if (!rtel) {
        this.$message.warning("电话不能为空");
        return;
      }
      if (!rpwd) {
        this.$message.warning("密码不能为空");
        return;
      }
      if (!/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(rtel)) {
        this.$message.error("手机号码有误，请重填");
        return;
      }
      if (rpwd.length < 4 || rpwd.length > 8) {
        this.$message.error("密码位数为4-8位");
        return;
      }
      let obj = { ruser, rtel, rpwd };
      this.$axios({
        method: "post",
        url: "http://localhost:5500/cregister",
        data: obj,
      }).then(res => {
        console.log(res.data);
        if(res.data == 1){
          this.$message.success("注册成功");
          //将登录状态储存在cookies中
          this.$store.commit('addtel',rtel)
          this.$router.go(-1)
        }
        if(res.data == 0){
          this.$message.error("手机号码重复 请重新输入");
          document.getElementById("rtel").value = ""
        }
      }).catch(err => err)
    },
    login(){
      let ltel = document.getElementById("ltel").value;
      let lpwd = document.getElementById("lpwd").value;
      let obj = { ltel, lpwd };
      this.$axios({
        method:'get',
        url: "http://localhost:5500/clogin",
        params: obj,
      }).then(res => {
        // console.log(res.data);
        if(res.data.state == 1){
          this.$message.success("登录成功");
          //将登录状态储存在cookies中
          this.$store.commit('addtel',res.data.tel)
          this.$router.go(-1)
        }
        if(res.data.state == 0){
          this.$message.error("用户不存在 请重新输入");
          document.getElementById("ltel").value = ""
          document.getElementById("lpwd").value = ""
        }
        if(res.data.state == -1){
          this.$message.error("密码错误 请重新输入");
          document.getElementById("lpwd").value = ""
        }
        if(res.data.state == 2){
          this.$message.error("用户已被封号");
          document.getElementById("ltel").value = ""
          document.getElementById("lpwd").value = ""
        }
      }).catch(err => err)
    }
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#middle {
  font-family: "Montserrat", sans-serif;
  background: #f6f5f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/img/1.jpg");
  background-size: cover;
}

h1 {
  font-weight: bold;
  margin: 0;
  color: beige;
}

p {
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
  color: beige;
}

a {
  color: #fff;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.container {
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  opacity: 0.8;
}

.form-container form {
  background: rgba(45, 52, 54, 1);
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

.form-container input {
  background: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

button {
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background: #ff4b2b;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 45px;
  margin-top: 20px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

input[type="text"] {
  width: 240px;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  font-family: "PLay", sans-serif;
  font-size: 16px;
  font-weight: 200px;
  padding: 10px 0;
  transition: border 0.5s;
  outline: none;
  color: #fff;
  font-weight: bold;
}

input[type="password"] {
  width: 240px;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  font-family: "PLay", sans-serif;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  transition: border 0.5s;
  outline: none;
  color: #fff;
}

input[type="tel"] {
  width: 240px;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  font-family: "PLay", sans-serif;
  font-size: 16px;
  font-weight: 200px;
  padding: 10px 0;
  transition: border 0.5s;
  outline: none;
  color: #fff;
  font-weight: bold;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background: transparent;
  border-color: #ff4b2b;
  background-color: #ff4b2b;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background: transparent;
  background: linear-gradient(to right, #ff4b2b, #ff416c) no repeat 0 0 / cover;
  color: #fff;
  position: absolute;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.overlay-left {
  transform: translateX(-20%);
}

/*....Animation....*/

/*....Move signin to the right....*/
.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

/*....Move overlay to the left....*/
.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

/*....Bring sign up over sign in....*/
.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

/*...Move overlay back to right....*/
.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}
</style>