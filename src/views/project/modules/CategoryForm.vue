<template>
  <a-modal
    title='新增保险种类'
    :width='640'
    :visible='visible'
    :confirmLoading='loading'
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning='loading'>
      <a-form-model
        ref='form'
        :model='form'
        :rules='rules'
        :label-col='labelCol'
        :wrapper-col='wrapperCol'
      >
        <a-form-model-item ref='name' label='保险种类名称' prop='name'>
          <a-input v-model='form.name' placeholder='请输入保险种类名称' />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入保险种类名称', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>