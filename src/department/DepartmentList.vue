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
          <el-input v-model="name" placeholder="请输入科室名称关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="status" placeholder="请选择状态">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="queryParams"
            style="background-color: #254175"
          >查询</el-button>
        </el-form-item>
        <!-- 批量删除、新增按钮 -->
        <el-form-item v-if="role == 'manager'">
          <el-button
            style="background-color: #254175"
            type="primary"
            @click="clearForm"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 下半部分 -->
    <div class="botoom_div">
      <!-- 科室信息展示表格   绑定了tableData的数据 -->
      <el-table :data="tableData" style="width: 100%">
        <!-- 复选框 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="role == 'manager'"
        ></el-table-column>
        <el-table-column prop="id" label="部门编号"></el-table-column>
        <el-table-column prop="name" label="科室名称" sortable></el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
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
            >禁用</el-button>
            <el-button
              size="small"
              v-if="scope.row.status == 0"
              type="success"
              @click="updateStatus(scope.row)"
            >激活</el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
            <el-popconfirm
              title="删除后无法恢复，确定吗？"
              icon-color="red"
              @confirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      role: "",
      name: "",
      status: "",
      tableData: [],
      // Other data properties as needed
    };
  },
  created() {
    if (Cookies.get("user")) {
      this.role = Cookies.get("role");
    }
    this.selectPage();
  },
  methods: {
    selectPage() {
      request
        .get("/department/queryAll", {
          params: {
          },
        })
        .then((res) => {
          if (res.flag == false) {
            this.$message.error(res.message);
          } else {
            this.$message.success("查询成功");
            this.tableData = res.list;
          }
        });
    },
    queryParams(){
      request
        .get("/department/queryParams", {
          params: {
            name:this.name,
            status:this.status
          },
        })
        .then((res) => {
          if (res.flag == false) {
            this.$message.error(res.message);
          } else {
            this.$message.success("查询成功");
            this.tableData = res.list;
          }
        });
    }
    // Other methods like batch_delete, handleEdit, handleDelete, updateStatus, clearForm
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
</style>