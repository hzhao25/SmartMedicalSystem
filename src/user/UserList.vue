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
        <el-form-item v-if="role === 'manager'">
          <el-popconfirm
            title="删除后无法恢复，确定吗？"
            icon-color="red"
            @confirm="batch_delete()"
          >
            <el-button slot="reference" plain type="danger">批量删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-input v-model="name" placeholder="请输入用户名关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
        <el-form-item v-if="role === 'manager'">
          <el-button
            style="background-color: #254175"
            type="primary"
            @click="openEditModal(null)"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 下半部分 -->
    <div class="botoom_div">
      <el-table ref="table" :data="tableData" style="width: 100%">
        <el-table-column
          type="selection"
          width="55"
          v-if="role === 'manager'"
        ></el-table-column>
        <el-table-column prop="id" label="用户编号"> </el-table-column>
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
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" sortable> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="address" label="家庭住址"> </el-table-column>
        <el-table-column prop="codeid" label="身份证"> </el-table-column>
        <el-table-column prop="qrcode" label="通行二维码" sortable>
          <template #default="scope">
            <el-tag
              :type="
                scope.row.qrcode === 1
                  ? 'success'
                  : scope.row.qrcode === 2
                  ? 'warning'
                  : 'danger'
              "
            >
              {{
                scope.row.qrcode === 1
                  ? "绿码"
                  : scope.row.qrcode === 2
                  ? "黄码"
                  : "红码"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="role === 'manager'">
          <template #default="scope">
            <el-button size="small" @click="openEditModal(scope.row.id)"
              >修改</el-button
            >
            <el-popconfirm
              title="删除后无法恢复，确定吗？"
              icon-color="red"
              @confirm="handleDelete(scope.row.id)"
            >
              <el-button slot="reference" size="small" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 用户编辑模态框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="isEditModalVisible"
      width="500px"
    >
      <el-form :model="userForm" ref="userForm" label-width="120px">
        <el-form-item
          label="用户名"
          prop="name"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>

        <el-form-item
          label="手机号"
          prop="phone"
          :rules="[
            { required: true, message: '请输入手机号', trigger: 'blur' },
          ]"
        >
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>

        <el-form-item
          label="年龄"
          prop="age"
          :rules="[{ required: true, message: '请输入年龄', trigger: 'blur' }]"
        >
          <el-input-number v-model="userForm.age" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item
          label="性别"
          prop="sex"
          :rules="[
            { required: true, message: '请选择性别', trigger: 'change' },
          ]"
        >
          <el-select v-model="userForm.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="userForm.address"></el-input>
        </el-form-item>

        <el-form-item
          label="身份证"
          prop="codeid"
          :rules="[
            { required: true, message: '请输入身份证号', trigger: 'blur' },
          ]"
        >
          <el-input v-model="userForm.codeid"></el-input>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status"
          :rules="[
            { required: true, message: '请选择状态', trigger: 'change' },
          ]"
        >
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveUser">保存</el-button>
          <el-button @click="isEditModalVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
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
      phone: "",
      status: "",
      statusOptions: [
        { value: "", label: "全部" },
        { value: "1", label: "正常" },
        { value: "0", label: "禁用" },
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      isEditModalVisible: false,
      selectedUserId: null,
      userForm: {
        id: null,
        name: "",
        phone: "",
        age: null,
        sex: "男",
        address: "",
        codeid: "",
        status: "1",
      },
    };
  },
  created() {
    var userJson = JSON.parse(Cookies.get("user"));
    this.userId = userJson.id;
    this.role = Cookies.get("role");
    this.selectPage();
  },
  methods: {
    selectPage() {
      request.get("/user/queryAll", { params: {} }).then((res) => {
        if (res.flag === false) {
          this.$message.error(res.message);
        } else {
          this.$message.success("查询成功");
          this.tableData = res.list;
        }
      });
    },
    queryParams() {
      request
        .get("/user/queryParams", {
          params: {
            name: this.name,
            phone: this.phone,
            status: this.status,
          },
        })
        .then((res) => {
          if (res.flag === false) {
            this.$message.error(res.message);
          } else {
            this.$message.success("查询成功");
            this.tableData = res.list;
          }
        });
    },
    openEditModal(userId) {
      if (userId) {
        this.selectedUserId = userId; // 编辑用户
        const user = this.tableData.find((user) => user.id === userId);
        this.userForm = { ...user }; // 填充表单
      } else {
        this.selectedUserId = null; // 新增用户
        this.userForm = {
          id: null,
          name: "",
          phone: "",
          password:"",
          age: null,
          sex: "男",
          address: "",
          codeid: "",
          status: "1",
        };
      }
      this.isEditModalVisible = true; // 显示模态框
    },
    saveUser() {
      const apiUrl = this.selectedUserId
        ? `/user/updateUser`
        : `/user/insertUser`;
      const method = this.selectedUserId ? "put" : "post";

      const user = {
        ...this.userForm,
        id: this.selectedUserId || null, // 仅在更新时传递用户 ID
        };
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          request[method](apiUrl, user).then((res) => {
            if (res.flag === false) {
              this.$message.error(res.message);
            } else {
              this.$message.success("用户信息保存成功");
              this.isEditModalVisible = false; // 关闭模态框
              this.selectPage(); // 刷新用户列表
            }
          });
        } else {
          this.$message.warning("表单验证失败，请检查输入");
        }
      });
    },
    handleDelete(userId) {
      this.$confirm("确定删除该用户吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.delete("/user/deleteUser",{params : 
            {userId:userId,}
        }).then((res) => {
            if (res.flag === false) {
              this.$message.error(res.message);
            } else {
              this.$message.success("删除成功");
              this.selectPage(); // 刷新用户列表
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    batch_delete() {
      const selectedUsers = this.$refs.table.selection; // 获取选中的用户
      if (selectedUsers.length === 0) {
        this.$message.warning("请先选择用户进行批量删除");
        return;
      }

      this.$confirm("确定删除选中的用户吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const ids = selectedUsers.map((user) => user.id);
          console.log(ids);
          request.delete("/user/batchDelete", {data:{ids: ids}, 
          jsonRequest: true,
         }).then((res) => {
            if (res.flag === false) {
              this.$message.error(res.message);
            } else {
              this.$message.success("批量删除成功");
              this.selectPage(); // 刷新用户列表
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消批量删除");
        });
    },
    clearForm() {
      this.name = "";
      this.phone = "";
      this.status = "";
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