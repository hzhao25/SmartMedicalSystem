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
        <el-form-item v-if="role == 'manager'">
          <el-popconfirm
            title="删除后无法恢复，确定吗？"
            icon-color="red"
            @confirm="batch_delete()"
          >
            <el-button slot="reference" plain type="danger">批量删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-input v-model="name" placeholder="请输入医生名关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="hosId" placeholder="请选择医院">
            <!-- <el-option :value="''"></el-option> -->
            <el-option
              v-for="item in hos_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="deptId" placeholder="请选择部门">
            <!-- <el-option :value="''"></el-option> -->
            <el-option
              v-for="item in dept_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="selectPage"
            style="background-color: #254175"
            >查询</el-button
          >
        </el-form-item>
        <!--批量删除、新增按钮-->
        <el-form-item v-if="role == 'manager'">
          <el-button
            style="background-color: #254175"
            type="primary"
            @click="clearForm"
            >新增</el-button
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
      >
        <!-- 复选框 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="role == 'manager'"
        ></el-table-column>
        <el-table-column prop="id" label="医生编号"> </el-table-column>
        <el-table-column prop="image" label="头像" align="center">
          <template #default="scope">
            <el-image
              style="
                width: auto;
                height: 40px;
                border: none;
                cursor: pointer;
                border-radius: 50%;
              "
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="医生名" sortable> </el-table-column>
        <el-table-column prop="hospitalName" label="所属医院" width="180px"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="school" label="毕业院校"> </el-table-column>
        <el-table-column prop="major" label="专业"> </el-table-column>
        <el-table-column prop="waitNums" label="等待人数"> </el-table-column>
        <el-table-column prop="departmentName" label="部门"> </el-table-column>
        <el-table-column prop="role" label="职位" sortable>
          <template #default="scope">
            <el-tag v-if="scope.row.role == 'doctor'">医生</el-tag>
            <el-tag type="success" v-if="scope.row.role == 'nurse'"
              >护士</el-tag
            >
          </template>
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
        <el-table-column label="操作" v-if="role == 'manager'">
          <template #default="scope">
            <el-button
              size="small"
              v-if="scope.row.status == 1"
              type="danger"
              @click="updateStatus(scope.row)"
              >禁用</el-button
            >
            <el-button
              size="small"
              v-if="scope.row.status == 0"
              type="success"
              @click="updateStatus(scope.row)"
              >激活</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="role == 'manager'">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="删除后无法恢复，确定吗？"
              icon-color="red"
              @confirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button slot="reference" size="small" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
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
      role: "",
      imageUrl: "", //头像上传路径
      //模糊查询表单input值
      name: "",
      hosId: "",
      deptId: "",
      phone: "",
      hos_options: [],
      dept_options: [],
      //表格数据
      tableData: [],
      //医院展示信息
      hosData: [],
      //部门信息
      depData: [],
      hosDeptData: [],
      ids: [], //根据id批量删除存放的容器
      doctor: {
        id: 0,
        name: "",
        password: "",
        password_check: "",
        phone: "",
        image: "", //头像文件名
        school: "",
        major: "",
        waitNums: "",
        deptId: "",
        hosId: "",
        departmentName: "",
        hospitalName: "",
        role: "doctor",
      },
      role_options: [
        {
          value: "doctor",
          label: "医生",
        },
        {
          value: "nurse",
          label: "护士",
        },
      ],
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
      // var userJson = JSON.parse(Cookies.get("user"));
      // this.role = Cookies.get("role").role;
      this.role=Cookies.get("role")
    }
    //调用查询的函数
    this.selectPage();
  },
  methods: {
    //查询函数
    selectPage() {
      //发送请求
      request
        .get("/doctor/queryAll", {
          params: {},
        })
        .then((res) => {
          //处理响应
          if (res.flag == false) {
            //查询失败
            this.$message.error(res.message);
          } else {
            this.$message.success("查询成功");
            //将查询到的数据赋值到当前tableData中
            this.tableData = res.list;
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