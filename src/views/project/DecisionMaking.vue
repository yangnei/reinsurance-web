<template>
  <page-header-wrapper
    :title='`单号：${project.id || ""}`'>
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
        <a-descriptions-item label='保险期限'>{{ project.startDate }} <span v-if='project.endDate'>~</span> {{ project.endDate }}</a-descriptions-item>
        <a-descriptions-item label='分出公司'>{{ project.cedantName }}
          <a-tag color='pink' style='margin-left: 16px;' v-if='!project.brokerName && project.local'>境外</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <template v-slot:extra>
      <a-button type='primary' @click='handleToProjects'>返回</a-button>
    </template>

    <a-card style='margin-top: 24px' :bordered='false' title='辅助决策'>
      <div style='max-width: 900px; margin: auto;'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>总保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(project.sumInsured) }} 元</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'><span v-if='project.maxUnitPml && project.maxUnitPml > 0'>最大危险单位：</span></a-col>
          <a-col :span='7' class='bill__cell--value'><span v-if='project.maxUnitPml && project.maxUnitPml > 0'>{{ formatPrice(project.maxUnitPml) }} 元</span></a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>保险费率：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ project.premiumRatio }} %</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'><span v-if='project.riskDiscRatio && project.riskDiscRatio != 100'>费率修正系数：</span></a-col>
          <a-col :span='7' class='bill__cell--value'><span v-if='project.riskDiscRatio && project.riskDiscRatio != 100'>{{ project.riskDiscRatio }} %</span></a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>含税总/毛保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(gross_premium) }} 元</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'>不含税总保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(premium_without_tax) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' :offset='13' class='bill__cell--label'>增值税：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(value_added_tax) }} 元</a-col>
        </a-row>
      </div>
      <a-divider />
      <div style='max-width: 900px; margin: auto;'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>临时分出比例：</a-col>
          <a-col :span='3'>
            <a-slider v-model='splitRatio' :min='0' :max='100' />
            <!--
            <a-input-number
              :min='0'
              :max='100'
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              v-model='splitRatio'
            />
            -->
          </a-col>
          <a-col :span='2' class='bill__cell--value'>{{ splitRatio }} %</a-col>
          <a-col :span='4' class='bill__cell--label' v-if='hasRetrocession'>转分保合约：</a-col>
          <a-col :span='11' v-if='hasRetrocession'>
            <a-select placeholder='请选择' default-value='0' style='width: 100%;' v-model='contractId'>
              <a-select-option value='0'>无</a-select-option>
              <a-select-option v-for='(contract, index) in contracts' :value='contract.id' :key='contract.id'>
                <a-badge
                  :color='contract.type | contractColorFilter'
                  :text='contract.name' />
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label' v-if='has_risk_discount_ratio'>Risk Discount Ratio：</a-col>
          <a-col :span='3' v-if='has_risk_discount_ratio'>
            <a-slider v-model='riskDiscountRatio' :min='0' :max='100' />
            <!--
            <a-input-number
              :min='0'
              :max='100'
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              v-model='riskDiscountRatio'
            />
            -->
          </a-col>
          <a-col :span='2' class='bill__cell--value' v-if='has_risk_discount_ratio'>{{ riskDiscountRatio }} %</a-col>
          <a-col :span='4' class='bill__cell--label' v-if='has_sa_ratio'>
            <a-checkbox v-model='useSaRatio' />
            <span style='margin-left: 8px;'>特别协议：</span></a-col>
          <a-col :span='3' v-if='has_sa_ratio'>
            <a-slider v-model='saRatio' :min='1' :max='100' />
          </a-col>
          <a-col :span='2' class='bill__cell--value' v-if='has_sa_ratio'>{{ saRatio }} %</a-col>
          <a-col :span='3' class='bill__cell--label' v-if='has_sa_lines'>
            <a-checkbox v-model='useSaLines' />
            <span style='margin-left: 8px;'>S.A. 线数：</span></a-col>
          <a-col :span='2' v-if='has_sa_lines'>
            <a-input-number :min='1' v-model='saLines' />
          </a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label' v-if='split_amount'>临时分出保额：</a-col>
          <a-col :span='5' class='bill__cell--value' v-if='split_amount'>{{ formatPrice(split_amount) }} 元</a-col>
          <a-col :span='4' class='bill__cell--label'>最大接受份额：</a-col>
          <a-col :span='3' class='bill__cell--value'>{{ max_acceptable_ratio ? max_acceptable_ratio.toFixed(2) + ' %' : '-' }}</a-col>
          <a-col :span='3' class='bill__cell--label'>最大接受保额：</a-col>
          <a-col :span='5' class='bill__cell--value'>{{ formatPrice(max_acceptable_amount) }} 元</a-col>
        </a-row>
      </div>
      <a-divider />
      <div style='max-width: 900px; margin: auto; background-color: #f0f2f5; padding: 0 8px;'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>接受份额：</a-col>
          <a-col :span='3' class='bill__cell--value'>
            <a-input-number
              :min='0'
              :max='100'
              :step='0.01'
              :precision='2'
              :formatter='value => `${value}%`'
              :parser="value => value.replace('%', '')"
              v-model='acceptedRatio'
            />
          </a-col>
          <a-col :span='14' class='bill__cell--value'>
            <a-slider v-model='acceptedRatio' :min='0' :max='100' :step='0.01' />
          </a-col>
          <a-col :span='3' class='bill__cell--value'>
            <a-button type='primary' icon='save' @click='handleSaving'>保存</a-button>
          </a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>接受公司保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_insured_amount) }} 元</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'>临分后保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(split_amount_remaining) }} 元</a-col>
        </a-row>

        <a-row :gutter='[16, 16]' v-if='acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>接受公司毛保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_gross_premium) }} 元</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'>接受公司不含税保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_premium_without_tax) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='acceptedRatio'>
          <a-col :span='5' :offset='12' class='bill__cell--label'>接受公司保费增值税：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_premium_tax) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>分保手续费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_commission) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='acceptedRatio && project.brokerId'>
          <a-col :span='4' class='bill__cell--label'>经纪费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_brokerage) }} 元</a-col>
          <a-col :span='5' :offset='1' class='bill__cell--label'>经纪费增值税：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_brokerage_tax) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='acceptedRatio'>
          <a-col :span='4' class='bill__cell--label'>保费余额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_balance) }} 元</a-col>
        </a-row>
      </div>
      <a-divider v-if='acceptedRatio && has_contract' />
      <div style='max-width: 900px; margin: auto;' v-if='acceptedRatio && has_contract'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>接受最大危险单位：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(accepted_pml) }} 元</a-col>
          <a-col :span='4' :offset='2' class='bill__cell--label' v-if='has_contract'>额外自留额：</a-col>
          <a-col :span='7' class='bill__cell--value' v-if='has_contract'>{{ formatPrice(accepted_addtional_retention) }} 元
          </a-col>
        </a-row>
      </div>
      <a-divider v-if='acceptedRatio && has_contract' />
      <div style='max-width: 900px; margin: auto;' v-if='acceptedRatio && has_contract'>
        <a-row :gutter='[16, 16]' v-if='has_surplus_share'>
          <a-col :span='4' class='bill__cell--label'>溢额分保保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(surplus_share_amount) }} 元</a-col>
          <a-col :span='4' :offset='2' class='bill__cell--label'>溢额分保保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(surplus_share_premium) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='has_quota_share'>
          <a-col :span='4' class='bill__cell--label'>成数分出保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(quota_ceded_amount) }} 元</a-col>
          <a-col :span='3'>
            <a-space>
              <span>@</span>
              <span class='bill__cell--value'>{{ quota_ceded_ratio }} %</span>
            </a-space>
          </a-col>
          <a-col :span='3' class='bill__cell--label'>成数分出保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(quota_ceded_premium) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='has_quota_share'>
          <a-col :span='4' class='bill__cell--label'>成数自留保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(quota_retention_amount) }} 元</a-col>
          <a-col :span='3'>
            <a-space>
              <span>@</span>
              <span class='bill__cell--value'>{{ quota_retention_ratio }} %</span>
            </a-space>
          </a-col>
          <a-col :span='3' class='bill__cell--label'>成数自留保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(quota_retention_premium) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]' v-if='has_contract'>
          <a-col :span='4' class='bill__cell--label'>合约分保保额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(treaty_amount) }} 元</a-col>
          <a-col :span='3'>
            <a-space v-if='has_quota_share'>
              <span>@</span>
              <span class='bill__cell--value'>{{ treaty_ratio }} %</span>
            </a-space>
          </a-col>
          <a-col :span='3' class='bill__cell--label'>合约分保保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(treaty_premium) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' class='bill__cell--label'>净自留额：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(net_retention) }} 元</a-col>
          <a-col :span='4' :offset='2' class='bill__cell--label'>净保费：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ formatPrice(net_premium) }} 元</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='4' :offset='13' class='bill__cell--label'>转分保比例：</a-col>
          <a-col :span='7' class='bill__cell--value'>{{ retro_ratio ? retro_ratio.toFixed(2) + ' %' : '-' }}</a-col>
        </a-row>
      </div>
      <a-divider v-if='acceptedRatio' />
      <div style='max-width: 900px; margin: auto;' v-if='acceptedRatio'>
        <a-row :gutter='[16, 16]'>
          <a-col :span='3' class='bill__cell--label'>利润</a-col>
          <a-col :span='1' class='bill__cell--sign'>=</a-col>
          <a-col :span='2' class='bill__cell--label'>保费余额</a-col>
          <a-col :span='1' class='bill__cell--label'>-</a-col>
          <a-col :span='3' class='bill__cell--label'>合约分保保费</a-col>
          <a-col :span='1' class='bill__cell--label'>+</a-col>
          <a-col :span='3' class='bill__cell--label'>合约手续费</a-col>
          <a-col :span='2' class='bill__cell--label'>@</a-col>
          <a-col :span='5' class='bill__cell--label'>=</a-col>
        </a-row>
        <a-row :gutter='[16, 16]'>
          <a-col :span='6' class='bill__cell--value'>{{ formatPrice(accepted_balance) }} 元</a-col>
          <a-col :span='4' class='bill__cell--value'>{{ formatPrice(treaty_premium) }} 元</a-col>
          <a-col :span='4' class='bill__cell--value'>{{ formatPrice(treaty_commission) }} 元</a-col>
          <a-col :span='2' class='bill__cell--value'>{{ treatyCommissionRatio }} %</a-col>
          <a-col :span='3' class='bill__cell--value'>
            <a-slider :min='0' :max='100' v-model='treatyCommissionRatio' />
          </a-col>
          <a-col :span='5' class='bill__cell--value'>{{ formatPrice(treaty_balance) }} 元</a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { fetching_project, updating_accepted_ratio } from '@/api/project'
import { fetching_active_contracts } from '@/api/contract'
import { fetching_company } from '@/api/company'
import {
  accepted_addtional_retention,
  accepted_balance,
  accepted_brokerage,
  accepted_brokerage_tax,
  accepted_commission,
  accepted_gross_premium,
  accepted_insured_amount,
  accepted_pml,
  accepted_premium_tax,
  accepted_premium_without_tax,
  amount_insured,
  gross_premium,
  max_acceptable_amount,
  max_acceptable_ratio,
  net_retention,
  premium_without_tax,
  quota_ceded_amount,
  quota_ceded_premium,
  quota_ceded_ratio,
  quota_retention_amount,
  quota_retention_premium,
  quota_retention_ratio,
  split_amount,
  split_amount_remaining,
  surplus_share_amount,
  surplus_share_premium,
  treaty_amount,
  treaty_premium,
  treaty_ratio,
  value_added_tax
} from '@/utils/algorithm'
import notification from 'ant-design-vue/lib/notification'

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

const contractMap = {
  1: {
    color: '#2db7f5',
    text: '成数合约'
  },
  2: {
    color: '#54a0ff',
    text: '溢额合约'
  },
  3: {
    color: '#f8ac59',
    text: '混合合约'
  },
  4: {
    color: '#23c6c8',
    text: '险位超赔'
  },
  5: {
    color: '#18a689',
    text: '赔付率超赔'
  }
}

export default {
  name: 'DecisionMaking',
  mixins: [baseMixin],
  data() {
    return {
      project: {},
      contracts: [],
      maxApprovalAmount: null,

      splitRatio: 0,
      hasRetrocession: true,
      contractId: null,
      riskDiscountRatio: 100,
      useSaRatio: false,
      saRatio: 100,
      useSaLines: false,
      saLines: 1,

      acceptedRatio: 0,
      treatyCommissionRatio: 0
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    gross_premium() {
      return gross_premium(this.project.sumInsured, this.project.premiumRatio, this.project.riskDiscRatio)
    },
    premium_without_tax() {
      return premium_without_tax(this.gross_premium, this.project.local)
    },
    value_added_tax() {
      return value_added_tax(this.gross_premium, this.premium_without_tax)
    },
    contract() {
      const found = this.contracts.find(el => el.id === this.contractId)
      return found ? found : { id: 0, type: 0 }
    },
    has_risk_discount_ratio() {
      return this.contract.type && ~[1, 2, 3].indexOf(this.contract.type)
    },
    has_sa_ratio() {
      return this.contract.type && ~[1, 2, 3].indexOf(this.contract.type)
    },
    has_sa_lines() {
      return this.contract.type && ~[2, 3].indexOf(this.contract.type)
    },
    has_surplus_share() {
      return this.contract.type && ~[2, 3].indexOf(this.contract.type)
    },
    has_quota_share() {
      return this.contract.type && ~[1, 3].indexOf(this.contract.type)
    },
    has_contract() {
      return this.contract.type && ~[1, 2, 3, 4, 5].indexOf(this.contract.type)
    },
    insured_amount() {
      return amount_insured(this.project.sumInsured, this.project.maxUnitPml)
    },
    max_acceptable_ratio() {
      return max_acceptable_ratio(
        this.contract,
        this.insured_amount,
        this.maxApprovalAmount,
        this.splitRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null,
        this.useSaLines ? this.saLines : null)
    },
    max_acceptable_amount() {
      return max_acceptable_amount(this.insured_amount, this.max_acceptable_ratio)
    },
    split_amount() {
      return split_amount(this.max_acceptable_amount, this.splitRatio)
    },
    accepted_insured_amount() {
      return accepted_insured_amount(this.project.sumInsured, this.acceptedRatio)
    },
    split_amount_remaining() {
      return split_amount_remaining(this.accepted_insured_amount, this.splitRatio)
    },
    accepted_gross_premium() {
      return accepted_gross_premium(
        this.project.premiumWzTax,
        this.gross_premium,
        this.premium_without_tax,
        this.acceptedRatio)
    },
    accepted_premium_without_tax() {
      return accepted_premium_without_tax(
        this.project.premiumWzTax,
        this.project.local,
        this.gross_premium,
        this.premium_without_tax,
        this.acceptedRatio)
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
    },
    accepted_pml() {
      return accepted_pml(this.insured_amount, this.splitRatio, this.acceptedRatio)
    },
    accepted_addtional_retention() {
      return accepted_addtional_retention(
        this.contract,
        this.accepted_pml,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null,
        this.useSaLines ? this.saLines : null)
    },
    surplus_share_amount() {
      return surplus_share_amount(
        this.contract,
        this.accepted_pml,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null,
        this.useSaLines ? this.saLines : null)
    },
    surplus_share_premium() {
      return surplus_share_premium(this.surplus_share_amount, this.project.premiumRatio)
    },
    quota_ceded_amount() {
      return quota_ceded_amount(
        this.contract,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    quota_ceded_ratio() {
      return quota_ceded_ratio(
        this.contract,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    quota_ceded_premium() {
      return quota_ceded_premium(this.quota_ceded_amount, this.project.premiumRatio)
    },
    quota_retention_amount() {
      return quota_retention_amount(
        this.contract,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    quota_retention_ratio() {
      return quota_retention_ratio(
        this.contract,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    quota_retention_premium() {
      return quota_retention_premium(this.quota_retention_amount, this.project.premiumRatio)
    },
    treaty_amount() {
      return treaty_amount(
        this.contract,
        this.quota_retention_amount,
        this.quota_ceded_amount,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    treaty_ratio() {
      return treaty_ratio(
        this.contract,
        this.quota_retention_ratio,
        this.quota_ceded_ratio,
        this.split_amount_remaining,
        this.acceptedRatio,
        this.riskDiscountRatio,
        this.useSaRatio ? this.saRatio : null)
    },
    treaty_premium() {
      return treaty_premium(
        this.contract,
        this.quota_ceded_premium,
        this.surplus_share_premium,
        this.treaty_amount,
        this.project.premiumRatio)
    },
    net_retention() {
      return net_retention(
        this.contract,
        this.accepted_addtional_retention,
        this.quota_retention_amount,
        this.split_amount_remaining,
        this.treaty_amount)
    },
    net_premium() {
      return this.accepted_gross_premium - this.treaty_premium
    },
    retro_ratio() {
      return (this.accepted_pml - this.net_retention) / this.accepted_pml * 100.0
    },
    treaty_commission() {
      return this.treaty_premium * this.treatyCommissionRatio / 100.0
    },
    treaty_balance() {
      return this.accepted_balance - this.treaty_premium + this.treaty_commission
    }
  },
  filters: {
    contractFilter(type) {
      if (contractMap[type])
        return contractMap[type].text
      return '-'
    },
    contractColorFilter(type) {
      if (contractMap[type])
        return contractMap[type].color
      return '#fff'
    },
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
        this.project = { ...res.result }
        if (this.project.contractType === 1 /* Obligated合约 */ && !this.project.fareType /* 不是特约临分 */) {
          this.contractId = 0 // 无转分保合约
          this.hasRetrocession = false // 隐藏转分保选项
        }
        this.acceptedRatio = this.project.acceptedRatio || 0
        this.loadContracts(this.project.startDate)
      } else {
        notification.error({
          message: '获取项目信息失败',
          description: `【错误代码】${res.code}，【错误消息】${res.message}`
        })
      }
    })
    fetching_company(this.userInfo.companyId).then(res => {
      console.debug('company', res)
      if (res.code === 0 && res.result) {
        const { capital = 0, reserves = 0 } = res.result
        this.maxApprovalAmount = capital + reserves
        console.debug('max approval amount', this.maxApprovalAmount)
      } else {
        notification.error({
          message: '获取分入公司信息失败',
          description: `【错误代码】${res.code}，【错误消息】${res.message}`
        })
      }
    })
  },
  methods: {
    /*
    calculate() {
      console.debug('acceptRatio', this.acceptRatio)
      console.debug('contractId', this.contractId)
      this.calculationResult = null
      if (!isNumeric(this.acceptedRatio)) {
        this.acceptedRatio = null
      }
      calculate({
        projectId: this.project.id,
        contractId: this.contractId,
        acceptedRatio: this.acceptedRatio
      }).then(res => {
        console.debug('calculation result', res)
        if (res.code === 0 && res.result) {
          this.calculationResult = res.result
        } else {
          this.$message.warning(`【错误代码】${res.code}，【错误消息】${res.message}`)
        }
      })
    },

    calculateBalance() {
      if (!isNumeric(this.ttyCommRatio)) this.ttyCommRatio = .0
      this.ttyComm = this.calculationResult.ttyPremium * this.ttyCommRatio / 100.0
      this.ttyBalance = this.calculationResult.balance - this.calculationResult.ttyPremium + this.ttyComm
      console.debug(this.ttyBalance, this.calculationResult.balance, this.calculationResult.ttyPremium, this.ttyComm)
    },
    */
    handleSaving() {
      updating_accepted_ratio(this.project.id, this.acceptedRatio).then(res => {
        if (res.code === 0) {
          this.$message.success('接入份额保存成功')
        } else {
          notification.error({
            message: '接入份额更新失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    handleToProjects() {
      this.$router.push({ path: '/project/list' })
    },
    handleToProjectDetail() {
      this.$router.push({ path: '/project/detail' })
    },
    loadContracts(date) {
      return fetching_active_contracts(date).then(res => {
        console.debug('contract list', res)
        if (res.code === 0 && res.result) {
          this.contracts = res.result
        } else {
          notification.error({
            message: '获取转分保合约列表失败',
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
  text-align: right;
  color: rgba(0, 0, 0, 0.9);
  line-height: 32px;
}

.bill__cell--center {
  text-align: center;
  color: #f5222d;
  font-style: italic;
}

.bill__cell--value {
  text-align: right;
  font-family: tohoma, sans-serif;
  letter-spacing: 2px;
  font-size: 110%;
  line-height: 32px;
}

.bill__cell--money {
  text-align: right;
  background-color: #f0f2f5;
}

.bill__cell--sign {
  text-align: center;
  color: rgba(0, 0, 0, 0.9);
}

</style>
