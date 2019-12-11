<template>
<<<<<<< HEAD
  <a-list size="large" class="list" :loading="loading || tabLoading">
    <a-list-item :key="index" v-for="(item, index) in items" class="item">
      <a-list-item-meta>
        <span slot="title" style="word-break: break-all">{{ item.name }}</span>
=======
  <a-list size="large" class="list" :loading="loading">
    <a-list-item :key="index" v-for="(item, index) in items" class="item">
      <a-list-item-meta>
        <span slot="title" style="word-break: break-all"><strong>{{ item.name }}</strong></span>
>>>>>>> rebase with latest master
        <span slot="description" style="word-break: break-all">{{ item.description }}</span>
      </a-list-item-meta>

      <div class="item__content">
        <a-input
          v-if="editableValueKey === index"
          class="editable-value value"
          :defaultValue="item.value"
          v-model="editableValue"
          @keydown.esc="editableValueKey = null"
          @pressEnter="updateData(item)">
        </a-input>
<<<<<<< HEAD
        <span v-else class="value" @click="setEditableSetting(item, index)">
=======
        <span v-else class="value">
>>>>>>> rebase with latest master
          {{ item.value }}
        </span>
      </div>

      <div slot="actions" class="action">
        <a-button
          shape="circle"
          v-if="editableValueKey !== index"
          icon="edit"
          @click="setEditableSetting(item, index)" />
        <a-button
          shape="circle"
          size="default"
          @click="editableValueKey = null"
          v-if="editableValueKey === index" >
          <a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />
        </a-button>
        <a-button
          shape="circle"
          @click="updateData(item)"
          v-if="editableValueKey === index" >
          <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        </a-button>
      </div>
    </a-list-item>
  </a-list>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'SettingsTab',
  props: {
    resource: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      items: [],
      scopeKey: '',
      editableValueKey: null,
<<<<<<< HEAD
      editableValue: '',
      tabLoading: false
=======
      editableValue: ''
>>>>>>> rebase with latest master
    }
  },
  beforeMount () {
    switch (this.$route.meta.name) {
      case 'account':
        this.scopeKey = 'accountid'
        break
      case 'domain':
        this.scopeKey = 'domainid'
        break
      case 'zone':
        this.scopeKey = 'zoneid'
        break
      case 'cluster':
        this.scopeKey = 'clusterid'
        break
      case 'storagepool':
        this.scopeKey = 'storageid'
        break
      case 'imagestore':
        this.scopeKey = 'imagestoreuuid'
        break
      default:
        this.scopeKey = ''
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
<<<<<<< HEAD
    resource: function (newItem, oldItem) {
      if (!newItem.id) return
      this.resource = newItem
=======
    resource: newItem => {
      if (!newItem.id) return
>>>>>>> rebase with latest master
      this.fetchData()
    }
  },
  methods: {
    fetchData (callback) {
<<<<<<< HEAD
      this.tabLoading = true
=======
      this.loading = true
>>>>>>> rebase with latest master
      api('listConfigurations', {
        [this.scopeKey]: this.resource.id,
        listAll: true
      }).then(response => {
        this.items = response.listconfigurationsresponse.configuration
      }).catch(error => {
        console.error(error)
        this.$message.error('There was an error loading these settings.')
      }).finally(() => {
<<<<<<< HEAD
        this.tabLoading = false
=======
        this.loading = false
>>>>>>> rebase with latest master
        if (!callback) return
        callback()
      })
    },
    updateData (item) {
<<<<<<< HEAD
      this.tabLoading = true
=======
      this.loading = true
>>>>>>> rebase with latest master
      api('updateConfiguration', {
        [this.scopeKey]: this.resource.id,
        name: item.name,
        value: this.editableValue
      }).then(() => {
        this.$message.success('Setting ' + item.name + ' updated to ' + this.editableValue)
      }).catch(error => {
        console.error(error)
        this.$message.error('There was an error saving this setting.')
        this.$notification.error({
          message: 'Error',
          description: 'There was an error saving this setting. Please try again later.'
        })
      }).finally(() => {
<<<<<<< HEAD
        this.tabLoading = false
=======
        this.loading = false
>>>>>>> rebase with latest master
        this.fetchData(() => {
          this.editableValueKey = null
        })
      })
    },
    setEditableSetting (item, index) {
      this.editableValueKey = index
      this.editableValue = item.value
    }
  }
}
</script>

<style scoped lang="scss">
  .list {
  }
  .editable-value {

    @media (min-width: 760px) {
      text-align: right;
      margin-left: 40px;
      margin-right: -40px;
    }

  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    @media (min-width: 760px) {
      flex-direction: row;
    }

    &__content {
      width: 100%;
      display: flex;
      word-break: break-all;

      @media (min-width: 760px) {
        width: auto;
      }

    }

  }
  .action {
    margin-top: 20px;
    margin-left: -12px;

    @media (min-width: 480px) {
      margin-left: -24px;
    }

    @media (min-width: 760px) {
      margin-top: 0;
      margin-left: 0;
    }

  }

  .value {
    margin-top: 20px;

    @media (min-width: 760px) {
      margin-top: 0;
    }

  }

</style>
