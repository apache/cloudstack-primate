<template>
  <a-list size="large" class="list" :loading="loading">
    <a-list-item :key="index" v-for="(item, index) in items" class="item">
      <a-list-item-meta>
        <span slot="title" style="word-break: break-all">{{ item.name }}</span>
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
          <a-icon slot="addonAfter" type="close" style="cursor:pointer; color: red;" @click="editableValueKey = null"/>
        </a-input>
        <span v-else class="value">
          {{ item.value }}
        </span>
      </div>

      <div slot="actions" class="action">
        <a-button
          shape="circle"
          v-if="editableValueKey === index"
          type="primary"
          icon="save"
          @click="updateData(item)"></a-button>
        <a-button
          shape="circle"
          v-else
          icon="edit"
          @click="setEditableSetting(item, index)" />
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
      routeIdName: '',
      editableValueKey: null,
      editableValue: ''
    }
  },
  beforeMount () {
    switch (this.$route.meta.name) {
      case 'account':
        this.routeIdName = 'accountid'
        break
      case 'domain':
        this.routeIdName = 'domainid'
        break
      case 'zone':
        this.routeIdName = 'zoneid'
        break
      case 'cluster':
        this.routeIdName = 'clusterid'
        break
      case 'storagepool':
        this.routeIdName = 'storageid'
        break
      case 'imagestore':
        this.routeIdName = 'imagestoreuuid'
        break
      default:
        this.routeIdName = ''
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    resource: newItem => {
      if (!newItem.id) return
      this.fetchData()
    }
  },
  methods: {
    fetchData (callback) {
      api('listConfigurations', {
        [this.routeIdName]: this.resource.id,
        listAll: true
      }).then(response => {
        this.items = response.listconfigurationsresponse.configuration
      }).catch(error => {
        console.error(error)
        this.$message.error('There was an error loading these settings.')
      }).finally(() => {
        if (!callback) return
        callback()
      })
    },
    updateData (item) {
      api('updateConfiguration', {
        [this.routeIdName]: this.resource.id,
        name: item.name,
        value: this.editableValue
      }).then(() => {
        this.$message.success('Setting Updated: ' + item.name)
        this.$notification.success({
          message: 'Setting Updated',
          description: `${item.name} successfully updated to ${this.editableValue}`
        })
      }).catch(error => {
        console.error(error)
        this.$message.error('There was an error saving this setting.')
        this.$notification.error({
          message: 'Error',
          description: 'There was an error saving this setting. Please try again later.'
        })
      }).finally(() => {
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
    max-height: 700px;
    overflow: scroll;
  }
  .editable-value {

    @media (min-width: 760px) {
      text-align: right;
      margin-left: 40px;
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
      font-weight: bold;
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
