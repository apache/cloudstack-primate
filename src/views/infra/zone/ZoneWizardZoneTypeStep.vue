<template>
  <div>
    <a-form class="form-content" :form="form" @submit="handleSubmit">
      <span class="ant-form-text" style="text-align: justify; padding-bottom: 16px; padding-left:8px;">
        {{ zoneType !== null ? zoneDescription[zoneType] : 'Please select zone type below.' }}
      </span>
      <a-form-item v-bind="formItemLayout" label="Select" has-feedback>
        <a-select
          v-decorator="[
            'zoneType',
            { rules: [{ required: true, message: 'Please select zone type', initialValue: zoneType }] },
          ]"
          placeholder="Please select zone type"
        >
          <a-select-option value="Basic">
            Basic
          </a-select-option>
          <a-select-option value="Advanced">
            Advanced
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-bind="formItemLayout" label="Security Groups" v-if="isAdvancedZone">
        <a-switch
          v-decorator="['securityGroupsEnabled', { valuePropName: 'checked' }]"
          :value="securityGroupsEnabled"
        />
      </a-form-item>
    </a-form>
    <div class="form-action">
      <a-button type="primary" @click="handleSubmit">
        Next
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prefillContent: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    },
    zoneDescription: {
      'Basic': 'Basic zone provides a single network where each VM instance is assigned an IP directly from the network. Guest isolation can be provided through layer-3 means such as security groups (IP address source filtering).',
      'Advanced': 'Advanced zone is for more sophisticated network topologies. This network model provides the most flexibility in defining guest networks and providing custom network offerings such as firewall, VPN, or load balancer support.'
    }
  }),
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {
        this.$emit('fieldsChanged', changedFields)
      }
    })
  },
  mounted () {
    this.form.setFieldsValue({
      'zoneType': this.zoneType,
      'securityGroupsEnabled': this.securityGroupsEnabled
    })
  },
  computed: {
    isAdvancedZone () {
      return this.zoneType === 'Advanced'
    },
    zoneType () {
      return this.prefillContent.zoneType ? this.prefillContent.zoneType.value : null
    },
    securityGroupsEnabled () {
      return this.isAdvancedZone && (this.prefillContent.securityGroupsEnabled ? this.prefillContent.securityGroupsEnabled.value : false)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('nextPressed')
        }
      })
    }
  }
}
</script>
<style scoped>
  .form-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: 'center';
    padding: 8px;
    padding-top: 16px;
    margin-top: 8px;
  }

  .form-action {
    margin-top: 16px;
  }
</style>
