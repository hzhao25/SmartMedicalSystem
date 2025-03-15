<template>
  <div>
    <!-- 头部 -->
    <HeaDer />
    <!-- 主题 -->

    <div style="display: flex">
      <!-- 主题-左边 -->
      <ASide />
      <!-- 主题-右边  flex: 1 自适应布局 -->
      <router-view style="flex: 1;padding: 30px;"  />
      <img src="@/assets/首页图片.gif" alt="首页图片" v-if="showImage" style="margin-top: -100px;" width="100%" height="800px">
    </div>
  </div>
</template>
    
    <!-- js -->
    <script>
// 导入组件
import HeaDer from "@/components/HeaDer";
import ASide from "@/components/ASide";

export default {
  name: "LayOut",
  data(){
    return{
      showImage: false,
    };
  },
  computed: {
    isLayoutPage() {
      return this.$route.path === '/Layout';
    }
  },
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
    HeaDer,
    // eslint-disable-next-line vue/no-unused-components
    ASide,
  },
};
</script>