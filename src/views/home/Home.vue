<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/header.jpeg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="loginOut" type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="widthChange">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="getUrlsub"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(item, index) in menuList"
            :key="index"
            :index="index + ''"
          >
            <template slot="title">
              <i :class="iconInfo[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="(childitem, childindex) in item.children"
              :key="childindex"
              :index="childitem.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ childitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "network/home.js";
import Welcome from './childcomp/Welcome.vue';

export default {
  components: { Welcome },
  created() {
    getMenuList().then((res) => {
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    });
  },
  data() {
    return {
      menuList: [],
      iconInfo: {
        0: "el-icon-s-custom",
        1: "el-icon-s-opportunity",
        2: "el-icon-s-shop",
        3: "el-icon-s-order",
        4: "el-icon-s-marketing",
      },
      isCollapse: false,
    };
  },
  computed: {
    widthChange() {
      return this.isCollapse? '64px' : '200px'
    },
    getUrlsub() {
      let url = this.$route.path
      const lastItem = url.substring(url.lastIndexOf('/')+1)
      // console.log(lastItem)
      return lastItem
    },
  },
  methods: {
    loginOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
};
</script>

<style>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  /* padding-left: 0px; */
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 15px;
}
.el-aside {
  background-color: #333744;
  /* color: #333; */
  /* text-align: center; */
  line-height: 200px;
}
.el-aside .el-menu {
  border-right: 0px;
}
.el-main {
  background-color: #eaedf1;
  color: #333;
  /* text-align: center; */
}

body > .el-container {
  margin-bottom: 40px;
}

/* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } */
.toggle-button {
  background-color: #4a5064;
  line-height: 24px;
  color: #fff;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>