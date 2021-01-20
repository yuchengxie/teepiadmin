<template>
  <div>
    <el-button type="" @click="showMask">遮罩</el-button>
    <div>
　　   <el-button @click="show = 0">第一个</el-button>
      <el-button @click="show = 2">第二个</el-button>
      <el-button @click="show = 3">第三个</el-button>
    </div>
    <transition-group name="slide">
      <!-- <p>title_{{show}}</p> -->
      <div v-if="show == 0" key="0">
        <p>第一个文本</p>
        <p>第一个文本</p>
        <p>第一个文本</p>
      </div>
      <div v-if="show == 2" key="2">
        <p>第二个文本</p>
        <p>第二个文本</p>
        <p>第二个文本</p>
        <p>第二个文本</p>
        <p>第二个文本</p>
      </div>
      <div v-if="show == 3" key="3">
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
        <p>第三个文本</p>
      </div>
    </transition-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: 0,
    };
  },
  methods:{
    showMask(){
      const loading = this.$loading({
        text:'hello',
      })
      setTimeout(() => {
        loading.close();
      }, 3000);
    }
  }
};
</script>
<style>
.slide-enter-active {
  transition: all 1s linear;
  opacity: 0.5;
}
.slide-leave-active {
  transition: all 0s linear;
}
.slide-enter {
  opacity: 0;
  transform: translateY(100%)
}
.slide-leave-to {
  /* transform: translateX(110%); */
  /* transform: translateX(100%); */
  opacity: 0;
}
</style>