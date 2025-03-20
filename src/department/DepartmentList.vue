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
            v-model="name"
            placeholder="请输入科室名称关键字"
          ></el-input>
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
            >查询</el-button
          >
        </el-form-item>
        <!-- 批量删除、新增按钮 -->
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
      <!-- 科室信息展示表格   绑定了tableData的数据 -->
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
        <el-table-column prop="id" label="部门编号"></el-table-column>
        <el-table-column
          prop="name"
          label="科室名称"
          sortable
        ></el-table-column>
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
    <el-dialog :visible.sync="addFormVisible" title="添加科室信息">
      <el-form :model="addPosts" ref="addForm">
        <el-form-item label="科室名">
          <el-input v-model="addPosts.name"></el-input>
        </el-form-item>
        <el-form-item label="科室描述">
          <el-input v-model="addPosts.remark"></el-input>
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
    <el-dialog :visible.sync="updateFormVisible" title="修改科室信息">
      <el-form :model="updatePosts" ref="updateForm">
        <el-form-item label="科室名">
          <el-input v-model="updatePosts.name"></el-input>
        </el-form-item>
        <el-form-item label="科室描述">
          <el-input v-model="updatePosts.remark"></el-input>
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
      department:{
        id: 0,
        name: "",
        remark:"",
        status: "",
      },
      addPosts: {
        id: 0,
        name: "",
        remark:"",
        status: "",
      },
      updatePosts: {
        id: 0,
        name: "",
        remark:"",
        status: "",
      },
    };
  },
  created() {
    if (Cookies.get("user")) {
      this.role = Cookies.get("role");
      this.role = Cookies.get("role");
    }
    this.selectPage();
  },
  methods: {
    // 单个删除
    handleDelete(index, row) {
      request
        .post("/department/deleteDepartment", { id: row.id })
        .then((res) => {
          if (res.flag) {
            this.$message.success("删除科室信息成功");
            this.selectPage(); //重新查询数据
          } else {
            this.$message.error("删除科室信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("删除科室信息出错：" + error.message);
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
        .post("/department/deleteBatchDepartment", data, {
          jsonRequest: true,
        })
        .then((res) => {
          if (res.flag) {
            this.$message.success("批量删除科室信息成功");
            this.selectPage();
          } else {
            this.$message.error("批量删除科室信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("批量删除科室信息出错：" + error.message);
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
        remark: row.remark,
        status: row.status,
      };
      this.updateFormVisible = true;
    },
    // 修改记录
    updateRecord() {
      request
        .post("/department/updateDepartment", this.updatePosts)
        .then((res) => {
          if (res.flag) {
            this.$message.success("修改科室信息成功");
            this.updateFormVisible = false;
            this.selectPage(); // 重新查询数据
          } else {
            this.$message.error("修改科室信息失败");
          }
        })
        .catch((error) => {
          this.$message.error("修改科室信息出错：" + error.message);
        });
    },
    // 显示新增表单弹窗
    showAddForm() {
      this.addPosts = {
        name: "",
        remark:"",
        status: "",
      };
      this.addFormVisible = true;
    },
    // 新增记录
    addRecord() {
      request
        .post("/department/managerAddDepartment", this.addPosts)
        .then((res) => {
          if (res.flag) {
            this.$message.success("添加科室信息成功");
            this.addFormVisible = false;
            this.selectPage(); // 重新查询数据
          } else {
            this.$message.error("添加科室信息失败");
            this.addFormVisible = true;
          }
        })
        .catch((error) => {
          this.$message.error("添加科室信息出错：" + error.message);
        });
    },
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
    },

    // 更新医生状态的方法
    updateStatus(row) {
      // 根据当前状态确定要更新的目标状态
      const newStatus = row.status === 1 ? 0 : 1;
      const managerId = row.id;
      // 发送请求更新状态
      request
        .post("/department/updateStatus", {
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
</style>