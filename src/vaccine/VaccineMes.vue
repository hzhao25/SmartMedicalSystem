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
          <el-input v-model="name" placeholder="请输入疫苗名称"></el-input>
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
        <el-table-column prop="id" label="疫苗编号"> </el-table-column>
        <el-table-column prop="name" label="疫苗名称" sortable>
        </el-table-column>
        <el-table-column prop="typeId" label="疫苗种类"> </el-table-column>
        <el-table-column prop="function" label="疫苗作用" width="180px">
        </el-table-column>
        <el-table-column prop="target" label="疫苗目标人群"> </el-table-column>
        <el-table-column prop="adverseReaction" label="疫苗的不良反应">
        </el-table-column>
        <el-table-column prop="producer" label="疫苗生产厂家">
        </el-table-column>
        <el-table-column prop="produceTime" label="疫苗生产时间">
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
    <!-- 新增表单弹窗 -->
    <el-dialog :visible.sync="addFormVisible" title="添加疫苗信息">
      <el-form :model="addPosts" ref="addForm">
        <el-form-item label="疫苗名">
          <el-input v-model="addPosts.name"></el-input>
        </el-form-item>
        <el-form-item label="疫苗种类编号">
          <el-input v-model="addPosts.typeId"></el-input>
        </el-form-item>
        <el-form-item label="功能">
          <el-input v-model="addPosts.function"></el-input>
        </el-form-item>
        <el-form-item label="目标群体">
          <el-input v-model="addPosts.target"></el-input>
        </el-form-item>
        <el-form-item label="不良反应">
          <el-input v-model="addPosts.adverseReaction"></el-input>
        </el-form-item>
        <el-form-item label="制造商">
          <el-input v-model="addPosts.producer"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addPosts.status">
            <el-option label="禁止" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
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
    <el-dialog :visible.sync="updateFormVisible" title="修改疫苗信息">
      <el-form :model="updatePosts" ref="updateForm">
        <el-form-item label="疫苗名">
          <el-input v-model="updatePosts.name"></el-input>
        </el-form-item>
        <el-form-item label="疫苗种类编号">
          <el-input v-model="updatePosts.typeId"></el-input>
        </el-form-item>
        <el-form-item label="功能">
          <el-input v-model="updatePosts.function"></el-input>
        </el-form-item>
        <el-form-item label="目标群体">
          <el-input v-model="updatePosts.target"></el-input>
        </el-form-item>
        <el-form-item label="不良反应">
          <el-input v-model="updatePosts.adverseReaction"></el-input>
        </el-form-item>
        <el-form-item label="制造商">
          <el-input v-model="updatePosts.producer"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="updatePosts.status">
            <el-option label="禁止" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
        </el-form-item>
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
      name: "",
      //表格数据
      tableData: [],
      ids: [], //根据id批量删除存放的容器
      vaccine: {
        id: 0,
        name: "",
        typeId: "",
        function: "",
        target: "",
        adverseReaction: "",
        producer: "",
        produceTime: "",
      },
      addPosts: {
        id: 0,
        name: "",
        typeId: "",
        function: "",
        target: "",
        adverseReaction: "",
        producer: "",
        produceTime: "",
        status:"",
      },
      updatePosts: {
        id: 0,
        name: "",
        typeId: "",
        function: "",
        target: "",
        adverseReaction: "",
        producer: "",
        produceTime: "",
        status:"",
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
    // 单个删除
    handleDelete(index, row) {
      request
        .post("/vaccine/deleteVaccine", { id: row.id })
        .then((res) => {
          if (res.flag) {
            this.$message.success("删除疫苗信息成功");
            this.selectPage(); //重新查询数据
          } else {
            this.$message.error("删除疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("删除疫苗信息出错：" + error.message);
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
      console.log(data)
      request
        .post("/vaccine/deleteBatchVaccine", data, {
          jsonRequest: true,
        })
        .then((res) => {
          if (res.flag) {
            this.$message.success("批量删除疫苗信息成功");
            this.selectPage();
          } else {
            this.$message.error("批量删除疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("批量删除疫苗信息出错：" + error.message);
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
        name: row.name,
        typeId: row.typeId,
        function: row.function,
        target: row.target,
        adverseReaction: row.adverseReaction,
        producer: row.producer,
        produceTime: row.produceTime,
        status: row.status,
      };
      this.updateFormVisible = true;
    },
    // 修改记录
    updateRecord() {
      request
        .post("/vaccine/updateVaccine", this.updatePosts)
        .then((res) => {
          if (res.flag) {
            this.$message.success("修改疫苗信息成功");
            this.updateFormVisible = false;
            this.selectPage(); // 重新查询数据
          } else {
            this.$message.error("修改疫苗信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("修改疫苗信息出错：" + error.message);
        });
    },
    // 显示新增表单弹窗
    showAddForm() {
      this.addPosts = {
        name: "",
        typeId: "",
        function: "",
        target: "",
        adverseReaction: "",
        producer: "",
      };
      this.addFormVisible = true;
    },
        // 新增记录
    addRecord() {
        request
          .post("/vaccine/managerAddVaccine", this.addPosts)
          .then((res) => {
            if (res.flag) {
              this.$message.success("添加疫苗信息成功");
              this.addFormVisible = false;
              this.selectPage(); // 重新查询数据
            } else {
              this.$message.error("添加疫苗信息失败");
              this.addFormVisible = true;
            }
          })
          .catch((error) => {
            this.$message.error("添加疫苗信息出错：" + error.message);
          });
      },
    //查询函数
    selectPage() {
      let url;
      let params = {};
      if (this.name) {
        (url = "/vaccine/selectByName"), (params.name = this.name);
      } else {
        url = "/vaccine/queryAll";
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
              // 假设将 produce_time 格式化为 "yyyy-MM-dd HH:mm:ss" 格式的字符串
              const date = new Date(
                item.produceTime.year,
                item.produceTime.monthValue - 1,
                item.produceTime.dayOfMonth,
                item.produceTime.hour,
                item.produceTime.minute,
                item.produceTime.second
              );
              item.produceTime = date
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              return item;
            });
            //将查询到的数据赋值到当前tableData中
            this.tableData = newTableData;
          }
        });
    },
    // 更新医生状态的方法
    updateStatus(row) {
      // 根据当前状态确定要更新的目标状态
      const newStatus = row.status === 1 ? 0 : 1;
      const managerId = row.id;
      // 发送请求更新状态
      request
        .post("/vaccine/updateStatus", {
          id: managerId,
          status: Number(newStatus),
        })
        .then((res) => {
          if (res.flag) {
            // 更新成功，给出提示并更新表格数据
            this.$message.success(newStatus === 1 ? "激活成功" : "禁用成功");
            // 找到表格中对应的数据并更新状态
            const targetIndex = this.tableData.findIndex(
              (item) => item.id === managerId
            );
            if (targetIndex !== -1) {
              this.tableData[targetIndex].status = newStatus; //更新医生状态
            }
          } else {
            // 更新失败，给出提示
            this.$message.error(newStatus === 1 ? "激活失败" : "禁用失败");
          }
        })
        .catch((error) => {
          // 请求出错，给出提示
          this.$message.error("更新状态出错：" + error.message);
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