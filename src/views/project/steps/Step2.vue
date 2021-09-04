<template>
  <div>
    <a-form :form='form' style='max-width: 760px; margin: 40px auto 0;'>

      <a-form-item label='条款和条件' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-textarea rows='2' />
      </a-form-item>

      <a-form-item label='特别规定' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-textarea rows='2' />
      </a-form-item>

      <a-form-item label='法律和管辖权' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-textarea rows='2' />
      </a-form-item>

      <a-form-item label='付款条件' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-textarea rows='2' />
      </a-form-item>

      <a-form-item label='附加信息' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-textarea rows='2' />
      </a-form-item>

      <a-form-item label='上传附件' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-upload-dragger
          name='file'
          :multiple='true'
          action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
          @change='handleChange'
        >
          <p class='ant-upload-drag-icon'>
            <a-icon type='inbox' />
          </p>
          <p class='ant-upload-text'>
            点击选择文件或将文件拖到此处
          </p>
          <!--
          <p class='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
          -->
        </a-upload-dragger>
      </a-form-item>

      <a-form-item :wrapperCol='{span: 14, offset: 10}'>
        <a-button :loading='loading' type='primary' @click='nextStep'>提交</a-button>
        <a-button style='margin-left: 8px' @click='prevStep'>上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Step2',
  data() {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0
    }
  },
  methods: {
    nextStep() {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          console.log('表单 values', values)
          that.timer = setTimeout(function() {
            that.loading = false
            that.$emit('nextStep')
          }, 1500)
        } else {
          that.loading = false
        }
      })
    },
    prevStep() {
      this.$emit('prevStep')
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang='less' scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}

</style>
