<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class='page-header-content'>
        <div class='avatar'>
          <a-avatar size='large' :src='currentUser.avatar' />
        </div>
        <div class='content'>
          <div class='content-title'>
            {{ timeFix }}，{{ user.name }}
          </div>
          <div v-if='user'>
            <template v-if='user.position'>{{ user.position }}</template>
            <template v-if='user.position && user.companyName'>&nbsp;|&nbsp;</template>
            <template v-if='user.companyName'>{{ user.companyName }}</template>
            <template v-if='user.department && user.companyName'>&nbsp;-&nbsp;</template>
            <template v-if='user.department'>{{ user.department }}</template>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class='extra-content'>
        <div class='stat-item'>
          <a-statistic
            :title="$t('home.stat.task-num')"
            :value='summary.num || 0'
          />
        </div>
        <div class='stat-item'>
          <a-statistic
            :title="$t('home.stat.gross-premium')"
            prefix='￥'
            :precision='2'
            :value='summary.premium || 0'
          />
        </div>
        <div class='stat-item'>
          <a-statistic
            :title="$t('home.stat.sum-insured')"
            prefix='￥'
            :precision='2'
            :value='summary.amt || 0'
          />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter='24'>
        <a-col :xl='16' :lg='24' :md='24' :sm='24' :xs='24'>
          <a-card
            class='project-list'
            :loading='loading'
            style='margin-bottom: 24px;'
            :bordered='false'
            :title='$t("home.card-title.last-task")'
            :body-style='{ padding: 0 }'>
            <a slot='extra' @click='handleToProjects'>{{ $t("home.card-title.all-task") }}</a>
            <div>
              <a-card-grid class='project-card-grid' :key='i' v-for='(project, i) in projects'>
                <a-card class='project-card' :bordered='false' :body-style='{ padding: 0 }' @click='handleToProjectDetail(project.id)'>
                  <a-card-meta>
                    <div slot='title' class='card-title'>
                      <!--
                      <a-avatar size="small" :src="item.cover"/>
                      <a>{{ item.title }}</a>
                      -->
                      <a-tag :color='project.status | statusColorFilter'>{{ project.status | statusFilter }}</a-tag>
                    </div>
                    <div slot='description' class='card-description'>
                      <strong>{{ project.name }}</strong>
                      <br>
                      {{ formatPrice(project.sumInsured) }} 元
                    </div>
                  </a-card-meta>
                  <div class='project-item'>
                    <a href='#'>{{ project.cedantShortName || project.cedantName }}</a>
                    <span class='datetime'>{{ project.offerDate }}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading='loading' :title='$t("home.card-title.activities")' :bordered='false'>
            <a-list>
              <a-list-item :key='index' v-for='(activity, index) in activities'>
                <a-list-item-meta>
                  <a-avatar slot='avatar' src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' />
                  <div slot='title'>
                    <span>{{ activity.operatorName }}{{ activity.operation }}</span>
                    <template v-if='activity.objectType'>{{ activity.objectType }}&nbsp;<a href='#'
                                                                                           @click='handleActivityOp(activity.objectType, activity.objectId)'>{{ activity.objectName
                      }}</a></template>
                  </div>
                  <div slot='description'>{{ activity.operationTime }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style='padding: 0 12px'
          :xl='8'
          :lg='24'
          :md='24'
          :sm='24'
          :xs='24'>
          <a-card :title='$t("home.card-title.navigation")' style='margin-bottom: 24px' :bordered='false' :body-style='{padding: 0}'>
            <div class='item-group' style='padding-bottom: 20px;'>
              <a-button size='small' type='primary' ghost icon='edit' @click='handleToCreateProject'>{{ $t('home.button.new-task') }}</a-button>
              <!--
              <a-button size='small' type='primary' ghost icon='transaction' style='margin-left: 16px;'>汇率查询</a-button>
              -->
            </div>
          </a-card>
          <a-card
            :title='$t("home.card-title.statistics")'
            style='margin-bottom: 24px'
            x-loading='radarLoading'
            :bordered='false'
            :body-style='{ padding: 0 }'>
            <div style='min-height: 400px; padding-bottom: 24px;'>
              <div class='echarts' id='pie_chart' :style="{width:'368px',height:'400px'}" ref='pieChart'></div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

import { fetching_new_projects } from '@/api/project'
import { fetching_activities, fetching_chart, fetching_summary } from '@/api/home'
import notification from 'ant-design-vue/lib/notification'

const echarts = require('echarts')

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

export default {
  name: 'Home',
  components: {
    PageHeaderWrapper
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      projects: [],
      loading: true,
      activities: [],
      summary: {},
      chart: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    currentUser() {
      return {
        avatar: this.$store.getters.userInfo && this.$store.getters.userInfo.avatar ?
          `${process.env.VUE_APP_API_BASE_URL}/file/avatar/${this.$store.getters.userInfo.avatar}` :
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusColorFilter(type) {
      return statusMap[type].color
    }
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted() {
    this.getSummary()
    this.getProjects()
    this.getActivities()
    this.getChart().then(() => {
      // add pie charts!
      const chartEl = document.getElementById('pie_chart')
      const pieChart = echarts.init(chartEl)
      pieChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 'bottom'
        },
        series: [
          {
            name: '项目比例',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.chart
          }
        ]
      })
    })
  },

  methods: {
    getSummary() {
      fetching_summary().then(res => {
        console.debug('home summary', res)
        if (res.code === 0 && res.result) {
          this.summary = res.result
        } else {
          notification.error({
            message: '获取汇总信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    getChart() {
      return fetching_chart().then(res => {
        console.debug('home chart', res)
        if (res.code === 0 && res.result) {
          this.chart = res.result
        } else {
          notification.error({
            message: '获取图表信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    getProjects() {
      fetching_new_projects().then(res => {
        console.debug('new projects', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.projects = res.result
        } else {
          notification.error({
            message: '获取项目信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      }).finally(() => this.loading = false)
    },
    getActivities() {
      fetching_activities().then(res => {
        console.debug('activities', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.activities = res.result
        } else {
          notification.error({
            message: '获取活动动态失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },
    handleToProjects() {
      this.$router.push({ path: '/project/list' })
    },
    handleToCreateProject() {
      this.$router.push({ name: 'ProjectEdit', query: { id: '0' } })
    },
    handleToProjectDetail(id) {
      this.$router.push({ name: 'ProjectDetail', query: { id: id } })
    },
    handleActivityOp(type, id) {
      if (type == '项目' || type == '项目状态')
        this.$router.push({ name: 'ProjectDetail', query: { id: id } })
      else if (type == '公司')
        this.$router.push({ name: 'CompanyDetail', query: { id: id } })
      else if (type == '合约')
        this.$router.push({ name: 'ContractDetail', query: { id: id } })
      else if (type == '险种')
        console.debug('待实装')
      else
        console.error('未知状态', type, id)
    },
    formatPrice(value) {
      let val = Math.round((value / 1) * 100) / 100
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style lang='less' scoped>
@import "./Home.less";

.project-list {

  .project-card-grid {
    cursor: pointer;
  }

  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {

  .project-list {

    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}

</style>
