<template>
  <page-header-wrapper
    content='管理所有保险公司（包括保险经纪公司）的信息'>
    <template v-slot:extraContent>
      <div style='width: 155px; margin-top: -20px;'><img style='width: 100%' src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png' alt='' /></div>
    </template>
    <a-card :bordered='false'>

      <!-- 操作区 -->
      <div class='table-operator'>
        <a-button type='primary' icon='plus' @click='handleToCreateCompany'>新建</a-button>
        <a-popconfirm title='是否要删除这些公司？' @confirm='handleBatchDelete'>
          <a-button type='danger' icon='delete' v-if='selectedRowKeys.length > 0'>删除</a-button>
        </a-popconfirm>
      </div>

      <!-- 数据表 -->
      <s-table
        ref='table'
        size='default'
        rowKey='id'
        :columns='columns'
        :data='loadData'
        :alert='false'
        :rowSelection='rowSelection'
        showPagination='auto'>
        <!-- # -->
        <span slot='serial' slot-scope='text, record, index'>{{ index + 1 }}</span>

        <!-- type -->
        <span slot='type' slot-scope='text'>
          <a-tag :color='text | typeColorFilter'>{{ text | typeFilter }}</a-tag>
        </span>

        <!-- overseas -->
        <span slot='overseas' slot-scope='text'>
          <a-tag :color='text | overseasColorFilter'>{{ text | overseasFilter }}</a-tag>
        </span>

        <!-- link -->
        <span slot='link' slot-scope='text, record'>
          <a href='#' @click='handleToCompanyDetail(record.id)'>{{ text }}</a>
        </span>

        <!-- ellipsis -->
        <span slot='ellipsis' slot-scope='text'>
          <ellipsis :length='40' tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { querying_companies, deleting_companies } from '@/api/company'
import notification from 'ant-design-vue/lib/notification'

// 表定义
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '监管登记号',
    dataIndex: 'regNo'
  },
  {
    title: '机构类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '机构名称',
    dataIndex: 'fullNameCn',
    scopedSlots: { customRender: 'link' }
  },
  {
    title: '境内/境外',
    dataIndex: 'overseas',
    scopedSlots: { customRender: 'overseas' }
  },
  {
    title: '机构地址',
    dataIndex: 'address',
    scopedSlots: { customRender: 'ellipsis' }
  }
]

// 机构类别定义
const typeMap = {
  1: {
    color: '#54A0FF',
    text: '保险公司'
  },
  2: {
    color: '#0AA679',
    text: '经纪公司'
  }
}

// 境内/境外定义
const overseasMap = {
  1: {
    color: '#54A0FF',
    text: '境内'
  },
  2: {
    color: '#F50',
    text: '境外'
  }
}

export default {
  name: 'CompanyList',
  components: {
    STable,
    Ellipsis
  },
  data() {
    this.columns = columns
    return {
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return querying_companies(requestParameters)
          .then(res => {
            console.debug('company list', res)
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
                message: '获取公司列表失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    typeFilter(type) {
      return typeMap[type].text
    },
    typeColorFilter(type) {
      return typeMap[type].color
    },
    overseasFilter(type) {
      return overseasMap[type].text
    },
    overseasColorFilter(type) {
      return overseasMap[type].color
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    // empty
  },
  methods: {

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    handleToCreateCompany() {
      this.$router.push({ name: 'CompanyEdit', query: { id: '0' } })
    },

    handleToCompanyDetail(id) {
      this.$router.push({ name: 'CompanyDetail', query: { id: id } })
    },

    handleBatchDelete() {
      deleting_companies(this.selectedRowKeys).then(res => {
        console.debug('batch delete companies', res)
        if (res.code === 0) {
          this.$message.success('公司信息删除成功')
          this.$refs.table.refresh()
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          notification.error({
            message: '删除公司信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  }
}
</script>
