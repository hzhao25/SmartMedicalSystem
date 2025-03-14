<template>
  <div>
    <!-- 头部 -->
    <DoctorHeaDer />
    <!-- 主题 -->

    <div style="display: flex">
      <!-- 主题-左边 -->
      <DoctorASide />
      <!-- 主题-右边  flex: 1 自适应布局 -->
      <router-view style="flex: 1;padding: 30px;"  />
    </div>
  </div>
</template>
    
    <!-- js -->
    <script>
// 导入组件
import DoctorHeaDer from "@/doctor/DoctorHeaDer";
import DoctorASide from "@/doctor/DoctorASide";

export default {
  name: "DoctorLayOut",
  //  使用哪些组件
  components: {
    // eslint-disable-next-line vue/no-unused-components
    DoctorHeaDer,
    // eslint-disable-next-line vue/no-unused-components
    DoctorASide,
  },
};
</script>