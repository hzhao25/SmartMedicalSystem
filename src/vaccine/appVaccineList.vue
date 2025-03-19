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
          <el-input
            v-model="vaccine_id"
            placeholder="请输入可预约疫苗的编号"
          ></el-input>
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
            @click="showAddForm"
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
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="role == 'manager'"
        ></el-table-column>
        <!-- 表格列名 -->
        <el-table-column prop="id" label="排序编号"> </el-table-column>
        <el-table-column prop="vaccineId" label="可预约疫苗编号" sortable>
        </el-table-column>
        <el-table-column prop="nums" label="可接种数量"> </el-table-column>
        <el-table-column prop="appedNums" label="已预约数量"> </el-table-column>
        <el-table-column prop="address" label="接种医院地址"> </el-table-column>
        <el-table-column prop="appDate" label="预约接种时间"> </el-table-column>
        <el-table-column prop="createTime" label="接种完成时间">
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
    <!-- 新增表单弹窗 -->
    <el-dialog :visible.sync="addFormVisible" title="添加可预约疫苗信息">
      <el-form :model="addPosts" ref="addForm">
        <el-form-item label="可预约疫苗编号">
          <el-input v-model="addPosts.vaccineId"></el-input>
        </el-form-item>
        <el-form-item label="疫苗可接种数量">
          <el-input v-model="addPosts.nums"></el-input>
        </el-form-item>
        <el-form-item label="疫苗已预约数量">
          <el-input v-model="addPosts.appedNums"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addPosts.address"></el-input>
        </el-form-item>
        <el-form-item label="预约接种时间">
          <el-date-picker
            v-model="addPosts.appDate"
            type="datetime"
            placeholder="请选择预约接种时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addRecord">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改表单弹窗 -->
    <el-dialog :visible.sync="updateFormVisible" title="修改可预约疫苗信息">
      <el-form :model="updatePosts" ref="updateForm">
        <el-form-item label="可预约疫苗编号">
          <el-input v-model="updatePosts.vaccineId"></el-input>
        </el-form-item>
        <el-form-item label="疫苗可接种数量">
          <el-input v-model="updatePosts.nums"></el-input>
        </el-form-item>
        <el-form-item label="疫苗已预约数量">
          <el-input v-model="updatePosts.appedNums"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="updatePosts.address"></el-input>
        </el-form-item>
        <!-- <el-form-item label="预约接种时间">
          <el-input v-model="updatePosts.appDate"></el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateRecord">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
      vaccine_id: "",
      //表格数据
      tableData: [],
      ids: [], //根据id批量删除存放的容器
      appointmentVaccine: {
        id: 0,
        vaccineId: "",
        nums: "",
        appedNums: "",
        address: "",
        appDate: "",
        createTime: "",
      },
      addPosts: {
        id: 0,
        vaccineId: "",
        nums: "",
        appedNums: "",
        address: "",
        appDate: "",
        createTime: "",
      },
      updatePosts: {
        id: 0,
        vaccineId: "",
        nums: "",
        appedNums: "",
        address: "",
        appDate: "",
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
    // 单个删除
    handleDelete(index, row) {
      request
        .post("/appVaccine/deleteAppVaccine", { id: row.id })
        .then((res) => {
          if (res.flag) {
            this.$message.success("删除可预约疫苗信息成功");
            this.selectPage(); //重新查询数据
          } else {
            this.$message.error("删除可预约疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("删除可预约疫苗信息出错：" + error.message);
        });
    },

    // 批量删除
    batch_delete() {
      //被选中的每列数据组成新的数组
      const selectedIds = this.tableData.filter((item) => item.__selected);
      if (selectedIds.length === 0) {
        //数组长度为0,代表没有被选中的数据
        this.$message.warning("请选择要删除的记录");
        return;
      }
      //取出每项被选中数据的id
      this.ids = selectedIds.map((item) => item.id);

      // 将数据转换为 JSON 格式
      const data = { ids: this.ids };
      console.log(data);
      request
        .post("/appVaccine/deleteBatchAppVaccine", data, {
          jsonRequest: true,
        })
        .then((res) => {
          if (res.flag) {
            this.$message.success("批量删除可预约疫苗信息成功");
            this.selectPage();
          } else {
            this.$message.error("批量删除可预约疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("批量删除可预约疫苗信息出错：" + error.message);
        });
    },

    //处理多选框，更新每列的seletc值
    handleSelectionChange(selection) {
      this.tableData.forEach((item) => {
        item.__selected = selection.some(
          (selectedItem) => selectedItem.id === item.id
        );
      });
    },

    // 显示修改表单弹窗并填充数据
    handleEdit(index, row) {
      this.updatePosts = {
        id: row.id,
        vaccineId: row.vaccineId,
        nums: row.nums,
        appedNums: row.appedNums,
        address: row.address,
        appDate: row.appDate,
        createTime: row.createTime,
      };
      this.updateFormVisible = true;
    },
    // 修改记录
    updateRecord() {
      request
        .post("/appVaccine/updateAppVaccine", this.updatePosts)
        .then((res) => {
          if (res.flag) {
            this.$message.success("修改可预约疫苗信息成功");
            this.updateFormVisible = false;
            this.selectPage(); // 重新查询数据
          } else {
            this.$message.error("修改可预约疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("修改可预约疫苗信息出错：" + error.message);
        });
    },
    // 显示新增表单弹窗
    showAddForm() {
      this.addPosts = {
        vaccineId: "",
        nums: "",
        appedNums: "",
        address: "",
        appDate: "",
      };
      this.addFormVisible = true;
    },
    // 新增记录
    addRecord() {
      request
        .post("/appVaccine/managerAddAppVaccine", this.addPosts)
        .then((res) => {
          if (res.flag) {
            this.$message.success("添加可预约疫苗信息成功");
            this.addFormVisible = false;
            this.selectPage(); // 重新查询数据
          } else {
            this.$message.error("添加可预约疫苗信息失败");
            this.addFormVisible = true;
          }
        })
        .catch((error) => {
          this.$message.error("添加可预约疫苗信息出错：" + error.message);
        });
    },
    //查询函数
    selectPage() {
      let url;
      let params = {};
      if (this.vaccine_id) {
        (url = "/appVaccine/selectByAppVaccineId"),
          (params.vaccine_id = this.vaccine_id);
      } else {
        url = "/appVaccine/queryAll";
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
            //将查询到的数据赋值到当前tableData中
            this.tableData = list;
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