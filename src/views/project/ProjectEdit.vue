<template>
  <page-header-wrapper
    :title='isUpdate ? "修改项目信息" : "录入要约"'
    :breadcrumb='false'
  >
    <a-card :body-style="{padding: '24px 32px'}" :bordered='false'>
      <a-form-model
        ref='projectForm'
        :model='form'
        :rules='rules'
        :label-col='labelCol'
        :wrapper-col='wrapperCol'
      >
        <a-form-model-item ref='name' label='项目名称' prop='name'>
          <a-input v-model='form.name' placeholder='给项目起个名字' />
        </a-form-model-item>

        <a-form-model-item ref='item' label='分项' prop='item'>
          <a-input v-model='form.item' placeholder='' />
        </a-form-model-item>

        <a-form-model-item label='保单号' prop='policyNo'>
          <a-input v-model='form.policyNo' placeholder='' />
        </a-form-model-item>

        <a-form-model-item label='分保单号' prop='reinsuranceNo'>
          <a-input v-model='form.reinsuranceNo' placeholder='' />
        </a-form-model-item>

        <a-form-model-item ref='offerDate' label='要约日期' prop='offerDate'>
          <a-date-picker
            v-model='form.offerDate'
            format='YYYY-MM-DD'
            placeholder='请输入要约日期'
          />
        </a-form-model-item>

        <a-form-model-item ref='startDate' label='起始日期' prop='startDate'>
          <a-date-picker
            v-model='form.startDate'
            format='YYYY-MM-DD'
            placeholder='请输入保险开始日期'
          />
        </a-form-model-item>

        <a-form-model-item ref='endDate' label='终止日期' prop='endDate'>
          <a-date-picker
            v-model='form.endDate'
            format='YYYY-MM-DD'
            placeholder='请输入保险结束日期'
          />
        </a-form-model-item>

        <a-form-model-item ref='categoryId' label='险别' prop='categoryId'>
          <a-select placeholder='请选择' v-model='form.categoryId' :style="{ display: 'inline-block', width: '350px' }">
            <a-select-option v-for='(category, index) in categories' :value='category.id' :key='category.id'>{{ category.name }}</a-select-option>
          </a-select>
          <span :style="{ display: 'inline-block', marginLeft: '16px' }">
            <a-button type='primary' size='small' ghost icon='plus' @click='handleCategoryMdlAdd'>新增</a-button>
          </span>
        </a-form-model-item>

        <a-form-model-item ref='contractType' label='合同类型' prop='contractType'>
          <a-radio-group v-model='form.contractType'>
            <a-radio :value='1'>Obligated合约</a-radio>
            <a-radio :value='2'>Non-obliged协议</a-radio>
            <a-radio :value='3'>普通临分</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item ref='fareType' label='是否特约临分' prop='fareType'>
          <a-checkbox v-model='form.fareType' />
        </a-form-model-item>

        <a-form-model-item ref='insured' label='原被保险人' prop='insured'>
          <a-input v-model='form.insured' placeholder='请输入原被保险人名称' />
        </a-form-model-item>

        <a-form-model-item ref='brokerId' label='保险经纪公司' prop='brokerId'>
          <a-select placeholder='请选择' v-model='form.brokerId'>
            <a-select-option :value='0'>无</a-select-option>
            <a-select-option v-for='(broker, index) in brokers' :value='broker.id' :key='broker.id'>{{ broker.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref='cedantId' label='分出公司' prop='cedantId'>
          <a-select placeholder='请选择' v-model='form.cedantId'>
            <a-select-option v-for='(insurance, index) in insurances' :value='insurance.id' :key='insurance.id'>{{ insurance.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref='local' label='是否境外公司' prop='local'>
          <a-checkbox v-model='form.local' />
        </a-form-model-item>

        <a-form-model-item ref='sumInsured' label='总保额' prop='sumInsured'>
          <a-input-number
            v-model='form.sumInsured'
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/￥\s?|(,*)/g, '')"
            :style="{ width: '100%' }"
            placeholder='请输入总保额'
          />
        </a-form-model-item>

        <a-form-model-item ref='maxUnitPml' label='最大危险单位' prop='maxUnitPml'>
          <a-input-number
            v-model='form.maxUnitPml'
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/￥\s?|(,*)/g, '')"
            :style="{ width: '100%' }"
            placeholder='请输入最大危险单位保额'
          />
        </a-form-model-item>

        <!--
        <a-form-model-item ref='splitRatio' label='临分比例' prop='splitRatio'>
          <a-input-number :min='0' :max='100' v-model='form.splitRatio' />
          <span> %</span>
        </a-form-model-item>
        -->

        <a-form-model-item ref='premiumRatio' label='保险费率' prop='premiumRatio'>
          <a-input-number :min='0' :max='100' v-model='form.premiumRatio' />
          <span> %</span>
          <span style='margin-left: 24px;'>含税：</span>
          <a-checkbox v-model='form.premiumWzTax' />
          <span style='display: inline-block; float: right;'>
            <span>费率修正系数：</span>
            <a-input-number :min='0' :max='100' v-model='form.riskDiscRatio' />
            <span> %</span>
          </span>
        </a-form-model-item>

        <a-form-model-item ref='commissionRatio' label='手续费率' prop='commissionRatio'>
          <a-input-number :min='0' :max='100' v-model='form.commissionRatio' />
          <span> %</span>
        </a-form-model-item>

        <a-form-model-item ref='brokerageRatio' label='经纪费率' prop='brokerageRatio'>
          <a-input-number :min='0' :max='100' v-model='form.brokerageRatio' />
          <span> %</span>
          <span style='margin-left: 24px;'>含税：</span>
          <a-checkbox v-model='form.brokerageWzTax' />
        </a-form-model-item>

        <a-form-model-item label='接入份额' prop='acceptedRatio'>
          <a-input-number :min='0' :max='100' v-model='form.acceptedRatio' />
          <span> %</span>
        </a-form-model-item>

        <a-form-model-item label='结付方式' prop='paymentMethod'>
          <a-input v-model='form.paymentMethod' placeholder='' />
        </a-form-model-item>

        <a-form-model-item ref='terms' label='条款和条件' prop='terms'>
          <a-textarea rows='2' v-model='form.terms' />
        </a-form-model-item>

        <a-form-model-item ref='special' label='特别规定' prop='special'>
          <a-textarea rows='2' v-model='form.special' />
        </a-form-model-item>

        <a-form-model-item ref='law' label='法律和管辖权' prop='law'>
          <a-textarea rows='2' v-model='form.law' />
        </a-form-model-item>

        <a-form-model-item ref='payment' label='付款条件' prop='payment'>
          <a-textarea rows='2' v-model='form.payment' />
        </a-form-model-item>

        <a-form-model-item ref='additional' label='附加信息' prop='additional'>
          <a-textarea rows='2' v-model='form.additional' />
        </a-form-model-item>

        <a-form-item :wrapperCol='{ span: 24 }' style='text-align: center'>
          <a-button type='primary' @click='handleSubmit'>提交</a-button>
          <a-button style='margin-left: 8px' @click='handleCancel'>取消</a-button>
        </a-form-item>

      </a-form-model>
      <category-form
        ref='categoryModal'
        :visible='categoryMdlVisible'
        :loading='categoryMdlConfirmLoading'
        @cancel='handleCategoryMdlCancel'
        @ok='handleCategoryMdlOk'
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { fetching_categories, saving_category } from '@/api/category'
import { fetching_brokers, fetching_insurances } from '@/api/company'
import { fetching_project, saving_project } from '@/api/project'
import notification from 'ant-design-vue/lib/notification'
import CategoryForm from './modules/CategoryForm'

export default {
  name: 'ProjectEdit',
  components: {
    CategoryForm
  },
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      // model
      categoryMdlVisible: false,
      categoryMdlConfirmLoading: false,
      isUpdate: false,
      form: {
        name: '',
        item: '',
        policyNo: '',
        reinsuranceNo: '',
        status: 1,
        categoryId: null,
        insured: '',
        cedantId: null,
        brokerId: null,
        local: false,
        reinsuranceId: null,
        offerDate: moment(),
        startDate: moment(),
        endDate: moment().add(1, 'year').subtract(1, 'day'),
        contractType: null,
        fareType: null,
        sumInsured: null,
        splitRatio: 0,
        premiumRatio: null,
        premiumWzTax: true,
        commissionRatio: null,
        commissionWzTax: false,
        brokerageRatio: null,
        brokerageWzTax: false,
        maxUnitPml: null,
        riskDiscRatio: 100,
        acceptedRatio: null,
        paymentMethod: '',
        terms: '',
        special: '',
        law: '',
        payment: '',
        additional: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        offerDate: [
          { required: true, message: '请选择要约日期', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择保险开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择保险结束日期', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择保险种类', trigger: 'change' }
        ],
        insured: [
          { required: true, message: '请填写原被保险人名称', trigger: 'blur' }
        ],
        cedantId: [
          { required: true, message: '请选择分出公司', trigger: 'change' }
        ],
        reinsuranceId: [
          { required: true, message: '请选择分入公司', trigger: 'change' }
        ],
        sumInsured: [
          { required: true, message: '请填写总保额', trigger: 'blur' }
        ],
        premiumRatio: [
          { required: true, message: '请填写保险费率', trigger: 'blur' }
        ],
        commissionRatio: [
          { required: true, message: '请填写手续费率', trigger: 'blur' }
        ]
      },
      categories: [],
      brokers: [],
      insurances: []
    }
  },
  created() {
    this.loadCategories()
    this.loadBrokers()
    this.loadInsurances()
    const { id } = this.$route.query
    if (id === '0') {
      // create project
    } else {
      fetching_project(id).then(res => {
        console.debug('project', res)
        if (res.code === 0 && res.result) {
          this.form = {
            ...this.form,
            ...res.result,
            offerDate: res.result.offerDate ? moment(res.result.offerDate, 'YYYY-MM-DD') : null,
            startDate: res.result.startDate ? moment(res.result.startDate, 'YYYY-MM-DD') : null,
            endDate: res.result.endDate ? moment(res.result.endDate, 'YYYY-MM-DD') : null
          }
          this.isUpdate = true
        } else {
          notification.error({
            message: '获取项目信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  },
  methods: {
    moment,
    // handler
    handleSubmit(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          const project = {
            ...this.form,
            offerDate: this.form.offerDate ? this.form.offerDate.format('YYYY-MM-DD') : null,
            startDate: this.form.startDate ? this.form.startDate.format('YYYY-MM-DD') : null,
            endDate: this.form.endDate ? this.form.endDate.format('YYYY-MM-DD') : null,
            riskDiscRatio: this.form.riskDiscRatio || 100.0,
            brokerageRatio: this.form.brokerageRatio || .0
          }
          return saving_project(project).then(res => {
            console.debug('saved project', res)
            if (res.code === 0 && res.result) {
              this.$router.push({ name: 'ProjectSuccess', params: { isUpdate: this.isUpdate ? 'UPDATE' : '_', project: res.result } })
            } else {
              notification.error({
                message: this.isUpdate ? '更新项目信息失败' : '保存项目信息失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleCancel(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$refs.projectForm.resetFields()
      this.$router.push({ name: 'ProjectList' })
    },
    handleCategoryMdlAdd() {
      this.categoryMdlVisible = true
    },
    handleCategoryMdlOk() {
      const form = this.$refs.categoryModal.form
      const formRef = this.$refs.categoryModal.$refs.form
      this.categoryMdlConfirmLoading = true
      formRef.validate(valid => {
        if (valid) {
          console.debug('new category', form)
          return saving_category(form).then(res => {
            console.debug('saved category', res)
            if (res.code === 0 && res.result) {
              this.categoryMdlVisible = false
              this.categoryMdlConfirmLoading = false
              formRef.resetFields()
              this.loadCategories().then(() => {
                this.form.categoryId = res.result.id
              })
              this.$message.info('新增种类成功')
            } else {
              notification.error({
                message: '新增保险种类失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
        } else {
          this.categoryMdlConfirmLoading = false
          return false
        }
      })
    },
    handleCategoryMdlCancel() {
      this.categoryMdlVisible = false
      const formRef = this.$refs.categoryModal.$refs.form
      formRef.resetFields() // 清理表单数据
    },
    loadCategories() {
      return fetching_categories().then(res => {
        console.debug('category list', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.categories = res.result.map(category => {
            return {
              id: category.id,
              name: category.name
            }
          })
        } else {
          notification.error({
            message: '获取险种列表失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    loadBrokers() {
      return fetching_brokers().then(res => {
        console.debug('broker list', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.brokers = res.result.map(company => {
            return {
              id: company.id,
              name: company.fullNameCn
            }
          })
        } else {
          notification.error({
            message: '获取保险经纪公司列表失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    loadInsurances() {
      return fetching_insurances().then(res => {
        console.debug('insurance list', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.insurances = res.result.map(company => {
            return {
              id: company.id,
              name: company.fullNameCn
            }
          })
        } else {
          notification.error({
            message: '获取保险公司列表失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    formatPrice(value) {
      let val = Math.round((value / 1) * 100) / 100
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style lang='less' scoped>

</style>
