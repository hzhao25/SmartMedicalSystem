<template>
  <div>
    <el-descriptions class="margin-top" title="用户信息" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-user"></i>
          性别
        </template>
        {{ sex }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-user"></i>
          年龄
        </template>
        {{ age }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        {{ phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-mobile-phone"></i>
          身份证
        </template>
        {{ codeid }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-location-outline"></i>
          居住地
        </template>
        {{ address }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-tickets"></i>
          状态
        </template>
        <el-tag size="small">{{ status }}</el-tag>
      </el-descriptions-item>
      <!-- 通行码 -->
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-tickets"></i>
          通信码
        </template>
        <el-image
          style="width: 100px; height: 100px"
          :src="qrImage"
        ></el-image>
      </el-descriptions-item>
      <!-- 通行码 -->
    </el-descriptions>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      size: "",
      // user的信息
      name: "",
      qrImage:"",
      sex: "",
      age: "",
      codeid: "",
      phone: "",
      address: "",
      qrcode: "",
      status: "",
    };
  },
  // 当vue对象创建后，触发操作
  created() {
    // 获取登录用户信息
    var userJson = JSON.parse(Cookies.get("user"));
    // 赋值到data中
    this.name = userJson.name;
    this.sex = userJson.sex;
    this.age = userJson.age;
    this.codeid = userJson.codeid;
    this.qrImage='http://localhost:8088/user/code?userid='+userJson.id;
    this.phone = userJson.phone;
    this.address = userJson.address;
    this.qrcode = userJson.qrcode;
    this.status = userJson.status;
    this.role = Cookies.get("role");
  },
};
</script>