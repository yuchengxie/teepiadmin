<template>
  <div class="bg">
    <div class="drag"><h1>Window</h1></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    test() {
      console.log("123");
    },
    addClass() {
      this.show = true;
      setTimeout(() => {}, timeout);
    },
  },
};
</script>
<style>
/*背景模糊*/

.bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3065707914,2864842591&fm=26&gp=0.jpg")
    no-repeat;
  background-size: 100% 100%;

  padding: 1px;
  box-sizing: border-box;
  z-index: 1;
}
.bg:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: blur(10px);
  z-index: 2;
}
.drag {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  text-align: center;
  z-index: 11;
}
</style>