<template>
  <div>
    <a-form>
      <a-result title="操作成功" :is-success="true" sub-title="使用项目管理功能管理要约" style="max-width: 560px; margin: 40px auto 0;">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">项目名称：</a-col>
            <a-col :sm="16" :xs="24">沈阳华晨宝马二期工程</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">被保险人：</a-col>
            <a-col :sm="16" :xs="24">华晨宝马股份有限公司</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">分出公司：</a-col>
            <a-col :sm="16" :xs="24">中国太平洋财产保险股份有限公司</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">总保额：</a-col>
            <a-col :sm="16" :xs="24"><span class="money">5,000,000,000</span> 元</a-col>
          </a-row>
        </div>
        <template #extra>
          <a-button type="primary" @click="finish">继续录入</a-button>
          <a-button style="margin-left: 8px" @click="toOrderList">查看项目</a-button>
        </template>
      </a-result>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Step3',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    finish () {
      this.$emit('finish')
    },
    toOrderList () {
      this.$router.push('/project/list')
    }
  }
}
</script>
<style lang="less" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>
