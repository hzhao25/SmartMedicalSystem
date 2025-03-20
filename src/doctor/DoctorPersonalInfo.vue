<template>
  <div class="doctor-info-container">
    <el-descriptions class="margin-top" title="医生信息" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="姓名">
        <template>
          <i class="el-icon-user"></i>
        </template>
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item label="专业">
        <template>
          <i class="el-icon-medical"></i>
        </template>
        {{ major }}
      </el-descriptions-item>
      <el-descriptions-item label="毕业院校">
        <template>
          <i class="el-icon-school"></i>
        </template>
        {{ school }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        <template>
          <i class="el-icon-mobile-phone"></i>
        </template>
        {{ phone }}
      </el-descriptions-item>
      <el-descriptions-item label="科室编号">
        <template>
          <i class="el-icon-hospital"></i>
        </template>
        {{ department_id }}
      </el-descriptions-item>
      <el-descriptions-item label="所属医院编号">
        <template>
          <i class="el-icon-hospital"></i>
        </template>
        {{ host_id }}
      </el-descriptions-item>
      <el-descriptions-item label="等待接诊">
        <template>
          <i class="el-icon-time"></i>
        </template>
        {{ wait_nums }}
      </el-descriptions-item>
      <el-descriptions-item label="状态"> 
        <template>
          <i class="el-icon-tickets"></i>
        </template>
        <el-tag size="small">{{ statusText }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="头像">
        <template>
          <i class="el-icon-picture"></i>
        </template>
        <el-image class="doctor-image" :src="imageUrl"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      // doctor的信息
      name: "",
      major: "",
      school: "",
      phone: "",
      department_id: 0,
      host_id: 0,
      wait_nums: 0,
      status: 0,
      imageUrl: "",
    };
  },
  created() {
    var doctorJson = JSON.parse(Cookies.get("user")); // Assume doctor info is stored in cookies
    this.name = doctorJson.name;
    this.major = doctorJson.major;
    this.school = doctorJson.school;
    this.phone = doctorJson.phone;
    this.department_id = doctorJson.departmentId;
    console.log(doctorJson)
    this.host_id = doctorJson.hostId;
    this.wait_nums = doctorJson.waitNums;
    this.status = doctorJson.status;
    this.imageUrl = doctorJson.image; // Assuming image URL is stored in doctorJson
  },
  computed: {
    statusText() {
      switch (this.status) {
        case 1:
          return "在职";
        case 2:
          return "休假";
        case 3:
          return "离职";
        default:
          return "未知状态";
      }
    },
  },
};
</script>

<style scoped>
.doctor-info-container {
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

.doctor-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>