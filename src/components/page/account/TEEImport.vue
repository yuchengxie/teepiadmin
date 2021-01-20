<template>
  <el-col>
    <el-row>
      <el-col>
        <!-- <h3>导入</h3> -->
        <div class="crumbs">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              ><i class="el-icon-lx-warn"></i> 导入</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <el-row class="container">
      <el-col :span="24">
        <el-form :model="form">
          <el-form-item label="选择文件">
            <el-select
              v-model="selectFileName"
              placeholder="请选择需要导入的文件"
              @change="change"
              style="width: 200px"
            >
              <el-option
                v-for="(item, k) in files"
                :key="k"
                :value="item"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="btnTeeImport">导入</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import request from "../../../request";
import accstate from "./accstate";
export default {
  data() {
    return {
      form: {
        phone: "",
      },
      selectFileName: "",
      files: [],
    };
  },
  created() {
    this.getBakFiles();
  },
  computed: {
    onlineState() {
      return this.$store.state.teestate;
    },
  },
  methods: {
    async getBakFiles() {
      let r = await request.get(request.getBakFiles);
      console.log("r:", r);
      this.files = r;
    },
    change(value) {
      console.log("select:", value);
      this.file = value;
    },
    async btnTeeImport() {
      if (this.selectFileName == "") {
        this.$message.error("未选择导入文件");
        return;
      }
      let data = { file: this.selectFileName };
      let r = await request.post(request._import, data);
      const loading = this.$loading({
        text: "导入中",
      });

      if (r.data.result == "success") {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "导入成功",
          });
          loading.close();
          this.$router.push({
            path: "/account",
            params: { cmd: "import" },
          });
        }, 1000);
      }
    },
  },
};
</script>

<style>
</style>