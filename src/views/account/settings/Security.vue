<template>
  <div>
    <a-list
      itemLayout='horizontal'
      :dataSource='data'
    >
      <a-list-item slot='renderItem' slot-scope='item, index' :key='index'>
        <a-list-item-meta>
          <a slot='title'>{{ item.title }}</a>
          <span slot='description'>
            <span class='security-list-description'>{{ item.description }}</span>
            <span v-if='item.value'> : </span>
            <span class='security-list-value'>{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if='item.actions'>
          <a slot='actions' @click='item.actions.callback'>{{ item.actions.title }}</a>
        </template>

      </a-list-item>
    </a-list>
    <a-modal v-model='visible' title='修改密码' @ok='handleOk'>
      <a-form-model
        ref='form'
        layout='vertical'
        :model='form'
        :rules='rules'
      >
        <a-form-model-item label='新密码' prop='password'>
          <a-input type='password' v-model='form.password' placeholder='请输入新密码' />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { updating_password } from '@/api/user'
import notification from 'ant-design-vue/lib/notification'

export default {
  data() {
    return {
      visible: false,
      form: {
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    data() {
      return [
        {
          title: this.$t('account.settings.security.password'),
          description: '建议密码长度超过8位，由字母、数字和符号两种以上的组合，新密码请您妥善保存',
          value: null,
          actions: {
            title: this.$t('account.settings.security.modify'), callback: () => {
              this.openModal()
            }
          }
        }
        // { title: this.$t('account.settings.security.phone'), description: this.$t('account.settings.security.phone-description'), value: '138****8293', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.info('This is a message') } } },
        // { title: this.$t('account.settings.security.email'), description: this.$t('account.settings.security.email-description'), value: 'ant***sign.com', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.info('This is a message') } } },
      ]
    }
  },
  methods: {
    openModal() {
      this.visible = true
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          return updating_password(this.form).then(res => {
            console.debug('update password successful', res)
            if (res.code === 0) {
              this.$message.success('密码修改成功')
            } else {
              notification.error({
                message: '密码修改失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
            this.visible = false
          })
        } else
          return false
      })
    }
  }
}
</script>

<style scoped>

</style>
