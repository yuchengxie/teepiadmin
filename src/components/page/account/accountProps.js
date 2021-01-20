module.exports = {
  active: 0,
  isFinished: false,
  isDisplayClickLabel: false,
  clickStateText: "",
  _dev_pubkey33: "",
  time_count: 30,
  label_width3: "70px",
  form1: {
    phone: "18825239857",
    phoneCode: "", //接口
    verifyCode: "", //页面
  },
  form2: {
    word: "今晚打老虎",
  },
  form3: {
    passwd: "123456",
    passwd2: "123456",
  },
  headerTitle: "",
  // onlineState: "准备连接设备中...",
  // account: "",
  // centerDialogVisible: false,
  // centerDialogVisible2: false,
  // fullscreenLoading: false,
  // time_count: 5,
  // step: 1,
  // phone: '18825239857',
  // word: 'nice to meet you!',
  // title: '第一步 确认手机',
  // verifyCode: '',//动态绑定数据
  // phoneCode: '',//访问接口数据
  // form1: {
  //   phone: "13691792551",
  // },
  // form2: {
  //   word: "嗡嗡小蜜蜂",
  // },
  // form3: {
  //   // phone: "13691792551",
  //   passwd: "123456",
  //   passwd2: "123456",
  // },
  // formLabel1: [
  //   {
  //     model: "phone",
  //     label: "手机号码",
  //   },

  // ],
  // formLabel2: [
  //   {
  //     model: "word",
  //     label: "助记语", //输入最难忘的，最难猜到，这句话可用于恢复您的私钥
  //     type: "textarea",
  //   },
  // ],
  // formLabel3: [
  //   {
  //     model: "passwd",
  //     label: "密码",
  //   },
  //   {
  //     model: "passwd2",
  //     label: "确认密码",
  //   },
  // ],
  rules:
  {
    word: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }]
  }
}