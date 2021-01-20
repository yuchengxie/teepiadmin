/*
 * @Description: 
 * @Version: 1.0
 * @Author: xieyucheng
 * @Date: 2020-11-30 16:06:58
 * @LastEditors: xieyucheng
 * @LastEditTime: 2021-01-20 16:50:37
 */
import axios from 'axios'
let host, path;
let host_dev = 'http://localhost:5000'
let host_pro = 'https://www.nb-chain.cn';
// http://52.80.67.50:59887/static/minerdash/views/tee/account/account/account.html
console.log('location.href:', location.href);
var dev_id = location.href.split('/')[3];
console.log('dev_id:', dev_id);
if (dev_id.length < 20) {
  //开发环境
  host = host_dev;
} else {
  //正式环境
  host = host_pro + '/' + dev_id;
}

console.log('host:', host);

export default {
  teestate: host + '/teestate',
  clickstate: host + '/clickstate',
  sendPhoneCode: 'https://seb.pinwen.wang/v1/user/sendPhoneCode',
  setPhoneWord: host + '/setPhoneWord',
  setPhone: host + '/setPhone',
  setPayAcc: host + '/setPayAcc',
  _export: host + '/export',
  _import: host + '/import',
  delAcc: host + '/delAcc',
  syspro: host + '/syspro',
  reset: host + '/reset',
  getBakFiles: host + '/getBakFiles',
  getHexFiles: host + '/getHexFiles',

  getId: host + '/',

  getTEEState: getTEEState,

  get: (url, data) => {
    return new Promise((resolve, reject) => {
      return axios.get(url, data).then(res => {
        resolve(res.data);
      }).catch(err => {
        console.log('err:', err);
        reject(err);
      })
    })
  },
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      return axios.post(url, data).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
}

async function getTEEState() {
  return await this.get(this.teestate);
}