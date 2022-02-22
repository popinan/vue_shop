<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="100px"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            <span class="date">{{ scope.row.add_time | showDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 编辑用户对话框区 -->
    <!-- <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClose($refs.editFormRef)"
    >
      <el-form
        :model="editUserForm"
        :rules="addRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserData">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getGoods,
  editGoods,
  deleteGoods,
  getGoodsInfo,
} from "network/home.js";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
      editDialogVisible: false,
      editGoodsForm: {},
    };
  },
  created() {
    this.getGoodsData();
  },
  methods: {
    getGoodsData() {
      getGoods(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.$message.success(res.meta.msg);
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getGoodsData();
    },
    goAddPage() {
        this.$router.push({
          path: 'add_goods'})
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      getGoodsInfo(id).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editGoodsForm = res.data;
      });
    },
    deleteGoodsById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoods(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            if (this.goodsList.length === 1) {
              this.queryInfo.pagenum =
                this.queryInfo.pagenum === 1 ? 1 : this.queryInfo.pagenum - 1;
            }
            this.getGoodsData();
            this.$message.success(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>