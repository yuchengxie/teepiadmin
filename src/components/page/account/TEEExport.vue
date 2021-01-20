<template>
  <el-col>
    <el-row>
      <el-col>
        <!-- <h3>导出</h3> -->
        <div class="crumbs">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              ><i class="el-icon-lx-warn"></i> 导出</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
        <!-- <div style="text-align: left; margin-bottom: 20px"></div> -->
      </el-col>
    </el-row>
    <el-row class="container">
      <el-col :lg="8" :md="8" :xl="8" :sm="12">
        <el-form
          :model="form"
          label-width="60px"
          :rules="rules"
          ref="exportForm"
        >
          <el-form-item label="文件" prop="filename">
            <el-input
              v-model="form.filename"
              placeholder="请输入文件名"
            ></el-input>
          </el-form-item>

          <el-form-item label="位置">
            <el-input v-model="form.idx" placeholder="请选择位置"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="passwd">
            <el-input
              v-model="form.passwd"
              show-password
              placeholder="请输入6位数字密码"
            ></el-input>
          </el-form-item>

          <el-form-item label="公钥" style="word-break: break-all; color: #888">
            <!-- <el-input v-model="form.pubkey" placeholder="请输入公钥"></el-input> -->
            <span>{{ form.pubkey }}</span>
          </el-form-item>

          <el-form-item style="text-align: right">
            <el-button type="primary" @click="btnTeeExport">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import request from "../../../request";
import accstate from "./accstate.js";
import tee from "../../../utils/tee";
export default {
  data() {
    return {
      form: {
        filename: "test_" + new Date().getTime(),
        passwd: "",
        // pubkey: "03d7bdd07a3d3d7180ec6d9a6adb29b2a249ad737b08f93dcfca986aeeab1bf894",
        pubkey: tee._platform_pubkey.toString("hex"), //暂时用平台公钥导出
        idx: 0,
      },
      phone: "",
      files: ["0", "1", "2"],
      selectFile: "",
      rules: {
        filename: [
          {
            required: true,
            message: "文件不能为空",
            trigger: "blur",
          },
        ],
        passwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 6, message: "长度须为6位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.form.filename = "0_" + this.onlineState.phone + ".dak";
  },
  computed: {
    onlineState() {
      return this.$store.state.teestate;
    },
    filename() {
      // return "0_" + this.onlineState.phone + ".dak";
      return this.selectFile + "_" + this.onlineState.phone + ".dak";
    },
  },
  methods: {
    change(value) {
      this.selectFile = value;
    },

    validForm(ref) {
      return new Promise((resolve, reject) => {
        return this.$refs[ref].validate((r) => {
          resolve(r);
        });
      });
    },

    async btnTeeExport() {
      // if (this.form.filename === "") {
      //   this.$message.error("文件名不能为空");
      //   return;
      // }
      let _valid = await this.validForm("exportForm");
      if (!_valid) return;
      let dev_pub = this.$store.state.teestate.pubkey;
      if (!dev_pub) {
        this.$message.error("账户异常,请检查TEE");
        return;
      }
      console.log("dev_pub:", dev_pub);
      // return;
      let _tee_export = tee.genCipherExport(
        //非dev_pub
        this.form.passwd,
        parseInt(this.form.idx),
        dev_pub,
        this.form.pubkey
      );
      console.log("_tee_export:", _tee_export);
      // return;
      let data = {
        flag: _tee_export[0],
        cipher: _tee_export[1],
        friend_pub33: this.form.pubkey,
        dev_pub33: dev_pub,
        filename: this.form.filename + ".dak",
      };
      // data['passwd'], int(data['idx']), data['friend_pub33']
      // let data = {
      //   passwd: this.form.passwd,
      //   idx: 0,
      //   friend_pub33: this.form.pubkey,
      //   filename: this.form.filename + ".dak",
      // };
      // bak_data = tee_thread.cmd_export_account2(
      //   data['flag'], data['cipher'], data['friend_pub33'])
      // console.log("data:", data);
      const loading = this.$loading({
        text: "导出中",
      });
      let r = await request.post(request._export, data);
      console.log("r:", r);

      if (r.data.result == "success") {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: this.phone + "备份成功",
          });
          loading.close();
        }, 1000);
      } else {
        loading.close();
        this.$message.error("导出异常:" + r.data.error.desc);
      }
    },
  },
};
</script>

<style>
</style>