<template>
  <div class="user-info-container">
    <el-descriptions class="margin-top" title="用户信息" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="用户名">
        <template>
          <i class="el-icon-user"></i>
        </template>
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item label="性别">
        <template>
          <i class="el-icon-gender"></i>
        </template>
        {{ sex }}
      </el-descriptions-item>
      <el-descriptions-item label="年龄">
        <template >
          <i class="el-icon-age"></i>
        </template>
        {{ age }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        <template>
          <i class="el-icon-mobile-phone"></i>
        </template>
        {{ phone }}
      </el-descriptions-item>
      <el-descriptions-item label="身份证">
        <template>
          <i class="el-icon-codeid"></i>
        </template>
        {{ codeid }}
      </el-descriptions-item>
      <el-descriptions-item label="居住地">
        <template>
          <i class="el-icon-location-outline"></i>
        </template>
        {{ address }}
      </el-descriptions-item>
      <el-descriptions-item label="状态"> 
        <template>
          <i class="el-icon-tickets">状态</i>
        </template>
        <el-tag size="small">{{ statusText }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="通信码">
        <template>
          <i class="el-icon-tickets"></i>
        </template>
        <el-image class="qr-image" :src="qrImage"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      // user的信息
      name: "",
      qrImage: "",
      sex: "",
      age: "",
      codeid: "",
      phone: "",
      address: "",
      qrcode: "",
      status: "",
    };
  },
  created() {
    var userJson = JSON.parse(Cookies.get("user"));
    this.name = userJson.name;
    this.sex = userJson.sex;
    this.age = userJson.age;
    this.codeid = userJson.codeid;
    this.qrImage = "http://localhost:8088/user/code?userid=" + userJson.id;
    this.phone = userJson.phone;
    this.address = userJson.address;
    this.qrcode = userJson.qrcode;
    this.status = userJson.status;
  },
  computed: {
    statusText() {
      switch (this.status) {
        case 1:
          return "绿码";
        case 2:
          return "黄码";
        case 3:
          return "红码";
        default:
          return "未知状态";
      }
    },
  },
};
</script>

<style scoped>
.user-info-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.margin-top {
  margin-top: 20px;
}

.el-descriptions {
  font-size: 14px;
}

.el-descriptions-item {
  padding: 10px 0;
}

.qr-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>