<template>
  <div>
    <a-row :gutter="12">
      <a-col :md="24" :lg="24">
        <a-table
          size="small"
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="record => record.id"
          :pagination="false"
          :scroll="{ x: '100%' }"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'SSLCertificate',
  data () {
    return {
      columns: [],
      dataSource: [],
      selectedRowKeys: [],
      page: 1,
      pageSize: 20
    }
  },
  props: {
    resource: {
      type: Object,
      require: true
    }
  },
  created () {
    this.columns = [
      {
        title: this.$t('name'),
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: this.$t('certificateid'),
        dataIndex: 'certificateid',
        scopedSlots: { customRender: 'certificateid' }
      },
      {
        title: this.$t('quickview'),
        dataIndex: 'quickview',
        scopedSlots: { customRender: 'quickview' }
      }
    ]
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const apiName = 'listSslCerts'
      const params = {}

      // set parameter for fetching data
      params.listAll = true
      params.page = this.page
      params.pageSize = this.pageSize
      params.accountid = this.resource.id

      api(apiName, params).then(json => {
        const listSslResponse = json.listsslcertsresponse

        // check exists json response
        if (!listSslResponse && Object.keys(listSslResponse).length === 0) {
          this.dataSource = []
        }
      })
    }
  }
}
</script>

<style scoped>
.resource-button {
  text-align: right;
  padding-bottom: 10px;
}
</style>
