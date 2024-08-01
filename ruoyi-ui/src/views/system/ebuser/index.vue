<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入用户邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别[1:男，2:女，0:保密]" prop="gender">
        <el-input
          v-model="queryParams.gender"
          placeholder="请输入性别[1:男，2:女，0:保密]"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="openId" prop="openId">
        <el-input
          v-model="queryParams.openId"
          placeholder="请输入openId"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入头像"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赞赏" prop="admire">
        <el-input
          v-model="queryParams.admire"
          placeholder="请输入赞赏"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用[0:未删除，1:已删除]" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入是否启用[0:未删除，1:已删除]"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="EbuserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="手机号" align="center" prop="phoneNumber" />
      <el-table-column label="用户邮箱" align="center" prop="email" />
      <el-table-column label="是否启用[0:否，1:是]" align="center" prop="userStatus" />
      <el-table-column label="性别[1:男，2:女，0:保密]" align="center" prop="gender" />
      <el-table-column label="openId" align="center" prop="openId" />
      <el-table-column label="头像" align="center" prop="avatar" />
      <el-table-column label="赞赏" align="center" prop="admire" />
      <el-table-column label="订阅" align="center" prop="subscribe" />
      <el-table-column label="简介" align="center" prop="introduction" />
      <el-table-column label="用户类型[0:admin，1:管理员，2:普通用户]" align="center" prop="userType" />
      <el-table-column label="是否启用[0:未删除，1:已删除]" align="center" prop="deleted" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:Ebuser:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:Ebuser:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="性别[1:男，2:女，0:保密]" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别[1:男，2:女，0:保密]" />
        </el-form-item>
        <el-form-item label="openId" prop="openId">
          <el-input v-model="form.openId" placeholder="请输入openId" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="赞赏" prop="admire">
          <el-input v-model="form.admire" placeholder="请输入赞赏" />
        </el-form-item>
        <el-form-item label="订阅" prop="subscribe">
          <el-input v-model="form.subscribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否启用[0:未删除，1:已删除]" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入是否启用[0:未删除，1:已删除]" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userlist } from "@/api/system/ebUser";

export default {
  name: "Ebuser",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表格数据
      EbuserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        password: null,
        phoneNumber: null,
        email: null,
        userStatus: null,
        gender: null,
        openId: null,
        avatar: null,
        admire: null,
        subscribe: null,
        introduction: null,
        userType: null,
        deleted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userStatus: [
          { required: true, message: "是否启用[0:否，1:是]不能为空", trigger: "change" }
        ],
        userType: [
          { required: true, message: "用户类型[0:admin，1:管理员，2:普通用户]不能为空", trigger: "change" }
        ],
        deleted: [
          { required: true, message: "是否启用[0:未删除，1:已删除]不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户信息列表 */
    getList() {
      this.loading = true;
      userlist().then(response => {
        console.log(response.rows);
        this.EbuserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        username: null,
        password: null,
        phoneNumber: null,
        email: null,
        userStatus: null,
        gender: null,
        openId: null,
        avatar: null,
        admire: null,
        subscribe: null,
        introduction: null,
        userType: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        deleted: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEbuser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEbuser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEbuser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户信息编号为"' + ids + '"的数据项？').then(function() {
        return delEbuser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/Ebuser/export', {
        ...this.queryParams
      }, `Ebuser_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
