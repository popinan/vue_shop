<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addCategorie">添加分类</el-button>
      <tree-table
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="!scope.row.cat_deleted"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框区 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClose($refs.addCateFormRef)"
    >
      <el-form
        :model="addCateForm"
        :rules="addRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedValue"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
            clearable
            @change="addCateFormChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框区 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClose($refs.editCateFormRef)"
    >
      <el-form
        :model="editCateForm"
        :rules="addRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类ID：" prop="cat_id">
          <el-input v-model="editCateForm.cat_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  addCategory,
  getCateInfo,
  editCategory,
  deletCategory,
} from "network/home.js";
import { rules } from "common/mixin.js";

export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      goodsList: [],
      total: 0,
      //添加分类对话框参数
      addDialogVisible: false,
      addCateForm: {
        cat_pid: 0, //父级分类id
        cat_name: "", //分类名称
        cat_level: 0, //分类等级
      },
      parentCateList: [],
      selectedValue: [],
      //编辑分类对话框参数
      editDialogVisible: false,
      editCateForm: {},
      //tree-table插件参数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "300px",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列的模板名称
          template: "isok",
          width: "200px",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列的模板名称
          template: "order",
          width: "200px",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列的模板名称
          template: "operate",
          width: "200px",
        },
      ],
    };
  },
  mixins: [rules],
  created() {
    this.getGoodsData();
  },
  methods: {
    getGoodsData() {
      getGoodsList(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.$message.success(res.meta.msg);
        this.goodsList = res.data.result;
        this.total = res.data.total;
      });
    },
    getParentCateData() {
      getGoodsList({ type: 2 }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.$message.success(res.meta.msg);
        this.parentCateList = res.data;
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
    addCategorie() {
      this.getParentCateData();
      this.addDialogVisible = true;
    },
    dialogClose(ref) {
      ref.resetFields();
      this.selectedValue = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    addCateFormChange() {
      if (this.selectedValue.length !== 0) {
        this.addCateForm.cat_pid =
          this.selectedValue[this.selectedValue.length - 1];
        this.addCateForm.cat_level = this.selectedValue.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      getCateInfo(id).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editCateForm = res.data;
      });
    },
    editCateData() {
      this.$refs.editCateFormRef.validate((valid) => {
        if (valid) {
          editCategory(this.editCateForm).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.getGoodsData();
            this.$message.success("修改分类信息成功");
            this.editDialogVisible = false;
          });
        } else return false;
      });
    },
    deleteCateById(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletCategory(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.getGoodsData();
            this.$message.success("删除分类信息成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addCateData() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate((valid) => {
        if (valid) {
          addCategory(this.addCateForm).then((res) => {
            console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg);
            }
            this.$message.success("添加分类成功");
            this.addDialogVisible = false;
            this.getGoodsData();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.zk-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-cascader {
  width: 100%;
}
</style>