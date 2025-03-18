<template>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        style="border-radius: 30px"
      >
        <!-- 上半部分 -->
        <el-row :gutter="20" class="top_div" style="padding-top: 22px">
          <el-col :span="12">
            <el-form-item label="科室">
              <!-- 科室-选择 -->
              <el-select
               style="width: 55%"
                v-model="registration.deptId"
                placeholder="请选择科室"
                clearable
                @change="showDoc"
              >
                <el-option
                  v-for="item in dept_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医生">
              <!-- 医院-选择 -->
              <el-select
                v-model="registration.docId"
                style="width: 55%"
                placeholder="请选择医生"
                clearable
                @change="showDocDetail"
              >
                <el-option
                  v-for="item in doc_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 下半部分 -->
        <el-row :gutter="20" class="botoom_div">
          <!-- 下半部分-左边 -->
          <el-col :span="12">
            <el-descriptions title="医生信息" border column="1">
              <el-descriptions-item label="医生名称">{{
                doctor.name
              }}</el-descriptions-item>
              <el-descriptions-item label="科室">{{
                doctor.departmentId
              }}</el-descriptions-item>
              <el-descriptions-item label="毕业院校">{{
                doctor.school
              }}</el-descriptions-item>
              <el-descriptions-item label="专业">{{
                doctor.major
              }}</el-descriptions-item>
              <el-descriptions-item label="等待就诊人数">{{
                doctor.waitNums
              }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <!-- 下半部分-右边 -->
          <el-col :span="12">
            <h1 style="font-size: 16px; font-weight: 700">挂号信息：</h1>
            <el-form-item label="病情描述">
              <el-input
                type="textarea"
                v-model="registration.description"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述图片">
              <el-upload
                class="avatar-uploader"
                action="http://localhost:80/vaccinum/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!-- 隐藏输入字段，用来存储图片的文件名 -->
              <input type="hidden" name="avatar" v-model="registration.image" />
            </el-form-item>
            <el-form-item label="预约时间">
              <el-date-picker
                v-model="registration.bookTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                default-time="12:00:00"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addForm">立即预约</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <script>
    //导入request工具
    import request from "@/utils/request";
    import Cookies from "js-cookie";
    export default {
      data() {
        return {
          userId: "",
          imageUrl: "", //头像上传路径
          //医生和部门数据
          doc_options: [],
          dept_options: [],
          //表格数据
          tableData: [],
          registration: {
            id: 0, //挂号贴编号
            deptId: "", //挂号科室
            description: "", //描述信息
            image: "", //描述图片文件名
            regisTime: "", //挂号时间
            docId: "", //医生
            userId: "", //患者
            status: "", //状态
            bookTime: "", //预约时间
          },
          doctor: {
            id: 0,
            name: "暂无选择",
            password: "",
            password_check: "",
            phone: "",
            image: "", //头像文件名
            school: "暂无选择",
            major: "暂无选择",
            waitNums: "暂无选择",
            deptId: "",
            hosId: "",
            departmentId: "暂无选择",
            hospitalName: "暂无选择",
            role: "doctor",
          },
        };
      },
      //当vue创建后，发起请求查询数据
      created() {
        //获取登录用户角色
        var userJson = JSON.parse(Cookies.get("user"));
        this.userId = userJson.id;
        //查询医生
        request
          .get("/doctor/queryAll", {
            params: {},
          })
          .then((res) => {
            //处理响应
            if (res.flag == false) {
              this.$message.error(res.message);
            } else {
              this.doc_options = res.list;
            }
          });
        //查询科室
        request
          .get("/department/queryAll", {
            params: {},
          })
          .then((res) => {
            //处理响应
            if (res.flag == false) {
              this.$message.error(res.message);
            } else {
              this.dept_options = res.list;
            }
          });
      },
      methods: {
        //当下拉框医生改变时，获取医生详细信息 响应：doctor
        showDocDetail(value) {
          request
            .get("/doctor/selectById", {
              params: {
                id: value,
              },
            })
            .then((res) => {
              //处理响应
              if (res.flag == false) {
                this.$message.error(res.message);
              } else {
                this.doctor = res.doctor;
              }
            });
        },
        //部门下拉框改变时，获取当前部门的所有医生 响应：list
        showDoc(value) {
          console.log("值：" + value);
          this.registration.deptId = value;
          this.registration.docId = "";
          request
            .get("/doctor/selectByDeptId", {
              params: {
                deptId: value,
              },
            })
            .then((res) => {
              //处理响应
              if (res.flag == false) {
                this.$message.error(res.message);
              } else {
                this.doc_options = res.list;
              }
            });
        },
        //在上传成功后处理函数中，获取服务端返回的图片文件名或URL
        handleAvatarSuccess(res, file) {
          this.registration.image = res.fileName;
          this.imageUrl = URL.createObjectURL(file.raw);
          console.log("当前图片路径：" + this.imageUrl);
        },
        // 在上传之前，清空旧图片信息
        beforeAvatarUpload(file) {
          this.registration.image = "";
          this.imageUrl = "";
          const isJPG = file.type === "image/jpeg";
          const isPNG = file.type === "image/png";
          const isGIF = file.type === "image/gif";
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isJPG && !isPNG && !isGIF) {
            this.$message.error("上传头像图片只能是 JPG 或者 PNG 或者 GIF 格式!");
          }
          if (!isLt2M) {
            this.$message.error("上传头像图片大小不能超过 2MB!");
          }
          return (isJPG || isPNG || isGIF) && isLt2M;
        },
        //添加表单提交函数
        addForm() {
          this.registration.userId = this.userId;
          //获取时间
          let time = new Date();
          const year = time.getFullYear();
          const month = time.getMonth() + 1; // 月份从0开始，需要加1
          const day = time.getDate();
          const hour = time.getHours();
          const minute = time.getMinutes();
          const second = time.getSeconds();
          const formattedTime = `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
          //添加时间
          this.registration.regisTime = formattedTime;
          //状态为0即待接诊
          this.registration.status = 0;
          //发送请求
          request.post("/registration/add", this.registration).then((res) => {
            //处理响应
            if (res.flag == false) {
              //添加失败
              this.$message.error(res.message);
            } else {
              this.$message.success("预约成功");
              //清空数据
              this.registration = {
                id: 0, //挂号贴编号
                deptId: "", //挂号科室
                description: "", //描述信息
                image: "", //描述图片文件名
                regisTime: "", //挂号时间
                docId: "", //医生
                userId: "", //患者
                status: "", //状态
                bookTime: "", //预约时间
                docName: "",
                userName: "",
              };
              //图片路径清空
              this.imageUrl = "";
              this.doctor = {
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
                departmentId: "",
                hospitalName: "",
                role: "doctor",
              };
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
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .avatar {
      width: 150px;
      height: 150px;
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
    .el-row {
      margin-bottom: 20px;
    }
    .el-col {
      border-radius: 4px;
    }
    </style>