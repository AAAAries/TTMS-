<template>
  <div class="footer">
    <div class="footWrap">
      <div class="footMiddle">
        <div class="footLogo">
          <div id="img">汉唐</div>
          <span>如果您是消费者，</span>
          <span>请拨打0571-88157838</span>
          <span>如果您是影院/合作商家，</span>
          <span>请拨打400-825-9220</span>
          <span>(服务时间:9:00-21:00)</span>
        </div>
        <dl>
          <dt>选座购票流程</dt>
          <dd>选择影片和场次</dd>
          <dd>选择中意的座位</dd>
          <dd>支付并收到取票短信</dd>
        </dl>
        <dl>
          <dt>取票流程</dt>
          <dd>收到取票短信</dd>
          <dd>影院自助取票</dd>
          <dd>短信重发方式</dd>
        </dl>
        <dl>
          <dt>常见问题</dt>
          <dd>是否支持退换票</dd>
          <dd>填错手机号怎么办</dd>
          <dd>更多问题>></dd>
        </dl>
        <dl>
          <dt>协议规范</dt>
          <dd>用户服务协议</dd>
          <dd>食品管理规范</dd>
          <dd>隐私权政策</dd>
          <dd>退改签服务费规范</dd>
        </dl>
				<div class="clear"></div>
      </div>
      <div class="footBottom">
        <div class="footer-ali">
          阿里巴巴集团<b>|</b>阿里巴巴国际站<b>|</b>阿里巴巴中国站<b>|</b>全球速卖通<b>|</b>淘宝网<b>|</b>天猫<b>|</b>聚划算<b>|</b>一淘<b>|</b>阿里妈妈<b>|</b>阿里云计算<b>|</b>云OS<b>|</b>万网<b>|</b>中国雅虎<b>|</b>支付宝
        </div>
        <div class="footer-nav">
          关于淘宝 合作伙伴 营销中心 联系客服 开放平台 诚征英才 联系我们
          网站地图 法律声明 &copy; 2021 Hantang.com 版权所有 <br />
          增值电信业务经营许可证：沪B2-20170117 沪ICP备16050036号-1 营业执照<br />
          违法不良信息举报电话 0571-88157838 <br />
          违法不良信息举报邮箱 hantang_tousu@list.alibaba-inc.com
        </div>
        <div class="footer-copy">沪公网安备 31010102006472号</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterWrap",
  data() {
    return {};
  },
};
</script>

<style scoped>
.footer {
  background-color: rgba(0, 0, 0, 0.8);
  color: rgb(223, 220, 220);
  position: absolute;
  /* position: relative; */
  width: 100%;
  right: 0;
  /* bottom: 70px; */
}

.footWrap {
  width: 60%;
  margin: 0 auto;
  font-size: 13px;
}

.footMiddle {
  width: 100%;
  padding-top: 20px;
}

.footLogo {
  float: left;
  width: 150px;
  margin-right: 55px;
}
#img {
  font-size: 26px;
  color: #fff;
  font-weight: bold;
  text-align: center;
}
.footLogo span {
  display: block;
  width: 100%;
  text-align: center;
  color: #9a9a9a;
}

.footWrap dl {
  float: left;
  width: 170px;
}
.footWrap dl dt {
  font-size: 14px;
  color: #fff;
  font-weight: 600;
  padding-bottom: 5px;
}

.footWrap dl dd {
  color: #9a9a9a;
  padding-bottom: 6px;
}
.footBottom {
  display: block;
  width: 100%;
}
.footBottom .footer-ali {
  border-top: 2px solid #6d6d6d;
  margin-top: 15px;
  padding-top: 15px;
  color: #6d6d6d;
  padding-bottom: 15px;
}
.footBottom .footer-ali b {
  display: inline-block;
  margin: 1px 5px;
}
.footBottom .footer-nav {
  color: #6d6d6d;
  padding-bottom: 20px;
}
.footBottom .footer-copy {
  display: block;
  position: absolute;
  color: #666;
  bottom: -65px;
  left: 43%;
  height: 40px;
}
.clear {
  clear: both;
}
</style>