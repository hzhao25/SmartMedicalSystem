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
          <el-form-item label="疫苗">
            <el-select
              v-model="appointment.vaccineId"
              placeholder="请选择疫苗"
              clearable
              style="width: 55%"
            >
              <el-option
                v-for="item in vaccine_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="医院">
            <el-select
                v-model="appointment.hospitalId"
                placeholder="请选择医院"
                clearable
                style="width: 55%"
                @change="updateAddress"
            >
                <el-option
                v-for="item in hospital_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                />
            </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="医生">
            <el-select
              v-model="appointment.doctorId"
              placeholder="请选择医生"
              clearable
              style="width: 55%"
            >
              <el-option
                v-for="item in doctor_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 下半部分 -->
      <el-row :gutter="20" class="botoom_div">
        <el-col :span="12">
          <h1 style="font-size: 16px; font-weight: 700">预约信息：</h1>
          <el-form-item label="接种地址">
            <el-input v-model="appointment.address" autocomplete="off" />
          </el-form-item>
          <el-form-item label="预约时间">
            <el-date-picker
              v-model="appointment.appDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="12:00:00"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAppointment">立即预约</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </template>
  <script>
  import request from "@/utils/request";
  import Cookies from "js-cookie";
  
  export default {
    data() {
      return {
        userId: "",
        appointment: {
          id: 0,
          vaccineId: "",
          doctorId: "",
          address: "",
          appDate: "",
          status: 0, // 状态为0即待接种
        },
        vaccine_options: [],
        doctor_options: [],
      };
    },
    created() {
      const userJson = JSON.parse(Cookies.get("user"));
      this.userId = userJson.id;
  
      // 查询疫苗
      request.get("/vaccine/queryAll").then((res) => {
        if (res.flag === false) {
          this.$message.error(res.message);
        } else {
          this.vaccine_options = res.list;
        }
      });
      // 查询医院
        request.get("/hospital/queryAll").then((res) => {
        if (res.flag === false) {
            this.$message.error(res.message);
        } else {
            this.hospital_options = res.list;
        }
        });
      // 查询医生
      request.get("/doctor/queryAll").then((res) => {
        if (res.flag === false) {
          this.$message.error(res.message);
        } else {
          this.doctor_options = res.list;
        }
      });
    },
    methods: {
      // 更新地址
        updateAddress(hospitalId) {
        const selectedHospital = this.hospital_options.find(hospital => hospital.id === hospitalId);
        if (selectedHospital) {
            this.appointment.address = selectedHospital.address; // 假设医院对象中有地址字段
        }
        this.appointment.doctorId = ""; // 清空医生选择
        this.updateDoctors(hospitalId); // 更新医生列表
        },
      // 更新医生列表
        updateDoctors(hospitalId) {
        this.appointment.doctorId = ""; // 清空医生选择
        request.get("/doctor/selectByHospitalId", { params: { hospitalId } }).then((res) => {
            if (res.flag === false) {
            this.$message.error(res.message);
            } else {
            this.doctor_options = res.list;
            }
        });
      },
      submitAppointment() {
        this.appointment.userId = this.userId;
  
        request.post("/appointment/add", this.appointment).then((res) => {
          if (res.flag === false) {
            this.$message.error(res.message);
          } else {
            this.$message.success("预约成功");
            this.resetForm();
          }
        });
      },
      resetForm() {
        this.appointment = {
          id: 0,
          vaccineId: "",
          doctorId: "",
          address: "",
          appDate: "",
          status: 0,
        };
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