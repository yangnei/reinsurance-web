<template>
  <a-modal
    title='设置状态'
    :width='640'
    :visible='visible'
    :confirmLoading='loading'
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning='loading'>
      <a-form :form='form' v-bind='formLayout'>
        <a-form-item label='项目编号' style='display: none;'>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item label='项目名称'>{{ form.getFieldValue('name') }}</a-form-item>
        <a-form-item label='设置状态'>
          <a-select placeholder='请选择' v-decorator="['status', { rules: [{ required: true, message: '请选择项目状态' }] }]">
            <a-select-option :value='1'>
              <a-badge color='#2db7f5' text='待处理' />
            </a-select-option>
            <a-select-option :value='2'>
              <a-badge color='#54a0ff' text='核保中' />
            </a-select-option>
            <a-select-option :value='3'>
              <a-badge color='#f8ac59' text='待确认回' />
            </a-select-option>
            <a-select-option :value='4'>
              <a-badge color='#23c6c8' text='待录系统' />
            </a-select-option>
            <a-select-option :value='5'>
              <a-badge color='#18a689' text='已双确认' />
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='设置日期'>
          <a-date-picker style='width: 100%' placeholder='' v-decorator="['date', { rules: [{ required: true, message: '请设置项目状态日期' }], initialValue: moment() }]" />
        </a-form-item>
        <a-form-item label='备忘记录'>
          <a-textarea
            placeholder=''
            :auto-size='{ minRows: 3, maxRows: 5 }'
            v-decorator="['comment']"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'

// 表单字段
const fields = ['id', 'name', 'status']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created() {

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    moment
  }
}
</script>
