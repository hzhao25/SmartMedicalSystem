<template>
  <div style="width: 100%">
    <!-- 上半部分 -->
    <div class="top_div">
      <!-- 模糊查询表单 -->
      <el-form
        :inline="true"
        class="demo-form-inline"
        style="padding-top: 22px"
      >
        <el-form-item>
          <el-input v-model="doctorId" placeholder="请输入医生编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="selectPage"
            style="background-color: #254175"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 下半部分 -->
    <div class="botoom_div">
      <!-- 医生信息展示表格   绑定了tableData的数据 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框 -->
        <el-table-column prop="id" label="编号"> </el-table-column>
        <el-table-column prop="userId" label="用户编号" sortable>
        </el-table-column>
        <el-table-column prop="vaccineId" label="疫苗编号"> </el-table-column>
        <el-table-column prop="doctorId" label="医生编号" width="180px">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="appDate" label="预约接种时间">
        </el-table-column>
        <el-table-column prop="injectedTime" label="接种完成时间">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="vname" label="疫苗名">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="docname" label="医生名">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          v-if="role == 'manager'"
          sortable
        >
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 0">禁用</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<!-- js代码 -->
<script>
//导入request工具
import request from "@/utils/request";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      //模糊查询表单input值
      doctorId: "",
      //表格数据
      tableData: [],
      vaccineRecord: {
        id: "",
        userId: "",
        doctorId: "",
        vaccineId: "",
        address: "",
        appDate: "",
        injectedTime: "",
        status: "",
        createTime:"",
        vname:"",
        username:"",
        docname:"",
      },
      updateFormVisible: false,
      addFormVisible: false,
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
    };
  },
  //当vue创建后，发起请求查询数据
  created() {
    if (Cookies.get("user")) {
      //获取登录用户角色
      //   var userJson = JSON.parse(Cookies.get("user"));
      this.role = Cookies.get("role");
    }
    //调用查询的函数
    this.selectPage();
  },
  methods: {
    //查询函数
    selectPage() {
      let url;
      let params = {};

      if (this.role === "manager") {
        // 管理员可以查询所有
        url = "/vaccineRecord/queryAll";
      } else if (this.role === "doctor") {
        // 医生只能查询自己接种的用户记录
        const userJson = JSON.parse(Cookies.get("user"));
        params.doctorId = userJson.id;
        url = "/vaccineRecord/selectByDoctorId"; // 这里可以直接用医生查询接口
      } else {
        // 用户只能查询自己的接种记录
        const userJson = JSON.parse(Cookies.get("user"));
        params.userId = userJson.id;
        url = "/vaccineRecord/selectByUserId"; // 这里需要新增一个用户查询接口
        if (this.doctorId) {
          params.doctorId = this.doctorId;
          url = "/vaccineRecord/selectByIds";
        }
      }
      // 如果 doctorId 不是空，添加到查询参数
      
      //发送请求
      request
        .get(url, {
          params: params,
        })
        .then((res) => {
          //处理响应
          if (res.flag == false) {
            //查询失败
            // this.$message.error(res.message);
            this.$message.error("查询失败");
          } else {
            this.$message.success("查询成功");
            let list = res.list;
            if (!Array.isArray(list)) {
              list = [list];
            }
            this.tableData=list;
          }
        });
    },
  },
};
</script>
<style>
.top_div {
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 5px;
  margin-bottom: 50px;
  background-color: #fff;
}
.botoom_div {
  border-radius: 15px;
  padding-top: 25px;
  padding-bottom: 25px;
  box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 5px;
  margin-bottom: 50px;
  background-color: #fff;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  float: left;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.avatar {
  width: 50px;
  height: 50px;
  display: block;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>