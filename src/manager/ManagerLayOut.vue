<template>
  <div>
    <!-- 头部 -->
    <ManagerHeader />
    <!-- 主题 -->

    <div style="display: flex">
      <!-- 主题-左边 -->
      <ManagerAside />
      <!-- 主题-右边  flex: 1 自适应布局 -->
      <router-view style="flex: 1;padding: 30px;"  />
      <img src="@/assets/首页图片.gif" alt="首页图片" v-if="showImage" style="margin-top: -100px;" width="100%" height="800px">
    </div>
  </div>
</template>
    
    <!-- js -->
    <script>
// 导入组件
import ManagerHeader from "@/manager/ManagerHeader";
import ManagerAside from "@/manager/ManagerAside";

export default {
  name: "ManagerLayOut",
  data(){
    return{
      showImage: false,
    };
  },
  computed: {
    //判断当前页面是不是DoctorLayout
    isLayoutPage() {
      return this.$route.path === '/ManagerLayout';
    }
  },
  //对isLayoutPage进行监听
  watch: {
    isLayoutPage(newValue) {
      this.showImage = newValue;
    }
  },
  created() {
    // 初始化时检查当前页面路径
    this.showImage = this.isLayoutPage;
  },
  //  使用哪些组件
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ManagerHeader,
    // eslint-disable-next-line vue/no-unused-components
    ManagerAside,
  },
};
</script>