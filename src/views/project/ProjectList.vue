<template>
  <page-header-wrapper
    content='再保险接受人在收到临分要约后，应在要约有限期内提出实质性反馈。对于拒绝的业务，应及时反馈婉拒信息。
             对于拟承保业务或采用差异化条件承保或报价业务，再保险接受人在向再保险分出人或再保险经纪人反馈时，宜附加合同成立前提条件。
             同时，再保险接受人在业务系统或业务登记台帐表中做好已报价待反馈、已接受、已拒绝等业务处理标识。'>
    <template v-slot:extraContent>
      <div style='width: 155px; margin-top: -20px;'><img style='width: 100%' src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png' alt='' /></div>
    </template>

    <a-card :bordered='false'>

      <!-- 搜索表单 -->
      <div class='table-page-search-wrapper'>
        <a-form layout='inline'>
          <a-row :gutter='48'>
            <a-col :md='8' :sm='24'>
              <a-form-item label='项目名称'>
                <a-input v-model='queryParams.projectName' />
              </a-form-item>
            </a-col>
            <a-col :md='8' :sm='24'>
              <a-form-item label='项目状态'>
                <a-select v-model='queryParams.status' placeholder='请选择' default-value='0'>
                  <a-select-option value='0'>全部</a-select-option>
                  <a-select-option value='1'>
                    <a-badge color='#2db7f5' text='待处理' />
                  </a-select-option>
                  <a-select-option value='2'>
                    <a-badge color='#54a0ff' text='核保中' />
                  </a-select-option>
                  <a-select-option value='3'>
                    <a-badge color='#f8ac59' text='待确认回' />
                  </a-select-option>
                  <a-select-option value='4'>
                    <a-badge color='#23c6c8' text='待录系统' />
                  </a-select-option>
                  <a-select-option value='5'>
                    <a-badge color='#18a689' text='已双确认' />
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if='advanced'>
              <a-col :md='8' :sm='24'>
                <a-form-item label='原被保险人'>
                  <a-input v-model='queryParams.insured' style='width: 100%' />
                </a-form-item>
              </a-col>
              <a-col :md='8' :sm='24'>
                <a-form-item label='要约日期'>
                  <a-date-picker
                    v-model='queryParams.offerDate'
                    format='YYYY-MM-DD'
                    style='width: 200px'
                    placeholder='请输入要约日期'
                  />
                  <span style='margin-left: 16px'>以后</span>
                </a-form-item>
              </a-col>
              <a-col :md='8' :sm='24'>
                <a-form-item label='险别'>
                  <a-select v-model='queryParams.categoryId' placeholder='请选择' default-value='0'>
                    <a-select-option value='0'>全部</a-select-option>
                    <a-select-option v-for='(category, index) in categories' :value='category.id' :key='category.id'>{{ category.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md='8' :sm='24'>
                <a-form-item label='分出公司'>
                  <a-input v-model='queryParams.cedantName' style='width: 100%' />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md='!advanced && 8 || 24' :sm='24'>
              <span class='table-page-search-submitButtons' :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type='primary' @click='$refs.table.refresh(true)'>查询</a-button>
                <a-button style='margin-left: 8px' @click='resetSearchForm'>重置</a-button>
                <a @click='toggleAdvanced' style='margin-left: 8px'>
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作区 -->
      <div class='table-operator'>
        <a-button type='primary' icon='edit' @click='handleToCreateProject'>录入要约</a-button>
        <a-button icon='export' @click='exporting'>导出</a-button>
      </div>

      <!-- 数据表 -->
      <s-table
        ref='table'
        size='default'
        rowKey='id'
        :columns='columns'
        :data='loadData'
        showPagination='auto'
      >

        <!-- # -->
        <span slot='serial' slot-scope='text, record, index'>{{ index + 1 }}</span>

        <!-- 状态 -->
        <span slot='status' slot-scope='text'>
          <a-tag :color='text | statusColorFilter'>{{ text | statusFilter }}</a-tag>
        </span>

        <!-- 描述 -->
        <span slot='link' slot-scope='text, record'>
          <a href='#' @click='handleToProjectDetail(record.id)'>{{ text }}</a>
        </span>

        <!-- 描述 -->
        <span slot='description' slot-scope='text'>
          <ellipsis :length='4' tooltip>{{ text }}</ellipsis>
        </span>

        <!-- 操作 -->
        <span slot='action' slot-scope='text, record'>
          <template>
            <a @click='handleOpenStatusModal(record)'>设置状态</a>
            <a-divider type='vertical' />
            <a @click='handleToDecisionMaking(record.id)'>辅助决策</a>
            <a-divider type='vertical' />
            <a-popconfirm :title='`是否要删除项目「${record.name}」？`' @confirm='handleDelete(record.id)'>
              <a style='color: #ed5565;'>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <!-- 设置状态对话框 -->
      <status-form
        ref='statusModal'
        :visible='visible'
        :loading='confirmLoading'
        :model='mdl'
        @cancel='handleSetStatusCancel'
        @ok='handleSetStatusOk'
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { deleting_project, exporting_projects, querying_projects, updating_status } from '@/api/project'
import { fetching_categories } from '@/api/category'

// Modals
import StatusForm from './modules/StatusForm'
import notification from 'ant-design-vue/lib/notification'

// 表定义
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'link' }
  },
  {
    title: '被保险人',
    dataIndex: 'insured'
  },
  {
    title: '分出公司',
    dataIndex: 'cedantName'
  },
  {
    title: '要约日期',
    dataIndex: 'offerDate'
    // sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '230px',
    scopedSlots: { customRender: 'action' }
  }
]

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
  name: 'ProjectList',
  components: {
    STable,
    Ellipsis,
    StatusForm
  },
  data() {
    this.columns = columns  // 表定义
    return {
      categories: [], // 险种

      // status modal
      visible: false,
      confirmLoading: false,
      mdl: null,

      // 搜索 展开/关闭
      advanced: false,

      // 查询参数
      queryParams: {},

      // 加载数据方法
      loadData: pagingParams => {
        return querying_projects(pagingParams, this.queryParams)
          .then(res => {
            console.debug('project list', res)
            if (res.code === 0 && res.result && res.result.records) {
              return {
                pageSize: res.result.size,
                pageNo: res.result.current,
                totalCount: res.result.total,
                totalPage: res.result.pages,
                data: res.result.records
              }
            } else {
              notification.error({
                message: '获取项目列表失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
      }
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
    // 加载险种
    fetching_categories().then(res => {
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
  methods: {
    handleOpenStatusModal(record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleSetStatusOk() {
      const form = this.$refs.statusModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('status modal form values', values)
          const { id, status, date, comment } = values
          updating_status({
            projectId: id,
            status: status,
            statusDate: date.format('YYYY-MM-DD'),
            comment: comment
          }).then(res => {
            this.visible = false
            this.confirmLoading = false
            if (res.code === 0) {
              // 重置表单数据
              form.resetFields()

              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            } else {
              notification.error({
                message: '设置项目状态失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleSetStatusCancel() {
      this.visible = false
      const form = this.$refs.statusModal.form
      form.resetFields() // 清理表单数据
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetSearchForm() {
      this.queryParams = {}
      this.$refs.table.refresh(true)
    },
    handleToCreateProject() {
      this.$router.push({ name: 'ProjectEdit', query: { id: '0' } })
    },
    handleToProjectDetail(id) {
      this.$router.push({ path: '/project/detail', query: { id: id } })
    },
    handleToDecisionMaking(id) {
      this.$router.push({ name: 'DecisionMaking', query: { id: id } })
    },
    handleDelete(id) {
      deleting_project(id).then(res => {
        console.debug('delete project', res)
        if (res.code === 0) {
          this.$message.success('项目删除成功')
          this.$refs.table.refresh()
        } else {
          notification.error({
            message: '删除项目失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    },

    /**
     * 导出
     */
    exporting(e) {
      e.preventDefault()
      exporting_projects(this.queryParams).then(res => {
        /*
        const blob = new Blob([res.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = '项目列表'
        link.click()
        URL.revokeObjectURL(link.href)
        */
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const fileUrl = window.URL.createObjectURL(blob)
        const fileLink = document.createElement('a')
        fileLink.href = fileUrl
        fileLink.setAttribute('download', '项目列表.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
        window.URL.revokeObjectURL(fileUrl)
      }).catch(console.error)
    }
  }
}
</script>
