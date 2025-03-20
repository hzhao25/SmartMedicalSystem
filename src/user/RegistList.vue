<template>
  <div class="registration-list">
    <el-table :data="registrationList" style="width: 100%">
      <el-table-column prop="id" label="挂号编号" />
      <el-table-column prop="username" label="挂号人姓名" />
      <el-table-column prop="docname" label="医生姓名" />
      <el-table-column prop="description" label="病情描述" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="bookTime" label="预约时间" />
      <el-table-column prop="registrationTime" label="问诊时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="role === 'doctor'"
            @click="createConsultation(scope.row)"
            type="primary"
            >发表问诊记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
import request from "@/utils/request";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      userId:"",  
      role: "",
      registrationList: [

      ],
    };
  },
  created() {
    var userJson = JSON.parse(Cookies.get("user"));
    this.userId = userJson.id;
    console.log(userJson);
    this.role = Cookies.get("role");
    console.log(this.role)
    if (this.role === "user") {
      this.getUserRegistrations(this.userId);
    } else if (this.role === "doctor") {
      this.getDoctorRegistrations(this.userId);
    } else if (this.role === "manager") {
      this.getAllRegistrations();
    }
  },
  methods: {
    getUserRegistrations(value) {
      request.get("/registrationView/queryByUser",
        {params : 
            {userId : value}}
        ).then((res) => {
        if (res.flag) {
          this.registrationList = res.list.map(item => {
          // 格式化时间
          const formattedItem = {
            ...item,
            registrationTime: this.formatDate(item.registrationTime),
            bookTime: this.formatDate(item.bookTime)
          };
          return formattedItem;
        });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getDoctorRegistrations(value) {
      request.get("/registrationView/queryByDoctor",
        {params : 
            {doctorId : value}
        }).then((res) => {
        if (res.flag) {
          this.registrationList = res.list.map(item => {
          // 格式化时间
          const formattedItem = {
            ...item,
            registrationTime: this.formatDate(item.registrationTime),
            bookTime: this.formatDate(item.bookTime)
          };
          return formattedItem;
        });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getAllRegistrations() {
      request.get("/registrationView/queryAll").then((res) => {
        if (res.flag) {
          this.registrationList = res.list.map(item => {
          // 格式化时间
          const formattedItem = {
            ...item,
            registrationTime: this.formatDate(item.registrationTime),
            bookTime: this.formatDate(item.bookTime)
          };
          return formattedItem;
        });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    createConsultation(registration) {
      // 跳转到发表问诊记录的页面
      this.$router.push({
        name: "Consultation",
        params: { registrationId: registration.id },
      });
    },
    formatDate(dateString) {

        if (!dateString || typeof dateString !== 'string') {
        console.log('Invalid dateString or not a string'); // 调试信息
        return '无';
        }

        // 确保格式为 'YYYY-MM-DD HH:mm:ss'
        const parts = dateString.split(' ');
        if (parts.length !== 2) {
        console.log('Date format incorrect:', dateString); // 调试信息
        return '无效日期';
        }

        const dateParts = parts[0].split('-');
        const timeParts = parts[1].split(':');

        if (dateParts.length !== 3 || timeParts.length !== 3) {
        console.log('Date or time parts incorrect:', dateParts, timeParts); // 调试信息
        return '无效日期';
        }

        // 创建 Date 对象
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // 月份从 0 开始
        const day = parseInt(dateParts[2], 10);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        const date = new Date(year, month, day, hours, minutes, seconds);

        // 检查是否为有效日期
        if (isNaN(date.getTime())) {
        console.log('Generated date is invalid:', date); // 调试信息
        return '无效日期';
        }

        // 格式化为 'YYYY-MM-DD HH:mm:ss'
        const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
        };

        return date.toLocaleString('zh-CN', options).replace(/\//g, '-'); // 替换斜杠为破折号
    }
  },
};
</script>
  
  <style scoped>
.registration-list {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.el-table {
  border-radius: 10px;
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa;
  color: #333;
}

.el-button {
  background-color: #409eff;
  color: white;
}

.el-button:hover {
  background-color: #66b1ff;
}
</style>