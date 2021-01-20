<template>
  <el-col>
    <el-row>
      <el-col>
        <div class="crumbs">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              ><i class="el-icon-lx-warn"></i>修改密码</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>

    <el-row class="container">
      <el-col :lg="8" :md="8" :xl="8" :sm="12">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="form"
          ref="modifyForm"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码" prop="oldPwd">
            <el-input
              type="password"
              v-model="form.oldPwd"
              placeholder="请输入旧密码"
              maxlength="6"
              minlength="6"
              show-password
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="newPwd">
            <el-input
              v-model="form.newPwd"
              placeholder="请输入新密码"
              maxlength="6"
              minlength="6"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPwd">
            <el-input
              v-model="form.confirmNewPwd"
              placeholder="请再次输入新密码"
              maxlength="6"
              minlength="6"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="按键" v-if="isDisplayClickLabel">
            <span v-html="clickStateText"></span
          ></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="modifyPwdHandle">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import accstate from "./accstate";
import tee from "../../../utils/tee";
import request from "../../../request";
export default {
  data() {
    var validConfirm = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      clickStateText: "",
      isDisplayClickLabel: false,
      time_count: 30,
      form: {
        oldPwd: "",
        newPwd: "",
        confirmNewPwd: "",
      },
      rules: {
        oldPwd: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, max: 6, message: "长度须为6位", trigger: "blur" },
        ],
        newPwd: [
          { required: true, message: "请输入长度6位的新密码", trigger: "blur" },
          { min: 6, max: 6, message: "长度须为6位", trigger: "blur" },
        ],
        confirmNewPwd: [
          {
            required: true,
            message: "请输入长度6位的确认密码",
            trigger: "blur",
          },
          { validator: validConfirm, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    onlineState() {
      console.log("this.$store.state.teestate:", this.$store.state.teestate);
      return this.$store.state.teestate;
    },
  },
  methods: {
    modifyPwdHandle() {
      if (this.onlineState.state !== accstate.STATE_NORMAL) {
        console.log("当前TEE账户不存在");
        this.$message.error("当前账户异常,无法修改,请检查TEE,再操作");
        return;
      }

      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          console.log("都校验通过了");
          //TODO
          this.setNewPasswd();
        } else {
          console.log("有数据校验未通过");
        }
      });
      // console.log("123");
    },

    async setNewPasswd() {
      this.$confirm("修改的六位数支付密码,您确定记住了吗?", "修改支付密码", {
        confirmButtonText: "记住了",
        cancelButtonText: "再想想",
        type: "warning",
      })
        .then((res) => {
          let dev_pub = this.onlineState.pubkey;
          console.log("dev_pub:", dev_pub);
          // let pswCipher = tee.genCipherByPsw(this.form.passwd, dev_pub);
          let pswCipher = tee.genCipherByPsw(
            dev_pub,
            this.form.newPwd,
            this.form.oldPwd
          );
          console.log("pswCipher:", pswCipher);
          let pswCipher_data = { flag: pswCipher[0], cipher: pswCipher[1] };
          // console.log("pswCipher_data:", pswCipher_data);
          request.post(request.setPayAcc, pswCipher_data).then((r) => {
            console.log("setPayAcc r:", r);
            // this.centerDialogVisible = false;
            if (r.data.result === "success") {
              this.active = 3;
              //无需确认保存按键
              this.loopClickState("CLK_SAVE_PSW_ACCOUNT");
            } else {
              console.log("error:", r.data.error);
              this.$message.error("修改密码失败:" + r.data.error.desc);
            }
          });
        })
        .catch((e) => {
          return;
        });
    },

    async loopClickState(type) {
      this.clickStateText = "";
      var t = setInterval(() => {
        request.get(request.clickstate).then((res) => {
          console.log("res:", res);
          this.isDisplayClickLabel = true;
          if (res.click_res == type) {
            clearInterval(t);
            this.clickStateText = "已按下保存按钮,修改成功";
            console.log("修改成功");
            this.$message.success("修改成功");
          } else {
            if (this.time_count >= 1) {
              this.time_count--;
              this.clickStateText =
                "<span>请点击TEE保存按钮,剩余" +
                "<span style='color:red;font-weight:bold;font-style:italic'>" +
                this.time_count +
                " </span>秒" +
                "</span>";
            } else {
              this.clickStateText = "按键超时,请拔出TEE,避免后续操作，受残留数据影响";
              this.time_count = 30;
              clearInterval(t);
            }
          }
        });
      }, 1000);
    },
  },
};
</script>

<style>
</style>