<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格(元)"
          width="100px"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            <span class="date">{{ scope.row.create_time | showDate }}</span>
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
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
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
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框区 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClose($refs.editFormRef)"
    >
      <el-form
        :model="editaddrForm"
        :rules="addRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editaddrForm.address1"
            :options="cityData"
            :props="{
              expandTrigger: 'hover',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editaddrForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editaddrData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流查询对话框区 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { order_rules } from "common/mixin.js";
import cityData from "common/citydata.js";
import { getOrders, getProgress } from "network/home.js";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      editaddrForm: {
        address1: [],
        address2: "",
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      getOrders(this.queryInfo).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.$message.success(res.meta.msg);
        this.orderList = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
    },
    showProgressBox() {
      getProgress().then((res) => {
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取物流进度失败！");
        this.progressDialogVisible = true;
        this.progressInfo = res.data;
      });
      // this.progressInfo = [
      //   {
      //     time: '2018-05-10 09:39:00',
      //     ftime: '2018-05-10 09:39:00',
      //     context: '已签收,感谢使用顺丰,期待再次为您服务',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-10 08:23:00',
      //     ftime: '2018-05-10 08:23:00',
      //     context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-10 07:32:00',
      //     ftime: '2018-05-10 07:32:00',
      //     context: '快件到达 [北京海淀育新小区营业点]',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-10 02:03:00',
      //     ftime: '2018-05-10 02:03:00',
      //     context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-09 23:05:00',
      //     ftime: '2018-05-09 23:05:00',
      //     context: '快件到达 [北京顺义集散中心]',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-09 21:21:00',
      //     ftime: '2018-05-09 21:21:00',
      //     context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-09 13:07:00',
      //     ftime: '2018-05-09 13:07:00',
      //     context: '顺丰速运 已收取快件',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-09 12:25:03',
      //     ftime: '2018-05-09 12:25:03',
      //     context: '卖家发货',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-09 12:22:24',
      //     ftime: '2018-05-09 12:22:24',
      //     context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
      //     location: ''
      //   },
      //   {
      //     time: '2018-05-08 21:36:04',
      //     ftime: '2018-05-08 21:36:04',
      //     context: '商品已经下单',
      //     location: ''
      //   }
      // ]
    },
    editaddrData() {},
    dialogClose(ref) {
      ref.resetFields();
    },
  },
  mixins: [order_rules],
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>