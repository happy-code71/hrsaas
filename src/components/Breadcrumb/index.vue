<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group> -->
    江苏传智播客教育科技股份有限公司
    <el-tag type="info">体验版</el-tag>
  </el-breadcrumb>
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: block;
  height: 50px;
  font-size: 18px;
  line-height: 50px;
  padding-left: 5px;
  color: white;
  position: relative;

  .el-tag.el-tag--info {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
  }
}
</style>
