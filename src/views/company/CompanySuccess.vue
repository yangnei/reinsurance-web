<template>
  <a-card :bordered='false'>
    <a-result
      status='success'
      :title='result.title'
      :sub-title='isUpdate ?
      `保险公司 「${company.fullNameCn}」（编号：${company.id}，监管登记号：${company.regNo}）的信息已经被更新` :
      `已新增保险公司 「${company.fullNameCn}」（编号：${company.id}，监管登记号：${company.regNo}）`'
    >
      <template #extra>
        <a-button type='primary' @click='handleBackToList'>返回列表</a-button>
        <a-button style='margin-left: 8px' @click='handleToCompanyDetail(company.id)'>查看信息</a-button>
        <a-button style='margin-left: 8px' @click='handleToCreateCompany'>新增公司</a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'CompanySuccess',
  mixins: [baseMixin],
  data() {
    return {
      isUpdate: false,
      company: {
        id: '-',
        regNo: '-',
        fullNameCn: '-'
      }
    }
  },
  computed: {
    result() {
      return {
        title: this.isUpdate ? '更新成功' : '保存成功'
      }
    }
  },
  created() {
    this.isUpdate = this.$route.params.isUpdate
    this.company = this.$route.params.company
  },
  methods: {
    handleBackToList() {
      this.$router.push({ name: 'CompanyList' })
    },
    handleToCompanyDetail(id) {
      this.$router.push({ name: 'CompanyDetail', query: { id: id } })
    },
    handleToCreateCompany() {
      this.$router.push({ name: 'CompanyEdit', query: { id: '0' } })
    }
  }
}
</script>
