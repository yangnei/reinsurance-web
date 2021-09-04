<template>
  <page-header-wrapper
    :title='isUpdate ? "更新公司信息" : "新增公司信息"'
    :content='isUpdate ? `更新「${form.fullNameCn}」（编号：${form.id}）的信息` : ""'
    :breadcrumb='false'
  >
    <a-card :body-style="{padding: '24px 32px'}" :bordered='false'>
      <a-form-model
        ref='companyForm'
        :model='form'
        :rules='rules'
        :label-col='labelCol'
        :wrapper-col='wrapperCol'
      >
        <a-form-model-item ref='type' label='机构类型' prop='type'>
          <a-radio-group v-model='form.type' button-style='solid'>
            <a-radio-button :value='1'>保险公司</a-radio-button>
            <a-radio-button :value='2'>保险经纪公司</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref='overseas' label='境内/境外' prop='overseas'>
          <a-radio-group v-model='form.overseas'>
            <a-radio :value='1'>境内</a-radio>
            <a-radio :value='2'>境外</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label='监管登记号' prop='regNo'>
          <a-input v-model='form.regNo' placeholder='请输入保险机构的监管登记号' />
        </a-form-model-item>
        <a-form-model-item label='机构名称（中文）' prop='fullNameCn'>
          <a-input v-model='form.fullNameCn' placeholder='请输入保险机构的中文全称' />
        </a-form-model-item>
        <a-form-model-item label='机构简称（中文）' prop='shortNameCn'>
          <a-input v-model='form.shortNameCn' placeholder='请输入保险机构的中文简称' />
        </a-form-model-item>
        <a-form-model-item label='机构名称（英文）'>
          <a-input v-model='form.fullNameEn' placeholder='请输入保险机构的英文全称' />
        </a-form-model-item>
        <a-form-model-item label='机构简称（英文）'>
          <a-input v-model='form.shortNameEn' placeholder='请输入保险机构的英文简称' />
        </a-form-model-item>
        <a-divider />
        <a-form-model-item label='机构地址（经营场所）'>
          <a-input v-model='form.address' placeholder='请输入保险机构的地址' />
        </a-form-model-item>
        <a-form-model-item label='联系人'>
          <a-input v-model='form.contact' placeholder='请输入保险机构的联系人' />
        </a-form-model-item>
        <a-form-model-item label='联系地址'>
          <a-input v-model='form.contAddress' placeholder='请输入保险机构的联系地址' />
        </a-form-model-item>
        <a-form-model-item label='联系电话'>
          <a-input v-model='form.contPhone' placeholder='请输入保险机构的联系电话' />
        </a-form-model-item>
        <a-form-model-item ref='capital' label='资本金' prop='capital'>
          <a-input-number
            v-model='form.capital'
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/￥\s?|(,*)/g, '')"
            :style="{ width: '100%' }"
            placeholder='请输入该保险机构最新披露的资本金'
          />
        </a-form-model-item>
        <a-form-model-item ref='reserves' label='公积金' prop='reserves'>
          <a-input-number
            v-model='form.reserves'
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/￥\s?|(,*)/g, '')"
            :style="{ width: '100%' }"
            placeholder='请输入该保险机构最新披露的公积金'
          />
        </a-form-model-item>
        <a-form-model-item label='合约首席资格'>
          <a-switch v-model='form.leader' checked-children='是' un-checked-children='否' />
        </a-form-model-item>
        <a-form-model-item label='合约资格'>
          <a-switch v-model='form.contract' checked-children='是' un-checked-children='否' />
        </a-form-model-item>
        <a-divider>评级</a-divider>
        <a-form-model-item label='普尔评级' :labelCol='labelCol' :wrapperCol='wrapperColLarge'>
          <a-rate v-model='form.poorsRating' :tooltips='spRatingName' :count='21'></a-rate>
        </a-form-model-item>
        <a-form-model-item label='穆迪评级' :labelCol='labelCol' :wrapperCol='wrapperColLarge'>
          <a-rate v-model='form.moodysRating' :tooltips='mdRatingName' :count='21'></a-rate>
        </a-form-model-item>
        <a-form-model-item label='贝氏评级' :labelCol='labelCol' :wrapperCol='wrapperColLarge'>
          <a-rate v-model='form.bayesianRating' :tooltips='spRatingName' :count='21'></a-rate>
        </a-form-model-item>
        <a-form-model-item label='惠誉评级' :labelCol='labelCol' :wrapperCol='wrapperColLarge'>
          <a-rate v-model='form.fitchRating' :tooltips='spRatingName' :count='21'></a-rate>
        </a-form-model-item>
        <!--
        <a-form-model-item>
          <a-button style='width: 100%; margin-top: 16px; margin-bottom: 8px' type='dashed' icon='plus'>新增评级</a-button>
        </a-form-model-item>
        -->
        <a-form-item :wrapperCol='{ span: 24 }' style='text-align: center'>
          <a-button type='primary' @click='handleSubmit'>提交</a-button>
          <a-button style='margin-left: 8px' @click='handleCancel'>取消</a-button>
        </a-form-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { saving_company, fetching_company } from '@/api/company'
import notification from 'ant-design-vue/lib/notification'

export default {
  name: 'CompanyEdit',
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      wrapperColLarge: { lg: { span: 17 }, sm: { span: 17 } },
      spRatingName: ['C', 'CC', 'CCC-', 'CCC', 'CCC+', 'B-', 'B', 'B+', 'BB-', 'BB', 'BB+', 'BBB-', 'BBB', 'BBB+', 'A-', 'A', 'A+', 'AA-', 'AA', 'AA+', 'AAA'],
      mdRatingName: ['C', 'Ca', 'Caa3', 'Caa2', 'Caa1', 'B3', 'B2', 'B1', 'Ba3', 'Ba2', 'Ba1', 'Baa3', 'Baa2', 'Baa1', 'A3', 'A2', 'A1', 'Aa3', 'Aa2', 'Aa1', 'Aaa'],
      isUpdate: false,
      form: {
        type: 1,
        overseas: 1,
        regNo: '',
        fullNameCn: '',
        shortNameCn: '',
        fullNameEn: '',
        shortNameEn: '',
        address: '',
        contact: '',
        contAddress: '',
        contPhone: '',
        capital: null,
        reserves: null,
        leader: false,
        contract: false,
        poorsRating: 0,
        moodysRating: 0,
        bayesianRating: 0,
        fitchRating: 0
      },
      rules: {
        regNo: [
          { required: true, message: '请输入保险机构的监管登记号', trigger: 'blur' }
        ],
        fullNameCn: [
          { required: true, message: '请输入保险机构的中文全称', trigger: 'blur' }
        ],
        shortNameCn: [
          { required: true, message: '请输入保险机构的简称', trigger: 'blur' }
        ],
        capital: [
          { required: true, message: '请填写保险机构的资本金', trigger: 'blur' }
        ],
        reserves: [
          { required: true, message: '请填写保险机构的公积金', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id === '0') {
      // create
    } else {
      fetching_company(id).then(res => {
        console.debug('company', res)
        if (res.code === 0 && res.result) {
          this.form = res.result
          this.isUpdate = true
        } else {
          notification.error({
            message: '获取公司信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$refs.companyForm.validate(valid => {
        if (valid) {
          return saving_company(this.form).then(res => {
            console.debug('saved company', res)
            if (res.code === 0 && res.result) {
              this.$router.push({ name: 'CompanySuccess', params: { isUpdate: this.isUpdate, company: res.result } })
            } else {
              notification.error({
                message: this.isUpdate ? '更新公司信息失败' : '保存公司信息失败',
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
      this.$refs.companyForm.resetFields()
      this.$router.push({ name: 'CompanyList' })
    }
  }
}
</script>
