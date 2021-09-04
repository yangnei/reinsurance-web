<template>
  <page-header-wrapper
    :title='`单号：${project.id}`'>
    <template v-slot:content>
      <a-descriptions size='small' :column='isMobile ? 1 : 2'>
        <a-descriptions-item label='项目名称'>{{ project.name }}</a-descriptions-item>
        <a-descriptions-item label='合同类型'>{{ project.contractType | contractTypeFilter }}
          <a-tag color='cyan' style='margin-left: 16px;' v-if='project.fareType'>特约临分</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label='分项'>{{ project.item || '-' }}</a-descriptions-item>
        <a-descriptions-item label='原被保险人'>{{ project.insured || '-' }}</a-descriptions-item>
        <a-descriptions-item label='险别'>{{ project.categoryName || '-' }}</a-descriptions-item>
        <a-descriptions-item label='经纪公司'>{{ project.brokerName || '-' }}
          <a-tag color='pink' style='margin-left: 16px;' v-if='project.brokerName && project.local'>境外</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label='要约日期'>{{ project.offerDate || '-' }}</a-descriptions-item>
        <a-descriptions-item label='分出公司'>{{ project.cedantName }}
          <a-tag color='pink' style='margin-left: 16px;' v-if='!project.brokerName && project.local'>境外</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label='保险期限'>{{ project.startDate }} <span v-if='project.endDate'>~</span> {{ project.endDate }}</a-descriptions-item>
        <a-descriptions-item label='保单号'>{{ project.policyNo || '-' }}</a-descriptions-item>
        <a-descriptions-item label='结付方式'>{{ project.paymentMethod || '-' }}</a-descriptions-item>
        <a-descriptions-item label='分保单号'>{{ project.reinsuranceNo || '-' }}</a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <!--
      <a-button-group style='margin-right: 8px;'>
        <a-button>分保条</a-button>
        <a-button>账单</a-button>
        <a-button>赔案单证</a-button>
      </a-button-group>
      -->
      <a-button @click='handleToEdit'>编辑</a-button>
      <a-button @click='handleToDecisionMaking'>辅助决策</a-button>
      <a-button type='primary' @click='handleToProjects'>返回</a-button>
    </template>

    <template v-slot:extraContent>
      <a-row class='status-list'>
        <a-col :xs='8' :sm='8'>
          <div class='text'>状态</div>
          <div class='heading'>{{ project.status | statusFilter }}</div>
        </a-col>
        <a-col :xs='16' :sm='16'>
          <div class='text'>总保额</div>
          <div class='heading'>{{ formatPrice(project.sumInsured) }}</div>
        </a-col>
      </a-row>
    </template>

    <a-card :bordered='false' title='流程进度'>
      <a-steps :direction="isMobile && 'vertical' || 'horizontal'" :current='project.status - 1' progressDot>
        <a-step title='待处理'>
          <template v-slot:description>
            <template v-for='(status, index) in statuses'>
              <div class='antd-pro-pages-profile-advanced-style-stepDescription' v-if='status.status === 1'>
                {{ status.updatedBy }}
                <div>{{ status.statusDate }}</div>
                <div v-if='status.comment'>{{ status.comment }}</div>
              </div>
            </template>
          </template>
        </a-step>
        <a-step title='核保中'>
          <template v-slot:description>
            <template v-for='(status, index) in statuses'>
              <div class='antd-pro-pages-profile-advanced-style-stepDescription' v-if='status.status === 2'>
                {{ status.updatedBy }}
                <div>{{ status.statusDate }}</div>
                <div v-if='status.comment'>{{ status.comment }}</div>
              </div>
            </template>
          </template>
          <!--
          <template v-slot:description>
            <div class='antd-pro-pages-profile-advanced-style-stepDescription'>
              小李
              <a-tooltip placement='right' title='13900000000'>
                <a-icon type='phone' style='margin-left: 4px; color: rgb(0, 160, 233);' />
              </a-tooltip>
              <div>2021-02-12 12:32</div>
            </div>
          </template>
          -->
        </a-step>
        <a-step title='待确认回'>
          <template v-slot:description>
            <template v-for='(status, index) in statuses'>
              <div class='antd-pro-pages-profile-advanced-style-stepDescription' v-if='status.status === 3'>
                {{ status.updatedBy }}
                <div>{{ status.statusDate }}</div>
                <div v-if='status.comment'>{{ status.comment }}</div>
              </div>
            </template>
          </template>
        </a-step>
        <a-step title='待录系统'>
          <template v-slot:description>
            <template v-for='(status, index) in statuses'>
              <div class='antd-pro-pages-profile-advanced-style-stepDescription' v-if='status.status === 4'>
                {{ status.updatedBy }}
                <div>{{ status.statusDate }}</div>
                <div v-if='status.comment'>{{ status.comment }}</div>
              </div>
            </template>
          </template>
        </a-step>
        <a-step title='已双确认'>
          <template v-slot:description>
            <template v-for='(status, index) in statuses'>
              <div class='antd-pro-pages-profile-advanced-style-stepDescription' v-if='status.status === 5'>
                {{ status.updatedBy }}
                <div>{{ status.statusDate }}</div>
                <div v-if='status.comment'>{{ status.comment }}</div>
              </div>
            </template>
          </template>
        </a-step>
      </a-steps>
    </a-card>

    <a-card style='margin-top: 24px' :bordered='false' title='费用信息'>
      <div style='max-width: 900px; margin: auto;'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='5' class='bill__cell--label'>总保额：</a-col>
          <a-col :span='6' class='bill__cell--money'>￥ {{ formatPrice(project.sumInsured) }}</a-col>
          <a-col :span='5' :offset='2' class='bill__cell--label'>保险费率：</a-col>
          <a-col :span='6' class='bill__cell--money'>{{ project.premiumRatio }} %</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='5' class='bill__cell--label'>总保费：</a-col>
          <a-col :span='6' class='bill__cell--money'>￥ {{ formatPrice(gross_premium) }}</a-col>
          <a-col :span='5' :offset='2' class='bill__cell--label'>不含税总保费：</a-col>
          <a-col :span='6' class='bill__cell--money'>￥ {{ formatPrice(premium_without_tax) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='project.acceptedRatio'>
          <a-col :span='5' class='bill__cell--label'>接入份额：</a-col>
          <a-col :span='6' class='bill__cell--money'>{{ project.acceptedRatio }} %</a-col>
          <a-col :span='5' :offset='2' class='bill__cell--label'>接受人保额：</a-col>
          <a-col :span='6' class='bill__cell--money'>￥ {{ formatPrice(accepted_insured_amount) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='project.acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>接受人毛保费：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_gross_premium) }}</a-col>
          <a-col :span='4' class='bill__cell--label'>接受人不含税保费：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_premium_without_tax) }}</a-col>
          <a-col :span='4' class='bill__cell--label'>保费增值税：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_premium_tax) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='project.acceptedRatio'>
          <a-col :span='5' class='bill__cell--label'>手续费率：</a-col>
          <a-col :span='6' class='bill__cell--money'>{{ project.commissionRatio }} %</a-col>
          <a-col :span='5' :offset='2' class='bill__cell--label'>分保手续费：</a-col>
          <a-col :span='6' class='bill__cell--money'>￥ {{ formatPrice(accepted_commission) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='project.acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>经纪费率：</a-col>
          <a-col :span='4' class='bill__cell--money'>{{ project.brokerageRatio }} %</a-col>
          <a-col :span='4' class='bill__cell--label'>经纪费：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_brokerage) }}</a-col>
          <a-col :span='4' class='bill__cell--label'>经纪费增值税：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_brokerage_tax) }}</a-col>
        </a-row>
      </div>
      <a-divider v-if='project.acceptedRatio' />
      <div style='max-width: 900px; margin: auto;' v-if='project.acceptedRatio'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>接受人应收款计算</a-col>
          <a-col :span='16' class='bill__cell--label'>接受人不含税保费：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_premium_without_tax) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--center'>plus</a-col>
          <a-col :span='16' class='bill__cell--label'>保费增值税：</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_premium_tax) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--center'>less</a-col>
          <a-col :span='4' class='bill__cell--label'>分保手续费：</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='3' class='bill__cell--money'>￥ {{ formatPrice(accepted_gross_premium) }}</a-col>
          <a-col :span='2' class='bill__cell--sign'>x</a-col>
          <a-col :span='3' class='bill__cell--money'>{{ project.commissionRatio }} %</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_commission) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--center'>less</a-col>
          <a-col :span='4' class='bill__cell--label'>经纪费：</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='3' class='bill__cell--money'>￥ {{ formatPrice(accepted_gross_premium) }}</a-col>
          <a-col :span='2' class='bill__cell--sign'>x</a-col>
          <a-col :span='3' class='bill__cell--money'>{{ project.brokerageRatio }} %</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_brokerage) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='!project.brokerageWzTax'>
          <a-col :span='4' class='bill__cell--center'>less</a-col>
          <a-col :span='4' class='bill__cell--label'>经纪费增值税：</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='3' class='bill__cell--money'>￥ {{ formatPrice(accepted_brokerage) }}</a-col>
          <a-col :span='2' class='bill__cell--sign'>x</a-col>
          <a-col :span='3' class='bill__cell--money'>{{ project.brokerageWzTax ? '0' : project.local ? '7.2' : '6' }} %</a-col>
          <a-col :span='2' class='bill__cell--sign'>=</a-col>
          <a-col :span='4' class='bill__cell--money'>￥ {{ formatPrice(accepted_brokerage_tax) }}</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>接受人余额：</a-col>
          <a-col :span='20' class='bill__cell--money'>￥ {{ formatPrice(accepted_balance) }}</a-col>
        </a-row>
      </div>
    </a-card>

    <!-- 操作 -->
    <a-card
      style='margin-top: 24px'
      :bordered='false'
      :tabList='operationTabList'
      :activeTabKey='operationActiveTabKey'
      @tabChange='(key) => {this.operationActiveTabKey = key}'
    >
      <div v-if="operationActiveTabKey === '1'" style='max-width: 900px; margin: auto;'>
        <template v-if='project.terms'><p style='white-space: pre-wrap;'>{{ project.terms }}</p></template>
        <template v-else>
          <a-empty />
        </template>
      </div>
      <div v-if="operationActiveTabKey === '2'" style='max-width: 900px; margin: auto;'>
        <template v-if='project.special'><p style='white-space: pre-wrap;'>{{ project.special }}</p></template>
        <template v-else>
          <a-empty />
        </template>
      </div>
      <div v-if="operationActiveTabKey === '3'" style='max-width: 900px; margin: auto;'>
        <template v-if='project.law'><p style='white-space: pre-wrap;'>{{ project.law }}</p></template>
        <template v-else>
          <a-empty />
        </template>
      </div>
      <div v-if="operationActiveTabKey === '4'" style='max-width: 900px; margin: auto;'>
        <template v-if='project.payment'><p style='white-space: pre-wrap;'>{{ project.payment }}</p></template>
        <template v-else>
          <a-empty />
        </template>
      </div>
      <div v-if="operationActiveTabKey === '5'" style='max-width: 900px; margin: auto;'>
        <template v-if='project.additional'><p style='white-space: pre-wrap;'>{{ project.additional }}</p></template>
        <template v-else>
          <a-empty />
        </template>
      </div>

      <!-- 附件
      <div v-if="operationActiveTabKey === '6'" style='max-width: 900px; margin: auto;'>
        <a-list size='small'>
          <a-list-item>
            <a-list-item-meta>
              <span slot='title'><span style='margin-right: 16px'>1</span><a href='#'>xxxxxx分保条.docx</a></span>
            </a-list-item-meta>
            <div slot='actions'>
              <a @click='edit(item)'>删除</a>
            </div>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <span slot='title'><span style='margin-right: 16px'>2</span><a href='#'>xxxxxx分保条.docx</a></span>
            </a-list-item-meta>
            <div slot='actions'>
              <a @click='edit(item)'>删除</a>
            </div>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <span slot='title'><span style='margin-right: 16px'>3</span><a href='#'>xxxxxx分保条.docx</a></span>
            </a-list-item-meta>
            <div slot='actions'>
              <a @click='edit(item)'>删除</a>
            </div>
          </a-list-item>
        </a-list>
        <div class='operate'>
          <a-button type='dashed' style='width: 100%' icon='plus' @click='add'>添加</a-button>
        </div>
      </div>
      -->
    </a-card>

  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { fetching_project, fetching_project_status } from '@/api/project'
import notification from 'ant-design-vue/lib/notification'
import {
  accepted_balance,
  accepted_brokerage,
  accepted_brokerage_tax,
  accepted_commission,
  accepted_gross_premium,
  accepted_insured_amount,
  accepted_premium_tax,
  accepted_premium_without_tax,
  gross_premium,
  premium_without_tax
} from '@/utils/algorithm'

// 状态定义
const statusMap = {
  0: {
    color: 'gray',
    text: '未知'
  },
  1: {
    color: '#2db7f5',
    text: '待处理'
  },
  2: {
    color: '#54a0ff',
    text: '核保中'
  },
  3: {
    color: '#f8ac59',
    text: '待确认回'
  },
  4: {
    color: '#23c6c8',
    text: '待录系统'
  },
  5: {
    color: '#18a689',
    text: '已双确认'
  }
}

// 合同类型定义
const contractTypeMap = {
  0: {
    color: 'gray',
    text: '未知'
  },
  1: {
    color: '#f8ac59',
    text: 'Obligated合约'
  },
  2: {
    color: '#54a0ff',
    text: 'Non-obliged协议'
  },
  3: {
    color: '#18a689',
    text: '普通临分'
  }
}

export default {
  name: 'ProjectDetail',
  mixins: [baseMixin],
  data() {
    return {
      project: {},
      statuses: [],
      operationTabList: [
        {
          key: '1',
          tab: '条款和条件'
        },
        {
          key: '2',
          tab: '特别规定'
        },
        {
          key: '3',
          tab: '法律和管辖权'
        },
        {
          key: '4',
          tab: '付款条件'
        },
        {
          key: '5',
          tab: '附加信息'
        }
        // {
        //   key: '6',
        //   tab: '附件'
        // }
      ],
      operationActiveTabKey: '1',
      files: [
        {
          id: '1',
          filename: 'XXXXX分保条.pdf'
        }
      ]
    }
  },
  computed: {
    gross_premium() {
      return gross_premium(this.project.sumInsured, this.project.premiumRatio, this.project.riskDiscRatio)
    },
    premium_without_tax() {
      return premium_without_tax(this.gross_premium, this.project.local)
    },
    accepted_insured_amount() {
      return accepted_insured_amount(this.project.sumInsured, this.project.acceptedRatio)
    },
    accepted_gross_premium() {
      return accepted_gross_premium(
        this.project.premiumWzTax,
        this.gross_premium,
        this.premium_without_tax,
        this.project.acceptedRatio)
    },
    accepted_premium_without_tax() {
      return accepted_premium_without_tax(
        this.project.premiumWzTax,
        this.project.local,
        this.gross_premium,
        this.premium_without_tax,
        this.project.acceptedRatio)
    },
    accepted_premium_tax() {
      return accepted_premium_tax(this.accepted_gross_premium, this.accepted_premium_without_tax)
    },
    accepted_commission() {
      return accepted_commission(
        this.project.premiumWzTax,
        this.accepted_gross_premium,
        this.accepted_premium_without_tax,
        this.project.commissionRatio)
    },
    accepted_brokerage() {
      if (!this.project.brokerId)
        return .0
      return accepted_brokerage(
        this.project.brokerageWzTax,
        this.accepted_insured_amount,
        this.accepted_premium_without_tax,
        this.project.premiumRatio,
        this.project.brokerageRatio)
    },
    accepted_brokerage_tax() {
      if (!this.project.brokerId)
        return .0
      return accepted_brokerage_tax(
        this.project.brokerageWzTax,
        this.project.local,
        this.accepted_gross_premium,
        this.project.brokerageRatio)
    },
    accepted_balance() {
      return accepted_balance(
        this.accepted_gross_premium,
        this.accepted_commission,
        this.accepted_brokerage,
        this.accepted_brokerage_tax)
    }
  },
  filters: {
    statusFilter(type) {
      if (statusMap[type])
        return statusMap[type].text
      return '-'
    },
    statusColorFilter(type) {
      if (statusMap[type])
        return statusMap[type].color
      return '#fff'
    },
    contractTypeFilter(type) {
      if (contractTypeMap[type])
        return contractTypeMap[type].text
      return '-'
    },
    contractTypeColorMap(type) {
      if (contractTypeMap[type])
        return contractTypeMap[type].color
      return '#fff'
    }
  },
  created() {
    const { id } = this.$route.query
    fetching_project(id).then(res => {
      console.debug('project', res)
      if (res.code === 0 && res.result) {
        this.project = res.result
      } else {
        notification.error({
          message: '获取项目信息失败',
          description: `【错误代码】${res.code}，【错误消息】${res.message}`
        })
      }
    })
    fetching_project_status(id).then(res => {
      console.debug('project status', res)
      if (res.code === 0 && res.result && res.result.length > 0) {
        this.statuses = res.result
      } else {
        notification.error({
          message: '获取项目状态失败',
          description: `【错误代码】${res.code}，【错误消息】${res.message}`
        })
      }
    })
  },
  methods: {
    handleToProjects() {
      this.$router.push({ path: '/project/list' })
    },
    handleToDecisionMaking() {
      this.$router.push({ name: 'DecisionMaking', query: { id: this.project.id } })
    },
    handleToEdit(id) {
      this.$router.push({ name: 'ProjectEdit', query: { id: this.project.id } })
    },
    formatPrice(value) {
      let val = Math.round((value / 1) * 100) / 100
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style lang='less' scoped>

.detail-layout {
  margin-left: 44px;
}

.text {
  color: rgba(0, 0, 0, .45);
}

.heading {
  color: rgba(0, 0, 0, .85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, .25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }

  .text {

  }

  .status-list {
    text-align: left;
  }
}

.bill__row {
  padding: 1px 0 16px;
}

.bill__cell--label {
  color: rgba(0, 0, 0, 0.9);
}

.bill__cell--center {
  text-align: center;
  color: #f5222d;
  font-style: italic;
}

.bill__cell--money {
  text-align: right;
  background-color: #f0f2f5;
  font-family: tohoma, sans-serif;
}

.bill__cell--sign {
  text-align: center;
  color: rgba(0, 0, 0, 0.9);
}

</style>
