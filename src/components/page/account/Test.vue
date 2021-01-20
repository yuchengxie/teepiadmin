<template>
  <el-form>
    <!-- <el-form-item>
      {{ onlineState }}
    </el-form-item> -->
    <el-form-item label="选择二进制文件">
      <el-select
        v-model="selectFile"
        placeholder="请先选择二进制文件"
        style="width: 300px"
        @change="change"
      >
        <el-option
          v-for="(item, k) in files"
          :key="k"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="" @click="syspro" plain>生成程序文件</el-button>
    </el-form-item>
    <!-- <el-divider></el-divider> -->

    <el-form-item>
      <el-button type="" @click="delAcc" plain>重新烧录程序</el-button>
    </el-form-item>
    <!-- <el-divider></el-divider> -->

    <el-progress
      style="margin-top: 20px"
      :text-inside="true"
      :stroke-width="22"
      :percentage="percentage"
      status="success"
      v-show="percentage > 0"
    ></el-progress>

    <el-form-item>
      <el-button type="" @click="reset">清除支付密码</el-button>
    </el-form-item>

    <!-- <el-divider></el-divider> -->

    <el-form-item>
      <el-button @click="clickTee">模拟点击</el-button>
    </el-form-item>
    <!-- <el-divider></el-divider> -->

    <el-form-item>
      <el-button
        type=""
        @click="openFullScreen1"
        v-loading.fullscreen.lock="fullscreenLoading"
        >loading</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import request from "../../../request";
export default {
  methods: {
    async openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    async clickTee() {
      let r = await request.get(request.clickstate);
      console.log("clickTee:", r);
      this.$store.commit("setClickState", r);
      // const loading = this.$loading({
      //   lock: true,
      //   text:
      //     "请在3秒内按下TEE的按钮进行账号保存,若不按保存,掉电后,数据会丢失。剩余时间: " +
      //     3 +
      //     " 秒",
      //   // spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)",
      // });
      // setTimeout(() => {
      //   loading.close();
      // }, 3000);
    },
    change(value) {
      this.selectFile = value;
    },
    async reset() {
      let data = { passwd: "123456" };
      let r = await request.post(request.reset, data);
      console.log("reset:", r);
      // this.getOnlineState();
    },
    async delAcc() {
      request.get(request.delAcc);
      var t = setInterval(() => {
        this.percentage += Math.floor(Math.random() * 5 + 1);
        if (this.percentage >= 100) {
          clearInterval(t);
          this.percentage = 0;
          this.$message({
            type: "success",
            message: "烧录完成",
          });
        }
      }, 1000);
    },
    async syspro() {
      if (!this.selectFile) {
        this.$message.error("未选择文件");
        return;
      }
      let data = { filename: this.selectFile };
      request.post(request.syspro, data);
      this.$message({ type: "success", message: "生成成功" });
    },
    async getHexFiles() {
      let r = await request.get(request.getHexFiles);
      console.log("r:", r);
      this.files = r;
    },
  },
  created() {
    this.getHexFiles();
  },
  computed: {
    onlineState() {
      return this.$store.state.teestate;
    },
  },
  data() {
    return {
      // onlineState: "准备连接设备中...",
      selectFile: "",
      files: [],
      percentage: 0,
      fullscreenLoading: false,
      formData: {
        visitorName: "",
        cardType: 1,
        cardCode: "",
      },
      rule: {
        visitorName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "姓名不支持特殊字符",
            trigger: "blur",
          },
        ],
        cardCode: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            min: 15,
            max: 18,
            message: "请如实填写18位号码，以供学校保卫科核对",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "请输入正确的身份证号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>

<style>
.dialog_foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 25px;
}
</style>