<template>
  <page-header-wrapper
    content='管理员使用用户管理功能管理所有用户。包括，创建一个新用户；当用户忘记密码时，修改用户密码以及删除废弃用户。'>
    <template v-slot:extraContent>
      <div style='width: 155px; margin-top: -20px;'><img style='width: 100%' src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png' alt='' /></div>
    </template>
    <a-card :bordered='false'>

      <!-- 操作区 -->
      <div class='table-operator'>
        <a-button type='primary' icon='plus' @click='creating_user'>创建用户</a-button>
      </div>

      <!-- 数据表 -->
      <s-table
        ref='table'
        size='default'
        rowKey='id'
        :columns='columns'
        :data='load_users'
        showPagination='auto'
      >
        <!-- # -->
        <span slot='serial' slot-scope='text, record, index'>{{ index + 1 }}</span>

        <!-- 描述 -->
        <span slot='link' slot-scope='text, record'>
          <a href='#' @click='modifying_user(record.id)'>{{ text }}</a>
        </span>

        <!-- ellipsis -->
        <span slot='ellipsis' slot-scope='text'>
          <ellipsis :length='40' tooltip>{{ text }}</ellipsis>
        </span>

        <!-- w_def -->
        <span slot='w_def' slot-scope='text'>{{ text || '-' }}</span>

        <!-- 操作 -->
        <span slot='action' slot-scope='text, record'>
          <template>
            <a @click='modifying_user(record.id)'>编辑</a>
            <a-divider type='vertical' />
            <a-popconfirm :title='`是否要删除用户「${record.displayName}」？`' @confirm='deleting_user(record.id)'>
              <a style='color: #ed5565;'>删除</a>
            </a-popconfirm>
          </template>
        </span>

      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import notification from 'ant-design-vue/lib/notification'
import { deleting_user, fetching_users } from '@/api/user'

// 表定义
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '用户账号',
    dataIndex: 'username',
    scopedSlots: { customRender: 'w_def' }
  },
  {
    title: '用户名称',
    dataIndex: 'displayName',
    scopedSlots: { customRender: 'w_def' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '230px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      columns: columns,
      load_users: pagination => {
        return fetching_users(pagination).then(res => {
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
              message: '获取用户列表失败',
              description: `【错误代码】${res.code}，【错误消息】${res.message}`
            })
          }
        })
      }
    }
  },
  methods: {

    /**
     * 创建一个用户
     */
    creating_user() {
      this.$router.push({ name: 'UserEdit', query: { id: '0' } })
    },

    /**
     * 修改用户（登录账号、昵称、密码 ……）
     *
     * @param id 用户ID
     */
    modifying_user(id) {
      this.$router.push({ name: 'UserEdit', query: { id: id } })
    },

    /**
     * 删除用户
     *
     * @param id 用户ID
     */
    deleting_user(id) {
      deleting_user(id).then(res => {
        if (res.code === 0) {
          this.$message.success('用户删除成功')
          this.$refs.table.refresh()
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          notification.error({
            message: '删除用户失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  }
}
</script>
