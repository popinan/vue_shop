<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 作用域插槽，通过"scope.row"参数可以获取本行对象 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="权限配置"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增用户对话框区 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="dialogClose($refs.ruleFormRef)"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="ruleFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addRuleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框区 -->
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  userStateChange,
  addUser,
  getIdInfo,
  editUser,
  deleteUser,
} from "network/home.js";
import { rules } from "common/mixin.js";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addRuleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUserForm: {},
    };
  },
  mixins: [rules],
  created() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      getUserList(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.$message.success(res.meta.msg);
        this.userList = res.data.users;
        this.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserData();
    },
    stateChange(val) {
      console.log(val);
      userStateChange(val.id, val.mg_state).then((res) => {
        // console.log(res)
        if (res.meta.status !== 200) {
          val.mg_state = !val.mg_state;
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    dialogClose(ref) {
      ref.resetFields();
    },
    addUserData() {
      this.dialogVisible = false;
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          addUser(this.addRuleForm).then((res) => {
            console.log(res);
            if (res.meta.status !== 201)
              return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.getUserData();
          });
        }
      });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      getIdInfo(id).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editUserForm = res.data;
      });
    },
    editUserData() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          editUser(this.editUserForm).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.editDialogVisible = false;
            this.getUserData();
            this.$message.success(res.meta.msg);
          });
        }
      });
    },
    deleteUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.getUserData();
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
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0 0 0 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>