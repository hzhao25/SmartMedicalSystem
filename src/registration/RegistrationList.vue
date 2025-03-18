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
        <el-form-item v-if="isPage">
          <el-input
            v-model="registrationId"
            placeholder="请输入挂号贴编号"
          ></el-input>
        </el-form-item>
        <el-form-item v-else>
          <el-input v-model="publisher" placeholder="请输入医生编号"></el-input>
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
      <el-table :data="tableData" style="width: 100%">
        <!-- 复选框 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="role == 'manager'"
        ></el-table-column>
        <el-table-column prop="id" label="问诊记录编号" sortable>
        </el-table-column>
        <el-table-column prop="postsImage" label="病症图" align="center">
          <template #default="scope">
            <el-image
              style="
                width: auto;
                height: 40px;
                border: none;
                cursor: pointer;
                border-radius: 50%;
              "
              :src="scope.row.postsImage"
              :preview-src-list="[scope.row.postsImage]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="postsContent" label="问诊记录内容">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="问诊记录发表时间"
          width="180px"
        >
        </el-table-column>
        <el-table-column prop="publisher" label="医生编号"> </el-table-column>
        <el-table-column prop="registrationId" label="相应挂号贴编号">
        </el-table-column>
        <el-table-column prop="publisherType" label="发布人">
          <template #default="scope">
            <el-tag v-if="scope.row.publisherType == '0'">医生</el-tag>
            <el-tag type="success" v-if="scope.row.publisherType == '1'"
              >用户</el-tag
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
      publisherType: "",
      imageUrl: "", //头像上传路径
      //模糊查询表单input值
      publisher: "",
      registrationId: "",
      //表格数据
      tableData: [],
      ids: [], //根据id批量删除存放的容器
      doctor: {
        id: 0,
        postsContent: "",
        postsImage: "",
        createTime: "",
        publisher: "",
        registrationId: "", //头像文件名
        publisherType: "",
      },
      updateFormVisible: false,
      addFormVisible: false,
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      userJson: null,
    };
  },
  //当vue创建后，发起请求查询数据
  created() {
    if (Cookies.get("user")) {
      //获取登录用户角色
      this.userJson = JSON.parse(Cookies.get("user"));
      // this.role = Cookies.get("role").role;
      this.role = Cookies.get("role");
    }
    //调用查询的函数
    this.selectPage();
  },
  computed: {
    //判断当前页面是不是DoctorLayout
    isPage() {
      return this.$route.path === "/DoctorLayout/postsList";
    },
  },
  methods: {
    //查询函数
    selectPage() {
      if (this.isPage) {
        //如果是doctor
        let url;
        let params = {};
        var doctorId = this.userJson.id;
        if (this.registrationId) {
          (url = "/posts/selectByRegistrationId"),
            (params.registrationId = this.registrationId);
          params.publisher = doctorId;
        } else{
          (url = "/posts/selectByPublisherId"), (params.publisher = doctorId);
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
              // this.$message.error(res.message);
              this.$message.error("查询失败");
            } else {
              this.$message.success("查询成功");
              let list = res.list;
              if (!Array.isArray(list)) {
                list = [list];
              }
              const newTableData = list.map((item) => {
                // 假设将 create_time 格式化为 "yyyy-MM-dd HH:mm:ss" 格式的字符串
                const date = new Date(
                  item.createTime.year,
                  item.createTime.monthValue - 1,
                  item.createTime.dayOfMonth,
                  item.createTime.hour,
                  item.createTime.minute,
                  item.createTime.second
                );
                item.createTime = date
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                return item;
              });
              //将查询到的数据赋值到当前tableData中
              this.tableData = newTableData;
            }
          });
      } else {
        let url;
        let params = {};
        if (this.publisher) {
          (url = "/posts/selectByPublisherId"),
            (params.publisher = this.publisher);
        } else {
          url = "/posts/queryAll";
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
              // this.$message.error(res.message);
              this.$message.error("查询失败");
            } else {
              this.$message.success("查询成功");
              let list = res.list;
              if (!Array.isArray(list)) {
                list = [list];
              }
              const newTableData = list.map((item) => {
                // 假设将 create_time 格式化为 "yyyy-MM-dd HH:mm:ss" 格式的字符串
                const date = new Date(
                  item.createTime.year,
                  item.createTime.monthValue - 1,
                  item.createTime.dayOfMonth,
                  item.createTime.hour,
                  item.createTime.minute,
                  item.createTime.second
                );
                item.createTime = date
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                return item;
              });
              //将查询到的数据赋值到当前tableData中
              this.tableData = newTableData;
            }
          });
      }
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