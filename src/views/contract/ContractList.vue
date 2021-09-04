<template>
  <page-header-wrapper
    content='此处分保合约指分保接受人参加再保险业务后，为了减少自身的承担责任，通过合同分保方式，将一部分或全部责任转分给其他再保险人的合约。'>
    <template v-slot:extraContent>
      <div style='width: 155px; margin-top: -20px;'><img style='width: 100%' src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png' alt='' /></div>
    </template>
    <a-card :bordered='false'>

      <!-- 操作区 -->
      <div class='table-operator'>
        <a-button type='primary' icon='plus' @click='handleToCreateContract'>新建</a-button>
        <a-popconfirm title='是否要删除这些合约？' @confirm='handleBatchDelete'>
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

        <!-- 类型 -->
        <span slot='type' slot-scope='text'>
          <a-tag :color='text | typeColorFilter'>{{ text | typeFilter }}</a-tag>
        </span>

        <!-- 描述 -->
        <span slot='link' slot-scope='text, record'>
          <a href='#' @click='handleToEditContract(record.id)'>{{ text }}</a>
        </span>

        <!-- ellipsis -->
        <span slot='ellipsis' slot-scope='text'>
          <ellipsis :length='40' tooltip>{{ text }}</ellipsis>
        </span>

        <!-- w_def -->
        <span slot='w_def' slot-scope='text'>{{ text || '-' }}</span>

      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { deleting_contracts, fetching_contracts } from '@/api/contract'
import notification from 'ant-design-vue/lib/notification'

// 表定义
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '合约名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'link' }
  },
  {
    title: '合约类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '转分保公司',
    dataIndex: 'companyName',
    scopedSlots: { customRender: 'w_def' }
  },
  {
    title: '生效日期',
    dataIndex: 'startDate',
    scopedSlots: { customRender: 'w_def' }
  },
  {
    title: '终止日期',
    dataIndex: 'endDate',
    scopedSlots: { customRender: 'w_def' }
  }
]

// 状态定义
const typeMap = {
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
  name: 'ContractList',
  components: {
    STable,
    Ellipsis
  },
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return fetching_contracts(requestParameters)
          .then(res => {
            console.debug('contract list', res)
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
                message: '获取合约列表失败',
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
  methods: {

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    handleToCreateContract() {
      this.$router.push({ name: 'ContractEdit', query: { id: '0' } })
    },

    handleToEditContract(id) {
      this.$router.push({ name: 'ContractEdit', query: { id: id } })
    },

    handleBatchDelete() {
      deleting_contracts(this.selectedRowKeys).then(res => {
        console.debug('batch delete contracts', res)
        if (res.code === 0) {
          this.$message.success('合约信息删除成功')
          this.$refs.table.refresh()
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          notification.error({
            message: '删除合约信息失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  }
}
</script>
