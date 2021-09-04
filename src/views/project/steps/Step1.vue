<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">

      <a-form-item label='项目名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-input v-decorator="[ 'name',{rules: [{ required: true, message: '请输入项目名称' }]}]" name='name' placeholder='给项目起个名字' />
      </a-form-item>

      <a-form-item label='保险期限' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-range-picker name='buildTime'
                        style='width: 100%'
                        v-decorator="[ 'buildTime', {rules: [{ required: true, message: '请输入保险期限' }], initialValue: [moment(), moment().add(1, 'year').subtract(1, 'day')]}]" />
      </a-form-item>

      <a-form-item label='保险种类' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-select placeholder='请选择' v-decorator="[ 'projectType', {rules: [{ required: true, message: '请选择保险种类' }]}]">
          <a-select-option value='0'>全部</a-select-option>
          <a-select-option value='1'>财产一切险</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label='合同类型' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-radio-group :default-value='1'>
          <a-radio :value='1'>Obligated合约</a-radio>
          <a-radio :value='2'>Non-obliged协议</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label='要约日期' :labelCol='labelCol' :wrapperCol='wrapperCol' :required='true'>
        <a-date-picker />
      </a-form-item>

      <a-form-item label='原被保险人' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-input v-decorator="[ 'insured',{rules: [{ required: true, message: '请输入原被保险人名称' }]}]" name='name' placeholder='请输入原被保险人名称' />
      </a-form-item>

      <a-form-item label='经纪公司' :labelCol='labelCol' :wrapperCol='wrapperCol' :style='{ marginBottom: 0 }'>
        <a-form-item :style="{ display: 'inline-block', width: '52px' }">
          <a-switch checked-children='有' un-checked-children='无' v-decorator="['viaBroker', { valuePropName: 'checked', initialValue: false }]" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('viaBroker') === true" :style="{ display: 'inline-block', width: '245px' }">
          <a-select placeholder='请选择' v-decorator="[ 'brokerCompany', {rules: [{ required: true, message: '请选择保险经纪公司' }]}]">
            <a-select-option value='0'>五洲（北京）保险经纪有限公司</a-select-option>
            <a-select-option value='1'>生活空间保险经纪有限公司</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('viaBroker') === true" :style="{ display: 'inline-block', width: '98px', textAlign: 'right' }">
          <a-checkbox>本地公司</a-checkbox>
        </a-form-item>
      </a-form-item>

      <a-form-item label='分出公司' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <div :style="{ display: 'inline-block', width: '298px' }">
          <a-select placeholder='请选择' v-decorator="[ 'cedant', {rules: [{ required: true, message: '请选择分出公司' }]}]">
            <a-select-option value='0'>中国太平洋保险股份有限公司</a-select-option>
            <a-select-option value='1'>中国人保财险股份有限公司</a-select-option>
          </a-select>
        </div>
        <span :style="{ display: 'inline-block', marginLeft: '16px' }">
            <a-button type='primary' size='small' ghost icon='file-text'>详情</a-button>
          </span>
      </a-form-item>

      <a-form-item label='总保额' :labelCol='labelCol' :wrapperCol='wrapperCol'>
        <a-input-number :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/￥\s?|(,*)/g, '')"
                        :style="{ width: '298px' }"
                        placeholder='请输入总保额'
                        v-decorator="[ 'sumInsured',{rules: [{ required: true, message: '请输入总保额' }]}]" />
      </a-form-item>

      <a-form-item label="保险费率" :labelCol='labelCol' :wrapperCol='wrapperCol' :required='true'>
        <a-input-number :min='0' :max='100' />
        <span> %</span>
      </a-form-item>

      <a-form-item label="临时分出比例" :labelCol='labelCol' :wrapperCol='wrapperCol' :required='true'>
        <a-input-number :min='0' :max='100' />
        <span> %</span>
      </a-form-item>

      <a-form-item label='最大危险单位' :labelCol='labelCol' :wrapperCol='wrapperCol' :style='{ marginBottom: 0 }'>
        <a-form-item v-if="form.getFieldValue('pml') === true" :style="{ display: 'inline-block', width: '298px', marginRight: '16px' }">
          <a-input-number :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/￥\s?|(,*)/g, '')"
                          :style="{ width: '100%' }"
                          placeholder='请输入最大危险单位保额'
                          v-decorator="[ 'maxPml',{rules: [{ required: true, message: '请输入最大危险单位保额' }]}]" />
        </a-form-item>
        <a-form-item :style="{ display: 'inline-block', width: '52px' }">
          <a-switch checked-children='有' un-checked-children='无' v-decorator="['pml', { valuePropName: 'checked', initialValue: false }]" />
        </a-form-item>
      </a-form-item>

      <a-form-item label='费率修正系数' :labelCol='labelCol' :wrapperCol='wrapperCol' :style='{ marginBottom: 0 }'>
        <a-form-item v-if="form.getFieldValue('ifModifyRate') === true" :style="{ display: 'inline-block', marginRight: '16px' }">
          <a-input-number :min='0' :max='100' />
          <span> %</span>
        </a-form-item>
        <a-form-item :style="{ display: 'inline-block', width: '52px' }">
          <a-switch checked-children='有' un-checked-children='无' v-decorator="['ifModifyRate', { valuePropName: 'checked', initialValue: false }]" />
        </a-form-item>
      </a-form-item>

      <a-form-item :wrapperCol="{span: 14, offset: 10}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>关于最大危险单位</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      <h4>关于费率修正系数</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'Step1',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    moment,
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
