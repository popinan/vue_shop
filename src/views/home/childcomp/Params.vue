<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedValue"
            :options="goodsList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="tableData.many" stripe border fit>
            <!-- 展开扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="tableData.only" stripe border fit>
            <!-- 展开扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框区 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClose($refs.addParamFormRef)"
    >
      <el-form
        :model="addParamForm"
        :rules="addRules"
        ref="addParamFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框区 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClose($refs.editParamFormRef)"
    >
      <el-form
        :model="editParamForm"
        :rules="addRules"
        ref="editParamFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  getParamsList,
  addParams,
  getParamInfo,
  editParam,
  deletParam,
} from "network/home.js";
import { rules } from "common/mixin.js";

export default {
  data() {
    return {
      goodsList: [],
      selectedValue: [],
      //   被激活页签的名称
      activeName: "many",
      tableData: {
        many: [],
        only: [],
      },
      addDialogVisible: false,
      addParamForm: {
        attr_name: "",
      },
      editDialogVisible: false,
      editParamForm: {},
    };
  },
  mixins: [rules],
  created() {
    getGoodsList().then((res) => {
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.goodsList = res.data;
    });
  },
  methods: {
    getParams() {
      getParamsList(this.getCateId, this.activeName).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        // console.log(res.data)
        if (this.activeName === "many") {
          this.tableData.many = res.data;
        } else {
          this.tableData.only = res.data;
        }
      });
    },
    handleChange() {
      if (this.selectedValue.length !== 3) {
        this.selectedValue = [];
        this.tableData.many = [];
        this.tableData.only = [];
        return this.$message.error("请选择三级分类商品！");
      }
      this.getParams();
    },
    handleClick() {
      this.getParams();
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      const attrinfo = { id: id, attr_sel: this.activeName };
      getParamInfo(this.getCateId, attrinfo).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editParamForm = res.data;
      });
    },
    deleteParamById(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletParam(this.getCateId, id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.getParams();
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
    dialogClose(ref) {
      ref.resetFields();
    },
    addParamData() {
      this.$refs.addParamFormRef.validate((valid) => {
        if (valid) {
          const paramInfo = {
            attr_name: this.addParamForm.attr_name,
            attr_sel: this.activeName,
          };
          addParams(this.getCateId, paramInfo).then((res) => {
            if (res.meta.status !== 201)
              return this.$message.error(res.meta.msg);
            this.$message.success("添加参数成功");
            this.getParams();
            this.addDialogVisible = false;
          });
        }
      });
    },
    editParamData() {
      this.$refs.editParamFormRef.validate((valid) => {
        if (valid) {
          const attrinfo = {
            id: this.editParamForm.attr_id,
            attr_name: this.editParamForm.attr_name,
            attr_sel: this.activeName,
          };
          editParam(this.getCateId, attrinfo).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.$message.success("修改参数成功");
            this.getParams();
            this.editDialogVisible = false;
          });
        }
      });
    },
    showInput(row) {
      row.inputVisible = true;
      // $nextTick方法作用：当页面上元素被重新渲染之后，才会制定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    saveAttrvals(row) {
      const attrinfo = {
        id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(","),
      };
      editParam(this.getCateId, attrinfo).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("修改参数项成功");
      });
    },
    handleInputConfirm(row) {
      let inputValue = row.inputValue.trim();
      if (inputValue) {
        row.attr_vals.push(inputValue);
        this.saveAttrvals(row)
      }
      row.inputVisible = false;
      row.inputValue = "";
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrvals(row)
    },
  },
  computed: {
    isBtnDisabled() {
      return this.selectedValue.length === 3 ? false : true;
    },
    getCateId() {
      if (this.selectedValue.length === 3) return this.selectedValue[2];
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style scoped>
.el-row {
  margin: 15px 0;
}
.el-tag,
.input-new-tag,
.button-new-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>