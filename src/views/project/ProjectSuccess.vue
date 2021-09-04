<template>
  <a-card :bordered='false'>
    <a-result
      status='success'
      :title='result.title'
      :sub-title='isUpdate ?
      `项目 「${project.name}」（编号：${project.id}）的信息已经被更新` :
      `要约 「${project.name}」（编号：${project.id}）保存成功`'
    >
      <template #extra>
        <a-button type='primary' @click='handleBackToList'>返回列表</a-button>
        <a-button style='margin-left: 8px' @click='handleToProjectDetail(project.id)'>查看信息</a-button>
        <a-button style='margin-left: 8px' @click='handleToCreateProject'>录入要约</a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'ProjectSuccess',
  mixins: [baseMixin],
  data() {
    return {
      isUpdate: false,
      project: {
        id: '-',
        name: '-'
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
    this.isUpdate = this.$route.params.isUpdate === 'UPDATE'
    this.project = this.$route.params.project
  },
  methods: {
    handleBackToList() {
      this.$router.push({ name: 'ProjectList' })
    },
    handleToProjectDetail(id) {
      this.$router.push({ name: 'ProjectDetail', query: { id: id } })
    },
    handleToCreateProject() {
      this.$router.push({ name: 'ProjectEdit', query: { id: '0' } })
    }
  }
}
</script>
