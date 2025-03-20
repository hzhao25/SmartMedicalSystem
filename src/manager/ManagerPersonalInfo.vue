<template>
  <div class="manager-info-container">
    <el-descriptions class="margin-top" title="管理员信息" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="账号">
        <template>
          <i class="el-icon-user"></i>
        </template>
        {{ name }}
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
        <el-image class="manager-image" :src="imageUrl"></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        <template>
          <i class="el-icon-time"></i>
        </template>
        {{ formattedCreateDate }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      // manager的信息
      name: "",
      status: 0,
      imageUrl: "",
      createDate: {
        year: 2023,
        month: "AUGUST",
        dayOfMonth: 9,
        hour: 16,
        minute: 56,
        second: 44,
      },
    };
  },
  created() {
    var managerJson = JSON.parse(Cookies.get("user")); // Assume manager info is stored in cookies
    this.name = managerJson.name;
    this.status = managerJson.status;
    this.imageUrl = managerJson.image; // Assuming image URL is stored in managerJson
    this.createDate = managerJson.createDate; // Assuming create date is stored in managerJson
  },
  computed: {
    statusText() {
      switch (this.status) {
        case 1:
          return "启用";
        case 0:
          return "禁用";
        default:
          return "未知状态";
      }
    },
    formattedCreateDate() {
      const monthNames = {
        JANUARY: "1月",
        FEBRUARY: "2月",
        MARCH: "3月",
        APRIL: "4月",
        MAY: "5月",
        JUNE: "6月",
        JULY: "7月",
        AUGUST: "8月",
        SEPTEMBER: "9月",
        OCTOBER: "10月",
        NOVEMBER: "11月",
        DECEMBER: "12月",
      };

      return `${this.createDate.year}年 ${monthNames[this.createDate.month]} ${
        this.createDate.dayOfMonth
      }日 ${this.createDate.hour}:${this.createDate.minute}:${
        this.createDate.second
      }`;
    },
  },
};
</script>

<style scoped>
.manager-info-container {
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

.manager-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>