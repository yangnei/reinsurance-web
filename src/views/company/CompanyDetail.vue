<template>
  <page-header-wrapper :title='company.fullNameCn'>
    <template v-slot:extra>
      <a-button type='primary' @click='handleToEdit(company.id)'>编辑</a-button>
      <a-button @click='handleBackToList'>返回</a-button>
    </template>
    <a-card :bordered='false'>
      <a-descriptions title='基本信息'>
        <a-descriptions-item label='监管登记号' :span='2'>{{ company.regNo }}</a-descriptions-item>
        <a-descriptions-item label='编号'>{{ company.id }}</a-descriptions-item>
        <a-descriptions-item label='机构名称（中文）' :span='2'>{{ company.fullNameCn }}</a-descriptions-item>
        <a-descriptions-item label='机构简称（中文）'>{{ company.shortNameCn }}</a-descriptions-item>
        <a-descriptions-item label='机构名称（英文）' :span='2'>{{ company.fullNameEn }}</a-descriptions-item>
        <a-descriptions-item label='机构名称（英文）'>{{ company.shortNameEn }}</a-descriptions-item>
        <a-descriptions-item label='机构类型' :span='3'>{{ company.type === 1 ? '保险公司' : company.type === 2 ? '保险经纪公司' : '-' }}</a-descriptions-item>
        <a-descriptions-item label='境内/境外' :span='3'>{{ company.overseas === 1 ? '境内' : company.overseas === 2 ? '境外' : '-' }}</a-descriptions-item>
        <a-descriptions-item label='机构地址（经营场所）' :span='3'>{{ company.address }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style='margin-bottom: 32px' />
      <a-descriptions title='联系方式'>
        <a-descriptions-item label='联系人' :span='3'>{{ company.contact }}</a-descriptions-item>
        <a-descriptions-item label='联系地址' :span='2'>{{ company.contAddress }}</a-descriptions-item>
        <a-descriptions-item label='联系电话'>{{ company.contPhone }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style='margin-bottom: 32px' />
      <a-descriptions title='信息披露'>
        <a-descriptions-item label='资本金' :span='2'>{{ digitUppercase(company.capital) }}</a-descriptions-item>
        <a-descriptions-item label='合约首席资格'>
          <a-checkbox :checked='company.leader' />
        </a-descriptions-item>
        <a-descriptions-item label='公积金' :span='2'>{{ digitUppercase(company.reserves) }}</a-descriptions-item>
        <a-descriptions-item label='合约资格'>
          <a-checkbox :checked='company.contract' />
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style='margin-bottom: 32px' />
      <a-descriptions title='评级'>
        <a-descriptions-item label='普尔评级' :span='3'>
          <a-rate :value='company.poorsRating' disabled :count='21'></a-rate>
          <span class='ant-rate-text'>{{ spRatingName[company.poorsRating] }}</span></a-descriptions-item>
        <a-descriptions-item label='穆迪评级' :span='3'>
          <a-rate :value='company.moodysRating' disabled :count='21'></a-rate>
          <span class='ant-rate-text'>{{ mdRatingName[company.moodysRating] }}</span></a-descriptions-item>
        <a-descriptions-item label='贝氏评级' :span='3'>
          <a-rate :value='company.bayesianRating' disabled :count='21'></a-rate>
          <span class='ant-rate-text'>{{ spRatingName[company.bayesianRating] }}</span></a-descriptions-item>
        <a-descriptions-item label='惠誉评级' :span='3'>
          <a-rate :value='company.fitchRating' disabled :count='21'></a-rate>
          <span class='ant-rate-text'>{{ spRatingName[company.fitchRating] }}</span></a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { fetching_company } from '@/api/company'
import notification from 'ant-design-vue/lib/notification'

export default {
  components: {
    STable
  },
  data() {
    return {
      spRatingName: ['-', 'C', 'CC', 'CCC-', 'CCC', 'CCC+', 'B-', 'B', 'B+', 'BB-', 'BB', 'BB+', 'BBB-', 'BBB', 'BBB+', 'A-', 'A', 'A+', 'AA-', 'AA', 'AA+', 'AAA'],
      mdRatingName: ['-', 'C', 'Ca', 'Caa3', 'Caa2', 'Caa1', 'B3', 'B2', 'B1', 'Ba3', 'Ba2', 'Ba1', 'Baa3', 'Baa2', 'Baa1', 'A3', 'A2', 'A1', 'Aa3', 'Aa2', 'Aa1', 'Aaa'],
      company: {
        id: '-',
        type: 0,
        overseas: 0,
        regNo: '-',
        fullNameCn: '-',
        shortNameCn: '-',
        fullNameEn: '-',
        shortNameEn: '-',
        address: '-',
        contact: '-',
        contAddress: '-',
        contPhone: '-',
        capital: null,
        reserves: null,
        leader: false,
        contract: false,
        poorsRating: 0,
        moodysRating: 0,
        bayesianRating: 0,
        fitchRating: 0
      }
    }
  },
  created() {
    const { id } = this.$route.query
    fetching_company(id).then(res => {
      console.debug('company', res)
      if (res.code === 0 && res.result) {
        this.company = res.result
      } else {
        notification.error({
          message: '获取公司信息失败',
          description: `【错误代码】${res.code}，【错误消息】${res.message}`
        })
      }
    })
  },
  methods: {
    handleBackToList() {
      this.$router.push({ name: 'CompanyList' })
    },
    handleToEdit(id) {
      this.$router.push({ name: 'CompanyEdit', query: { id: id } })
    },
    formatPrice(value) {
      let val = Math.round((value / 1) * 100) / 100
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    digitUppercase(price) {
      const fraction = ['角', '分']
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      let num = Math.abs(price)
      let s = ''
      fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '')
      })
      s = s || '整'
      num = Math.floor(num)
      for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = ''
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
          p = digit[num % 10] + unit[1][j] + p
          num = Math.floor(num / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }

      return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    }
  }
}
</script>

<style lang='less' scoped>
.title {
  color: rgba(0, 0, 0, .85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
