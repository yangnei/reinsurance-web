<template>
  <div class='account-settings-info-view'>

    <a-row :gutter='16'>
      <!-- 左侧区域 -->
      <a-col :md='24' :lg='16'>

        <!-- 基本信息表单 -->
        <a-form-model
          ref='basicForm'
          layout='vertical'
          :model='form'
          :rules='rules'
        >
          <!-- 昵称 -->
          <a-form-model-item :label="$t('account.settings.basic.nickname')" prop='displayName'>
            <a-input v-model='form.displayName' :placeholder="$t('account.settings.basic.nickname-message')" />
          </a-form-model-item>

          <!-- 公司 -->
          <a-form-model-item label='公司' prop='companyId'>
            <a-select placeholder='请选择' v-model='form.companyId'>
              <a-select-option v-for='(insurance, index) in companies' :value='insurance.id' :key='insurance.id'>{{ insurance.name }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- 部门 -->
          <a-form-model-item label='部门' prop='department'>
            <a-input v-model='form.department' placeholder='请输入您所在部门' />
          </a-form-model-item>

          <!-- 职位 -->
          <a-form-model-item label='职位' prop='position'>
            <a-input v-model='form.position' placeholder='请输入您的职位' />
          </a-form-model-item>

          <!-- BUTTONs -->
          <a-form-model-item>
            <a-button type='primary' @click='updateUser'>{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-model-item>
        </a-form-model>

      </a-col>

      <!-- 右侧区域 -->
      <a-col :md='24' :lg='8' :style="{ minHeight: '180px' }">

        <!-- 用户头像及更新按钮 -->
        <div class='ant-upload-preview'>
          <a-upload name='file' :beforeUpload='beforeUpload' :showUploadList='false'>
            <a-icon type='cloud-upload-o' class='upload-icon' />
            <div class='mask'>
              <a-icon type='plus' />
            </div>
            <img :src='option.img' alt='用户头像' />
          </a-upload>
        </div>
      </a-col>
    </a-row>

    <!-- 上传用户头像对话框 -->
    <avatar-modal ref='modal' @ok='setavatar' />

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import notification from 'ant-design-vue/lib/notification'
import { updating_user } from '@/api/user'
import { fetching_companies } from '@/api/company'

export default {
  components: {
    AvatarModal
  },
  data() {
    return {
      loading: false,
      form: {
        id: 0,
        displayName: '',
        companyId: '',
        department: '',
        position: ''
      },
      rules: {
        displayName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ]
      },
      option: {
        img: '/avatar2.jpg',
        file: null,
        uploaded: false
      },
      companies: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.loadCompanies()
    console.debug('user info', this.userInfo)
    const { id, name, position, department, companyId, avatar } = this.userInfo
    this.form.id = id || ''
    this.form.displayName = name || ''
    this.form.companyId = companyId || ''
    this.form.department = department || ''
    this.form.position = position || ''
    this.option.img = avatar ? `/api/file/avatar/${avatar}` : '/avatar2.jpg'
  },
  methods: {
    setavatar(url) {
      this.option.img = url
    },
    beforeUpload(file) {
      this.option.file = file
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.option.img = reader.result
        this.option.uploaded = true
      }

      return false
    },
    updateUser() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          const formData = new FormData()
          formData.append('id', this.form.id)
          formData.append('displayName', this.form.displayName)
          formData.append('companyId', this.form.companyId)
          formData.append('department', this.form.department)
          formData.append('position', this.form.position)
          if (this.option.uploaded)
            formData.append('file', this.option.file)
          updating_user(formData).then(res => {
            console.debug('update user', res)
            if (res.code === 0) {
              this.$store.dispatch('GetInfo').then(userInfo => {
                console.debug('userInfo', userInfo)
                this.$message.info('用户更新成功')
              })
            } else {
              notification.error({
                message: '用户信息更新失败',
                description: `【错误代码】${res.code}，【错误消息】${res.message}`
              })
            }
          })
        } else {
          return false
        }
      })
    },
    loadCompanies() {
      return fetching_companies().then(res => {
        console.debug('company list', res)
        if (res.code === 0 && res.result && res.result.length > 0) {
          this.companies = res.result.map(company => {
            return {
              id: company.id,
              name: company.fullNameCn
            }
          })
        } else {
          notification.error({
            message: '获取保险公司列表失败',
            description: `【错误代码】${res.code}，【错误消息】${res.message}`
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
