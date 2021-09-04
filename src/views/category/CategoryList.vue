<template>
  <page-header-wrapper title='险别管理'>

    <!-- 页面内容 -->
    <a-card :bordered='false'>

      <!-- 操作区 -->
      <div class='table-operator'>
        <a-button type='primary' icon='plus' @click='handleToCreate'>新建</a-button>
        <a-popconfirm title='是否要删除这些险别？' @confirm='handleBatchDelete'>
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
        :showPagination='false'>

        <!-- # -->
        <span slot='serial' slot-scope='text, record, index'>{{ index + 1 }}</span>

        <!-- link -->
        <span slot='link' slot-scope='text, record'>
          <a href='#' @click='handleToEdit(record)'>{{ text }}</a>
        </span>

        <!-- ellipsis -->
        <span slot='ellipsis' slot-scope='text'>
          <ellipsis :length='40' tooltip>{{ text }}</ellipsis>
        </span>

      </s-table>

      <a-modal v-model='visible' :title='form.id ? "更新险别" : "新增险别"' @ok='handleOk'>
        <a-form-model
          ref='form'
          layout='vertical'
          :model='form'
          :rules='rules'
        >
          <a-form-model-item label='险别名称' prop='name'>
            <a-input v-model='form.name' placeholder='请输入险别名称' />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { fetching_categories, saving_category, deleting_categories } from '@/api/category'
import notification from 'ant-design-vue/lib/notification'

// 表定义
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '险别',
    dataIndex: 'name',
    scopedSlots: { customRender: 'link' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  }
]

export default {
  name: 'CategoryList',
  components: {
    STable,
    Ellipsis
  },
  data() {
    this.columns = columns
    return {
      visible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入险别名称', trigger: 'blur' }
        ]
      },
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.debug('category list paramters', requestParameters)
        return fetching_categories().then(res => {
          console.debug('category list', res)
          if (res.code === 0 && res.result) {
            return {
              data: res.result
            }
          } else {
            notification.error({
              message: '获取险别列表失败',
              description: `【错误代码】${res.code}，【错误消息】${res.message}`
            })
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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

    handleToCreate() {
      this.form = {
        name: ''
      }
      this.visible = true
      this.$nextTick(() => {
        if (this.$refs.form)
          this.$refs.form.resetFields()
      })
    },

    handleToEdit(category) {
      this.visible = true
      this.$nextTick(() => {
        if (this.$refs.form)
          this.$refs.form.resetFields()
        const { id, name } = category
        this.form = {
          id: id,
          name: name
        }
      })
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          return saving_category(this.form).then(res => {
            console.debug('saved category', res)
            if (res.code === 0 && res.result) {
              this.$refs.table.refresh()
              this.$message.success(this.form.id ? '险别更新成功' : '新增险别成功')
            } else {
              notification.error({
                message: '新增险别失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
            this.visible = false
          })
        } else
          return false
      })
    },

    handleBatchDelete() {
      deleting_categories(this.selectedRowKeys).then(res => {
        console.debug('batch delete categories', res)
        if (res.code === 0) {
          this.$message.success('险别删除成功')
          this.$refs.table.refresh()
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          notification.error({
            message: '删除险别失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  }
}
</script>
