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
  import ManagerHeader from "./ManagerHeader.vue";
  import ManagerAside from "./ManagerAside.vue";
  
  export default {
    name: "DoctorLayOut",
    //  使用哪些组件
    components: {
      // eslint-disable-next-line vue/no-unused-components
      ManagerHeader,
      // eslint-disable-next-line vue/no-unused-components
      ManagerAside,
    },
  };
  </script>