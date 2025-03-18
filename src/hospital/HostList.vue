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
          <el-input v-model="name" placeholder="请输入医院名"></el-input>
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
      <!-- 医院信息展示表格   绑定了tableData的数据 -->
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
        <!-- 表格列名 -->
        <el-table-column prop="id" label="医院编号" sortable> </el-table-column>
        <el-table-column prop="name" label="医院名称"> </el-table-column>
        <el-table-column prop="address" label="医院地址"> </el-table-column>
        <el-table-column prop="phone" label="医院联系电话"> </el-table-column>
        <el-table-column prop="remark" label="医院评价"> </el-table-column>
        <el-table-column prop="createTime" label="建立时间"> </el-table-column>
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
      //模糊查询表单input值
      name: "",
      //表格数据
      tableData: [],
      ids: [], //根据id批量删除存放的容器
      hospital: {
        id: 0,
        name: "",
        address: "",
        phone: "",
        remark: "",
        createTime: "",
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
      // var userJson = JSON.parse(Cookies.get("user"));
      this.role = Cookies.get("role");
    }
    //调用查询的函数
    this.selectPage();
  },
  methods: {
    //查询函数
    selectPage() {
      let url;
      let params={};
      if(this.name){
        url="/hospital/selectByHospitalName",
        params.name=this.name
      }else{
        url="/hospital/queryAll"
      }
      //发送请求
      request
        .get(url, {
          params: params,
        })
        .then((res) => {
          //处理响应
          if (res.flag == false) {
            //查询失败
            this.$message.error("查询失败");
            // this.$message.error(res.message);
          } else {
            this.$message.success("查询成功");
            let list = res.list;
            if (!Array.isArray(list)) {
              list = [list];
            }
            const newTableData = list.map(item => {
            // 假设将预约疫苗时间格式化为 "yyyy-MM-dd HH:mm:ss" 格式的字符串
            const CreateTime = new Date(item.createTime.year, item.createTime.monthValue - 1, item.createTime.dayOfMonth, item.createTime.hour, item.createTime.minute, item.createTime.second);
            item.createTime = CreateTime.toISOString().slice(0, 19).replace('T',' ');
            return item;
            });
            //将查询到的数据赋值到当前tableData中
            this.tableData = newTableData;
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