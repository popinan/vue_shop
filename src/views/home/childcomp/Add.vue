<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addruleFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0"
            ><el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addRuleForm.goods_price"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addRuleForm.goods_weight"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addRuleForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addRuleForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader></el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品参数" name="1"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品属性" name="2"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片上传的API接口地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :on-success="handleSuccess"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addRuleForm.goods_introduce"
            />
            <el-button type="primary" class="addBtn" @click="add"
              >添加商品</el-button
            ></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="preDialogVisible" width="50%">
      <img :src="previewUrl" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { goods_rules } from "common/mixin.js";
import _ from "lodash";
import { getGoodsList, getParamsList, addGoods } from "network/home.js";

export default {
  data() {
    return {
      activeIndex: 0,
      addRuleForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      cateList: [],
      manyTabData: [],
      onlyTabData: [],
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      fileList: [],
      previewUrl: "",
      preDialogVisible: false,
    };
  },
  created() {
    getGoodsList().then((res) => {
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.cateList = res.data;
    });
  },
  methods: {
    handleChange() {
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.addRuleForm.goods_cat.length = [];
      }
    },
    beforeLeaveTab(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    tabClick() {
      if (this.activeIndex === "1") {
        getParamsList(this.cateId, "many").then((res) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          this.manyTabData = res.data;
        });
      } else if (this.activeIndex === "2") {
        getParamsList(this.cateId, "only").then((res) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.onlyTabData = res.data;
        });
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      const filePath = file.response.data.tmp_path;
      let i = this.addRuleForm.pics.findIndex((item) => item.pic === filePath);
      this.addRuleForm.pics.splice(i, 1);
    },
    handlePreview(file) {
      this.previewUrl = file.response.data.url;
      this.preDialogVisible = true;
    },
    handleSuccess(res) {
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      const picObj = { pic: res.data.tmp_path };
      this.addRuleForm.pics.push(picObj);
    },
    add() {
      this.$refs.addruleFormRef.validate((valid) => {
        if (!valid) return this.$message.error("请填写必要表单项！");
        // 深拷贝addRuleForm数据，避免影响cascader模块
        var form = _.cloneDeep(this.addRuleForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTabData.forEach(item => {
          let info = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
          this.addRuleForm.attrs.push(info)
        });
        // 处理静态属性
        this.onlyTabData.forEach(item => {
          let info = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addRuleForm.attrs.push(info)
        });
        form.attrs = this.addRuleForm.attrs
        // console.log(form)
        addGoods(form).then(res => {
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success('添加商品信息成功');
          this.$router.push('goods');
        })
      });
    },
  },
  mixins: [goods_rules],
  computed: {
    cateId() {
      if (this.addRuleForm.goods_cat.length === 3) {
        return this.addRuleForm.goods_cat[2];
      }
    },
    headerObj() {
      return { Authorization: sessionStorage.getItem("token") };
    },
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0px 10px 10px 0px !important;
}
.previewImg {
  /* height: 100%; */
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>