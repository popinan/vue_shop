<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleList" stripe border fit>
        <!-- 展开扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="delRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
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
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增角色对话框区 -->
    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="roleDialogClose($refs.roleFormRef)"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRules"
        ref="roleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框区 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="roleDialogClose($refs.editRoleFormRef)"
    >
      <el-form
        :model="editRolesForm"
        :rules="addRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editRolesForm.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框区 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsTree"
        :props="rightsTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        ref="rightsTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightsAllocate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  getRoleInfo,
  editRole,
  deleteRole,
  addRole,
  deleteRoleRight,
  getRightsTree,
  allocateRights,
} from "network/home.js";
import { rules } from "common/mixin.js";

export default {
  data() {
    return {
      roleList: [],
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRolesForm: {},
      dialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      // 树形控件对象
      rightsTree: [],
      // 树形控件属性绑定
      rightsTreeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中节点的ID值数组
      defaultCheckedKeys: [],
      currentRoleId: "",
    };
  },
  mixins: [rules],
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const res = await getRolesList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.roleList = res.data;
      console.log(this.roleList);
    },
    addRoleData() {
      this.addDialogVisible = false;
      addRole(this.addRoleForm).then((res) => {
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getRolesList();
      });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      getRoleInfo(id).then((res) => {
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editRolesForm = res.data;
      });
    },
    editRoleData() {
      editRole(this.editRolesForm).then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success(res.meta.msg);
      });
    },
    deleteRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error(res.meta.msg);
            this.getRolesList();
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
    roleDialogClose(ref) {
      ref.resetFields();
    },
    delRightById(roleInfo, rightId) {
      this.$confirm("此操作将删除该角色对应权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRoleRight(roleInfo.id, rightId).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error("删除权限失败");
            roleInfo.children = res.data;
            // this.$message.success(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async showSetRightDialog(node) {
      this.currentRoleId = node.id;
      const res = await getRightsTree();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightsTree = res.data;
      this.defaultCheckedKeys = [];
      this.getLeafKeys(node, this.defaultCheckedKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归形式，获取角色下所有三级权限的ID，并保存
    getLeafKeys(node, keyarray) {
      if (!node.children) {
        return keyarray.push(node.id);
      }
      node.children.forEach((child) => {
        this.getLeafKeys(child, keyarray);
      });
    },
    rightsAllocate() {
      const rightsList = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ].join(",");
      // console.log(rightsList);
      allocateRights(this.currentRoleId, rightsList)
        .then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("该角色分配权限失败");
          this.$message.success("该角色分配权限成功");
          this.setRightDialogVisible = false;
          this.getRolesList();
        })
        .catch((err) => this.$message.error(err));
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  padding-left: 70px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>