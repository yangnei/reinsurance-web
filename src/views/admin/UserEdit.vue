<template>
  <page-header-wrapper
    :breadcrumb='false'
    :content="isUpdate ? `更新「${form.displayName}」（编号：${form.id}）` : ''"
    :title="isUpdate ? '更新用户' : '创建用户'"
  >
    <a-card :body-style="{ padding: '24px 32px' }" :bordered='false'>

      <a-form-model ref='userForm' :label-col='labelCol' :model='form' :rules='rules' :wrapper-col='wrapperCol'>

        <a-form-model-item label='用户账号' prop='username'>
          <a-input v-model='form.username' placeholder='请输入' />
        </a-form-model-item>

        <a-form-model-item label='用户名称' prop='displayName'>
          <a-input v-model='form.displayName' placeholder='请输入' />
        </a-form-model-item>

        <a-form-model-item label='登录密码' prop='password'>
          <a-input-password v-model='form.password' placeholder='请输入' />
        </a-form-model-item>

        <a-form-item :wrapperCol='{ span: 24 }' style='text-align: center'>
          <a-button type='primary' @click='handle_submit'>提交</a-button>
          <a-button style='margin-left: 8px' @click='handle_cancel'>取消</a-button>
        </a-form-item>

      </a-form-model>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { fetching_user, saving_user } from '@/api/user'
import notification from 'ant-design-vue/lib/notification'

/**
 * 创建用户、用户编辑页面
 */
export default {
  name: 'UserEdit',
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      isUpdate: false,
      form: {
        id: 0,
        username: '',
        displayName: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        displayName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id === '0') {
      // create
    } else {
      fetching_user(id).then(res => {
        if (res.code === 0 && res.result) {
          this.form = {
            id: res.result.id,
            username: res.result.username,
            displayName: res.result.displayName
          }
          this.isUpdate = true
        } else {
          notification.error({
            message: '获取用户信息失败',
            description: `【错误代码】${res.code || '未知'}，【错误消息】${res.message || '未知'}`
          })
        }
      })
    }
  },
  methods: {

    /**
     * 提交表单
     *
     * @param e 事件
     */
    handle_submit(e) {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          return saving_user(this.form).then(res => {
            if (res.code === 0 && res.result) {
              this.$router.push({ name: 'UserList' })
              this.$message.success(this.isUpdate ? '更新用户成功' : '创建用户成功')
            } else {
              notification.error({
                message: this.isUpdate ? '用户更新信息失败' : '创建用户失败',
                description: `【错误代码】${res.code || '未知'}，【错误消息】${res.message || '未知'}`
              })
            }
          })
        } else {
          return false
        }
      })
    },

    /**
     * 放弃表单内容，返回用户列表
     *
     * @param e 事件
     */
    handle_cancel(e) {
      this.$refs.userForm.resetFields()
      this.$router.push({ name: 'UserList' })
    }
  }
}
</script>
