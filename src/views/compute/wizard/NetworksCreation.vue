<template>
  <div>
    <a-table
      v-if="networkItems.length > 0"
      :columns="columns"
      :dataSource="networkItems"
      :pagination="false"
    >
      <template v-slot:name="text">
        <a-input
          :value="text"
        ></a-input>
      </template>
      <template v-slot:operation>
        <a-popconfirm
          v-if="networkItems.length"
          title="Sure to delete?"
          @confirm="removeItem()"
        >
          <a-button type="link">Delete</a-button>
        </a-popconfirm>
      </template>
      <template v-slot:networkOffering>
        <a-select
          :placeholder="$t('networkOfferingId')"
          :options="networkOfferingOptions"
        ></a-select>
      </template>
      <template v-slot:vpc>
        <a-select
          :placeholder="$t('vpc')"
          :options="vpcOptions"
        ></a-select>
      </template>
    </a-table>

    <div style="text-align: right; margin-top: 1rem;">
      <a-button
        type="primary"
        @click="addNewItem"
      >{{ $t('addAnotherNetwork') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import store from '@/store'
import _ from 'lodash'

/*
 * ToDo: Implement real functionality
 */
export default {
  name: 'NetworkCreation',
  data () {
    return {
      networkItems: [{}],
      columns: [
        {
          dataIndex: 'name',
          title: this.$t('networks'),
          scopedSlots: { customRender: 'name' },
          width: '30%'
        },
        {
          dataIndex: 'offering',
          title: this.$t('networkOfferingId'),
          scopedSlots: { customRender: 'networkOffering' },
          width: '30%'
        },
        {
          dataIndex: 'vpcName',
          title: this.$t('VPC'),
          scopedSlots: { customRender: 'vpc' },
          width: '30%'
        },
        {
          dataIndex: 'action',
          scopedSlots: { customRender: 'operation' },
          width: '10%'
        }
      ],
      networkOfferings: [],
      vpcs: []
    }
  },
  computed: {
    networkOfferingOptions () {
      return this.networkOfferings.map((offering) => {
        return {
          label: offering.name,
          value: offering.id
        }
      })
    },
    vpcOptions () {
      return this.vpcs.map((vpc) => {
        return {
          label: vpc.name,
          value: vpc.id
        }
      })
    }
  },
  created () {
    api('listNetworkOfferings', {
      // ToDo: Add the zoneId
    }).then((response) => {
      this.networkOfferings = _.get(response, 'listnetworkofferingsresponse.networkoffering')
    })
    // ToDo: Remove this redundant api call – see the NetworkSelection component
    api('listVPCs', {
      projectid: store.getters.project.id
    }).then((response) => {
      this.vpcs = _.get(response, 'listvpcsresponse.vpc')
    })
  },
  methods: {
    addNewItem () {
      this.networkItems.push({})
    },
    removeItem () {
      this.networkItems.pop()
    }
  }
}
</script>

<style scoped>

</style>
