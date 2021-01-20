<template>
  <div style="flex-direction: column; height: 100%">
    <el-row class="container">
      <!-- <el-col :xs="24" :sm="20" :md="20" :lg="16"> -->
      <el-col :xs="24" :sm="18" :md="14" :lg="11" :xl="8">
        <el-steps :active="active" finish-status="success">
          <el-step
            title="第一步"
            icon="el-icon-phone"
            description="TEE绑定手机"
          ></el-step>
          <el-step
            title="第二步"
            icon="el-icon-upload"
            description="填写助记词"
          ></el-step>
          <el-step
            title="第三步"
            icon="el-icon-wallet"
            description="设置支付密码"
          ></el-step>
          <el-step
            title="第四步"
            icon="el-icon-ice-cream-round"
            description="当前账户"
          ></el-step>
        </el-steps>
      </el-col>
    </el-row>

    <!-- 主体内容 -->
    <!-- <el-row style="display: flex; margin-top: 30px;background-color:#fff;padding:5px;"> -->
    <el-row class="container" style="margin-top: 10px">
      <el-col :xs="24" :sm="18" :md="14" :lg="11" :xl="8">
        <!-- <p style="margin-bottom: 20px">
          {{ onlineState }}
        </p> -->
        <!-- <p class="header_title" :style="active == 3 ? 'color:#64AEDB' : ''">
          {{ headerTitle }}
        </p> -->
        <transition name="htitle">
          <p class="header_title" :key="active">
            {{ headerTitle }}
          </p>
        </transition>

        <transition-group name="slide">
          <el-form :model="form1" v-if="active == 0" :key="active + 10">
            <el-form-item>
              <el-input v-model="form1.phone" placeholder="请输入手机号">
                <el-button
                  slot="append"
                  icon="el-icon-phone"
                  type=""
                  @click="sendPhoneCode"
                  >发送验证码</el-button
                >
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="form1.verifyCode"
                placeholder="请输入验证码"
                clearable
                maxlength="6"
              ></el-input>
            </el-form-item>
            <p class="tint">
              *
              为保护您的权益,此TEE已为实名挖矿,只有您本人真实手机绑定该设备,才能兑现挖矿收益,设备一旦绑定您的手机号,将不可再更改,请您再三仔细慎重核对,否则将可能造成不可挽回损失！
            </p>
          </el-form>
          <el-form :model="form2" v-if="active == 1" :key="active + 10">
            <!-- <el-form-item label=""></el-form-item> -->
            <p>
              您当前的绑定手机:<span
                style="font-weight: bold; font-size: 16px; font-style: italic"
                >{{ form1.phone }}</span
              >
            </p>
            <br />
            <el-input
              type="textarea"
              placeholder="请输入助记语"
              v-model="form2.word"
              maxlength="100"
              minlength="10"
              :show-word-limit="true"
              :autosize="{ minRows: 4, maxRows: 5 }"
            >
            </el-input>

            <p class="tint">
              *
              助记语,您可以输入一句您最难忘的,最难猜到的一句话,长度在15个字符以上,这句话至关重要,用于生成或恢复私钥。
            </p>
          </el-form>
          <el-form
            :model="form3"
            label-position="left"
            v-if="active == 2"
            :key="active + 10"
          >
            <el-form-item
              label="电话"
              :label-width="label_width3"
              style="margin-bottom: 5px"
            >
              <!-- <el-input disabled :value="onlineState.phone"></el-input> -->
              <label style="word-wrap: break-word">{{
                onlineState.phone
              }}</label>
            </el-form-item>
            <el-form-item
              label="公钥"
              :label-width="label_width3"
              style="margin-bottom: 10px"
            >
              <!-- <el-input
                type="textarea"
                disabled
                :value="onlineState.pubkey"
                :autosize="{ minRows: 3, maxRows: 4 }"
              ></el-input> -->
              <label style="word-wrap: break-word; line-height: 20px">{{
                onlineState.pubkey
              }}</label>
            </el-form-item>
            <el-form-item
              label="密码"
              :label-width="label_width3"
              style="margin-bottom: 10px"
            >
              <el-input
                v-model="form3.passwd"
                show-password
                placeholder="请输入6位数字的密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="label_width3">
              <el-input
                v-model="form3.passwd2"
                show-password
                placeholder="请再次确认密码"
              ></el-input>
            </el-form-item>
            <div>
              <p class="tint">
                *支付密码为6位长度的数字,等同于支付宝微信或者银行密码，是支付转账中常用的快捷口令,请牢记您设置的支付密码
              </p>
            </div>
          </el-form>

          <!-- <div v-if="active == 4">{{ onlineState }} -- {{ isSaveEffect }}</div> -->
          <el-form v-if="active == 3" :key="active + 10">
            <el-form-item label="电话:" style="margin-bottom: 0px">
              <span>{{ onlineState.phone }}</span>
            </el-form-item>
            <!-- <el-divider></el-divider> -->
            <el-form-item label="公钥:" style="margin-bottom: 0px">
              <span style="word-break: break-all">{{
                onlineState.pubkey
              }}</span>
            </el-form-item>
            <!-- <el-divider></el-divider> -->
            <el-form-item label="密码:" style="margin-bottom: 0px">
              <span>{{ onlineState.pwd }}</span>
            </el-form-item>
            <!-- <el-divider></el-divider> -->
            <el-form-item
              v-if="isDisplayClickLabel"
              label="按键:"
              style="margin-bottom: 0px"
            >
              <span v-html="clickStateText"></span>
            </el-form-item>
          </el-form>
        </transition-group>
        <div style="margin-top: 20px; text-align: right" v-if="active < 3">
          <el-button type="primary" @click="next">下一步</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "../../../request";
import accstate from "./accstate.js";
import { onlineState } from "./accountProps";
import tee from "../../../utils/tee";
import accountProps from "./accountProps";
export default {
  components: {},
  watch: {
    active(val) {
      this.setHeaderTitle();
    },
  },
  data() {
    return accountProps;
  },
  async created() {
    // console.log("created:", this.$route.params);
    // if(this.$route.params.cmd === 'import'){

    //   this.loopClickState("CLK_SAVE_PSW_ACCOUNT...");
    // }

    this.init(this);
    let that = this;
    this.$store.$on("stateChange", function () {
      that.init(that);
    });
  },
  computed: {
    onlineState() {
      console.log("this.$store.state.teestate:", this.$store.state.teestate);
      return this.$store.state.teestate;
    },
  },
  methods: {
    goback() {
      console.log("back");
      history.back();
    },
    async sendPhoneCode() {
      if (this.onlineState != accstate.STATE_NO_ACCOUNT) {
        this.$message.error("错误操作,请检查TEE");
        return;
      }
      let data = { phone: this.form1.phone };
      //phone verify
      let r = await request.post(request.sendPhoneCode, data);
      console.log("sendPhoneCode r:", r);
      if (r.data.result.msg) {
        //ok
        this.form1.phoneCode = r.data.result.msg;
        console.log("this.phoneCode:", this.form1.phoneCode);
      }
    },
    next() {
      console.log("this.active:", this.active);
      if (this.active === 0) {
        this.setPhone(); //设置手机并验证手机合法
      } else if (this.active === 1) {
        this.setPhoneWord(); //设置助记词，也就是创建dev用户
      } else if (this.active === 2) {
        this.setPasswd(); //设置支付密码
      }
    },
    async setPhone() {
      this.$confirm(
        "为保护您的权益,此TEE已为实名挖矿,只有您本人真实手机绑定该设备,才能兑现挖矿收益,设备一旦绑定您的手机号,将不可再更改,请您再三仔细慎重核对,否则将可能造成不可挽回损失！",
        "请再次确认手机号:" + this.form1.phone,
        {
          confirmButtonText: "确定无误",
          cancelButtonText: "再想想",
          type: "warning",
        }
      )
        .then((res) => {
          let data = { phone: this.form1.phone };
          console.log("data:", data);
          //setPhone
          request.post(request.setPhone, data).then((r) => {
            console.log("setPhone r:", r);
            if (r.data.result == "success") {
              // 手机注册成功
              this.active = 1;
            }
          });
        })
        .catch(() => {});
    },
    async setPhoneWord() {
      this.$confirm("填写助记语,创建后不可修改?", "填写助记语", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log("this.form1.phone:", this.form1.phone, this.form2.word);
          let __r = tee.genCipherByWord(this.form1.phone, this.form2.word);
          console.log("cipher:", __r);
          let data = {
            phone: this.form1.phone,
            cipher: __r[1],
            flag: __r[0],
          };
          // let data = { phone: this.form1.phone, word: this.form2.word };
          request.post(request.setPhoneWord, data).then((r) => {
            console.log("r:", r);
            if (r.data.result == "success") {
              const loading = this.$loading({
                // lock: true,
                text: "正在创建根账户,请等待",
                // spinner: "el-icon-loading",
                // background: "rgba(0,0,0,0.1)",
              });
              // 手机助记词成功
              var sec_start = new Date().getSeconds();
              console.log("sec_start:", sec_start);
              var t = setInterval(() => {
                var sec_current = new Date().getSeconds();
                console.log(
                  "查看是否超时,默认设置10秒超时:",
                  sec_current - sec_start
                );
                if (sec_current - sec_start >= 10) {
                  console.log("超时,不处理了，返回");
                  clearInterval(t);
                }
                if (!this.onlineState.pubkey) {
                  console.log("未发现pubkey");
                } else {
                  setTimeout(() => {
                    console.log("发现了pubkey:", this.onlineState.pubkey);
                    this.active = 2;
                    loading.close();
                    clearInterval(t);
                  }, 1000);
                }
              }, 2000);
            }
          });
        })
        .catch(() => {});
    },
    async setPasswd() {
      this.$confirm("设置的六位数支付密码,您确定记住了吗?", "设置支付密码", {
        confirmButtonText: "记住了",
        cancelButtonText: "再想想",
        type: "warning",
      })
        .then((res) => {
          let dev_pub = this.onlineState.pubkey;
          console.log("dev_pub:", dev_pub);
          let pswCipher = tee.genCipherByPsw(dev_pub, this.form3.passwd);
          console.log("pswCipher:", pswCipher);
          let pswCipher_data = { flag: pswCipher[0], cipher: pswCipher[1] };

          console.log("pswCipher_data:", pswCipher_data);
          request.post(request.setPayAcc, pswCipher_data).then((r) => {
            console.log("setPayAcc r:", r);
            // this.centerDialogVisible = false;
            if (r.data.result === "success") {
              this.active = 3;
              console.log("待处理逻辑");
              this.loopClickState("CLK_SAVE_PSW_ACCOUNT");
            } else {
              this.$message.error("设置密码错误");
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
          this.isDisplayClickLabel = true;
          console.log("res:", res);
          if (res.click_res == type) {
            clearInterval(t);
            this.clickStateText = "已按下保存按钮,创建账户成功保存至TEE";
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
    async init(that) {
      const { state } = that.onlineState;
      if (
        state === accstate.STATE_ERR_NO_CARD ||
        state === accstate.STATE_NO_ACCOUNT ||
        state === accstate.STATE_ERR_UNKNOWN ||
        state === accstate.STATE_ERR_INTERNAL
      ) {
        that.active = 0;
        console.log("有插拔卡,按钮显示初始化不显示了");
        that.isDisplayClickLabel = false;
      } else if (state === accstate.STATE_NO_PASSWD) {
        that.active = 2;
      } else if (state === accstate.STATE_NORMAL) {
        that.active = 3;
      }
      that.setHeaderTitle();
    },
    setHeaderTitle() {
      switch (this.active) {
        case 0:
          this.headerTitle = "第一步 TEE绑定手机";
          break;
        case 1:
          this.headerTitle = "第二步 填写助记语";
          break;
        case 2:
          this.headerTitle = "第三步 设置支付密码";
          break;
        case 3:
          this.headerTitle = "第四步 当前账户";
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
.header_title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}
.tint {
  margin-top: 10px;
  font-size: 12px;
  color: #e34e47;
  line-height: 16px;
  font-weight: 500;
}
.next_btn {
  text-align: right;
  /* text-align: center; */
  /* text-align: left; */
  position: relative;
  margin-top: 30px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.el-loading-spinner .el-loading-text {
  font-size: 20px;
  color: #60addd;
}

.el-divider--horizontal {
  margin: 0;
}
/* .el-form-item__label {
  line-height: 40px;
}
.el-form-item__content {
  line-height: 40px;
} */

.slide-enter-active {
  transition: all 0.5s ease-in;
  opacity: 0.5;
}
.slide-leave-active {
  /* transition: all 0s linear; */
}
.slide-enter {
  /* opacity: 0;
  transform: translateX(100px) ease; */
  opacity: 0;
  transform: translateX(100px);
}
.slide-leave-to {
  /* opacity: 0; */
}

.htitle-enter-active {
  transition: all 0.5s ease-in;
  opacity: 0.5;
}
.htitle-leave-active {
  /* transition: all 0 ease-out; */
}

.htitle-enter {
  opacity: 0;
  transform: translateX(100px);
}
.htitle-leave-to {
  /* transform: translateX(110%); */
  /* transform: translateX(100%); */
  opacity: 0;
}
</style>