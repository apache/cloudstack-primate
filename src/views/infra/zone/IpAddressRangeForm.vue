// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

<template>
  <div>
    <a-card
      class="ant-form-text"
      style="text-align: justify; margin: 10px 0; padding: 24px;"
      v-html="description">
    </a-card>
    <a-table
      bordered
      :dataSource="ipRanges"
      :columns="columns"
      :pagination="false"
      style="margin-bottom: 24px;"
      :scroll="{ y: 220 }">
      <template slot="actions" slot-scope="text, record">
        <a-popconfirm
          title="Delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a-icon type="delete" href="javascript;;" />
        </a-popconfirm>
      </template>
      <template slot="footer">
        <a-form
          layout="inline"
          :form="form"
          @submit="handleAddRange">
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-input
              v-decorator="[ 'gateway', {
                rules: [{ required: true, message: 'Please enter Gateway' }]
              }]"
              placeholder="Gateway"
            />
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-input
              v-decorator="[ 'netmask', {
                rules: [{ required: true, message: 'Please enter Netmask' }]
              }]"
              placeholder="Netmask"
            />
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-input
              v-decorator="[ 'vlan', { rules: [{ required: false }] }]"
              placeholder="VLAN/VNI"
            />
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-input
              v-decorator="[ 'startIp', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter Start IP'
                  },
                  {
                    validator: validateIPAddress,
                    ipV4: true,
                    message: 'Please enter a valid IP v4 address.'
                  }
                ]
              }]"
              placeholder="Start IP"
            />
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-input
              v-decorator="[ 'endIp', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter End IP'
                  },
                  {
                    validator: validateIPAddress,
                    ipV4: true,
                    message: 'Please enter a valid IP v4 address.'
                  }]
              }]"
              placeholder="End IP"
            />
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '14%' }">
            <a-button type="primary" html-type="submit"> Add </a-button>
          </a-form-item>
        </a-form>
      </template>
    </a-table>
    <div class="form-action">
      <a-button
        v-if="!isFixError"
        class="button-prev"
        @click="handleBack">
        Back
      </a-button>
      <a-button class="button-next" type="primary" @click="handleSubmit">
        Next
      </a-button>
    </div>
    <a-modal
      :visible="showError"
      title="Error!"
      @ok="() => { showError = false }"
      @cancel="() => { showError = false }"
      centered
    >
      <span>Please add at least 1 IP Range</span>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    traffic: {
      type: String,
      default: '0'
    },
    description: {
      type: String,
      default: 'Creating IP Ranges'
    },
    prefillContent: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isFixError: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formItemLayout: {
        wrapperCol: { span: 0 }
      },
      ipRanges: [],
      columns: [
        {
          title: 'Gateway',
          dataIndex: 'gateway',
          width: 150
        },
        {
          title: 'Netmask',
          dataIndex: 'netmask',
          width: 150
        },
        {
          title: 'VLAN/VNI',
          dataIndex: 'vlan',
          width: 120
        },
        {
          title: 'Start IP',
          dataIndex: 'startIp',
          width: 130
        },
        {
          title: 'End IP',
          dataIndex: 'endIp',
          width: 130
        },
        {
          title: '',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
          width: 50
        }
      ],
      showError: false,
      ipV4Regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i,
      ipV6Regex: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
    }
  },
  mounted () {
    var prefilledIpRangesKey = this.traffic + '-ipranges'
    if (this.prefillContent[prefilledIpRangesKey]) {
      this.ipRanges = this.prefillContent[prefilledIpRangesKey]
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    isValidRange () {
      return this.ipRanges && this.ipRanges.length > 0
    },
    handleAddRange (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.ipRanges.push({
            key: this.ipRanges.length.toString(),
            gateway: values.gateway,
            netmask: values.netmask,
            vlan: values.vlan,
            startIp: values.startIp,
            endIp: values.endIp
          })
          this.form.resetFields()
        }
      })
      this.emitIpRanges()
    },
    isValidSetup () {
      return this.ipRanges && this.ipRanges.length > 0
    },
    handleSubmit (e) {
      if (this.isValidSetup()) {
        if (this.isFixError) {
          this.$emit('submitLaunchZone')
          return
        }

        this.$emit('nextPressed', this.ipRanges)
      } else {
        this.showError = true
      }
    },
    handleBack (e) {
      this.$emit('backPressed')
    },
    checkIpFormat () {
      // TODO: Implement and move up in components
      return true
    },
    onDelete (key) {
      const ipRanges = [...this.ipRanges]
      this.ipRanges = ipRanges.filter(item => item.key !== key)
      this.emitIpRanges()
    },
    emitIpRanges () {
      var trafficRanges = {}
      trafficRanges[this.traffic + '-ipranges'] = this.ipRanges
      this.$emit('fieldsChanged', trafficRanges)
    },
    validateIPAddress (rule, value, callback) {
      if (!value || value === '') {
        callback()
      } else if (rule.ipV4 && !this.ipV4Regex.test(value)) {
        callback(rule.message)
      } else if (rule.ipV6 && !this.ipV6Regex.test(value)) {
        callback(rule.message)
      } else {
        callback()
      }
    }
  }
}
</script>
