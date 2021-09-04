<template>
  <page-header-wrapper
    :breadcrumb='false'
    :content="isUpdate ? `更新「${form.name}」（编号：${form.id}）的合约信息` : ''"
    :title="isUpdate ? '更新合约信息' : '新增合约信息'"
  >
    <a-card :body-style="{ padding: '24px 32px' }" :bordered='false'>
      <a-form-model ref='contractForm' :label-col='labelCol' :model='form' :rules='rules' :wrapper-col='wrapperCol'>
        <a-form-model-item label='合约名称' prop='name'>
          <a-input v-model='form.name' placeholder='请输入' />
        </a-form-model-item>

        <a-form-model-item ref='companyId' label='合约签署机构' prop='companyId'>
          <a-select v-model='form.companyId' placeholder='请选择'>
            <a-select-option :value='0'>无</a-select-option>
            <a-select-option v-for='(company, index) in companies' :key='company.id' :value='company.id'
            >{{ company.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref='startDate' label='生效日期' prop='startDate'>
          <a-date-picker v-model='form.startDate' format='YYYY-MM-DD' placeholder='请选择' />
        </a-form-model-item>

        <a-form-model-item ref='endDate' label='结束日期' prop='endDate'>
          <a-date-picker v-model='form.endDate' format='YYYY-MM-DD' placeholder='请选择' />
        </a-form-model-item>

        <a-form-model-item label='合约类型' prop='type'>
          <a-radio-group v-model='form.type' button-style='solid'>
            <a-radio-button :value='1'>成数合约</a-radio-button>
            <a-radio-button :value='2'>溢额合约</a-radio-button>
            <a-radio-button :value='3'>混合合约</a-radio-button>
            <a-radio-button :value='4'>险位超赔</a-radio-button>
            <a-radio-button :value='5'>赔付率超赔</a-radio-button>
          </a-radio-group>
        </a-form-model-item>

        <!-- 成数合约 -->
        <template v-if='form.type === 1'>
          <a-form-model-item label='最高责任限额' prop='cededMaxAmount'>
            <a-input-number
              v-model='form.cededMaxAmount'
              :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
              :style="{ width: '100%' }"
              placeholder='请输入'
            />
          </a-form-model-item>

          <a-form-model-item label='自留比例' prop='retentionRatio'>
            <a-slider v-model='form.retentionRatio' :tip-formatter='tipFormatter' />
          </a-form-model-item>
        </template>

        <!-- 溢额合约 -->
        <template v-if='form.type === 2'>
          <a-form-model-item label='最高自留额' prop='retention'>
            <a-input-number
              v-model='form.retention'
              :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
              :style="{ width: '100%' }"
              placeholder='请输入'
            />
          </a-form-model-item>

          <a-form-model-item label='溢额线数' prop='lines'>
            <a-input-number v-model='form.lines' :min='0' />
          </a-form-model-item>
        </template>

        <!-- 混合合约 -->
        <template v-if='form.type === 3'>
          <a-form-model-item label='成数合同限额' prop='retention'>
            <a-input-number
              v-model='form.retention'
              :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
              :style="{ width: '100%' }"
              placeholder='请输入'
            />
          </a-form-model-item>

          <a-form-model-item label='成数自留比例' prop='retentionRatio'>
            <a-slider v-model='form.retentionRatio' :tip-formatter='tipFormatter' />
          </a-form-model-item>

          <a-form-model-item label='溢额线数' prop='lines'>
            <a-input-number v-model='form.lines' :min='0' />
          </a-form-model-item>
        </template>

        <!-- 险位超赔 -->
        <template v-if='form.type === 4'>
          <a-form-model-item label='免赔额' prop='retention'>
            <a-input-number
              v-model='form.retention'
              :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
              :style="{ width: '100%' }"
              placeholder='请输入'
            />
          </a-form-model-item>

          <a-form-model-item label='最高责任限额' prop='cededMaxAmount'>
            <a-input-number
              v-model='form.cededMaxAmount'
              :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
              :style="{ width: '100%' }"
              placeholder='请输入'
            />
          </a-form-model-item>
        </template>

        <!-- 赔付率超赔 -->
        <template v-if='form.type === 5'>
          <a-form-model-item label='免赔率' prop='retentionRatio'>
            <a-input-number v-model='form.retentionRatio' :min='0' />
            <span> %</span>
          </a-form-model-item>
          <a-form-model-item label='最高赔付率' prop='cededMaxRatio'>
            <a-input-number v-model='form.cededMaxRatio' :min='0' />
            <span> %</span>
          </a-form-model-item>
        </template>

        <a-form-item :wrapperCol='{ span: 24 }' style='text-align: center'>
          <a-button type='primary' @click='handleSubmit'>提交</a-button>
          <a-button style='margin-left: 8px' @click='handleCancel'>取消</a-button>
        </a-form-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { fetching_companies } from '@/api/company'
import { fetching_contract, saving_contract } from '@/api/contract'
import notification from 'ant-design-vue/lib/notification'
import moment from 'moment'

/**
 * 创建合约、合约编辑页面
 */
export default {
  name: 'ContractEdit',
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      isUpdate: false,
      form: {
        name: '',
        companyId: null,
        startDate: null,
        endDate: null,
        type: null,
        retention: null,
        cededMaxAmount: null,
        lines: null,
        retentionRatio: null,
        cededMaxRatio: null
      },
      rules: {
        name: [{ required: true, message: '请输入合约名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择合约类型', trigger: 'blur' }],
        startDate: [
          { required: true, message: '请选择合约生效日期', trigger: 'change' },
          {
            validator: (rule, value, next) => {
              if (this.form.endDate) {
                if (value.isSameOrAfter(this.form.endDate)) {
                  next(new Error('生效日期应小于结束日期'))
                } else {
                  this.$refs.contractForm.validateField('endDate')
                  next()
                }
              } else {
                next()
              }
            }, trigger: 'change'
          }
        ],
        endDate: [{ required: true, message: '请选择合约结束日期', trigger: 'change' },
          {
            validator: (rule, value, next) => {
              if (this.form.startDate) {
                if (value.isSameOrBefore(this.form.startDate)) {
                  next(new Error('结束日期应大于生效日期'))
                } else {
                  this.$refs.contractForm.validateField('startDate')
                  next()
                }
              } else {
                next()
              }
            }, trigger: 'change'
          }]
      },
      companies: []
    }
  },
  created() {
    this.loadCompanies()
    const { id } = this.$route.query
    if (id === '0') {
      // create
    } else {
      fetching_contract(id).then((res) => {
        console.debug('contract', res)
        if (res.code === 0 && res.result) {
          this.form = {
            ...this.form,
            ...res.result,
            startDate: res.result.startDate ? moment(res.result.startDate, 'YYYY-MM-DD') : null,
            endDate: res.result.endDate ? moment(res.result.endDate, 'YYYY-MM-DD') : null
          }
          this.isUpdate = true
        } else {
          notification.error({
            message: '获取合约信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$refs.contractForm.validate((valid) => {
        if (valid) {
          this.form = {
            ...this.form,
            startDate: this.form.startDate ? this.form.startDate instanceof moment ? this.form.startDate.format('YYYY-MM-DD') : this.form.startDate : null,
            endDate: this.form.endDate ? this.form.endDate instanceof moment ? this.form.endDate.format('YYYY-MM-DD') : this.form.endDate : null
          }
          return saving_contract(this.form).then((res) => {
            console.debug('saved contract', res)
            if (res.code === 0 && res.result) {
              this.$router.push({ name: 'ContractList' })
              this.$message.success(this.isUpdate ? '合约更新成功' : '合约保存成功')
            } else {
              notification.error({
                message: this.isUpdate ? '合约更新信息失败' : '保存合约失败',
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
      this.$refs.contractForm.resetFields()
      this.$router.push({ name: 'ContractList' })
    },
    tipFormatter(value) {
      return `${value}%`
    },
    loadCompanies() {
      return fetching_companies().then((res) => {
        console.debug('company list', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.companies = res.result.map((company) => {
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
    }
  }
}
</script>
