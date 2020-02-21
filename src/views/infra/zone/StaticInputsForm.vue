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
      style="text-align: justify; margin: 10px 0;"
      v-if="description && description.length > 0">
      {{ description }}
    </a-card>
    <a-form
      class="form-content"
      :form="form"
      @submit="handleSubmit">
      <a-form-item
        v-for="(field, index) in this.fields"
        :key="index"
        :label="field.title"
        v-bind="formItemLayout"
        has-feedback>
        <a-input
          v-decorator="[field.key, {
            rules: [
              {
                required: field.required,
                message: field.placeHolder,
                initialValue: getPrefilled(field.key)
              },
              {
                validator: validateIPAddress,
                ipV4: field.ipV4,
                ipV6: field.ipV6,
                message: field.message
              }
            ]
          }]"
        />
      </a-form-item>
    </a-form>
    <div class="form-action">
      <a-button class="button-prev" @click="handleBack">
        Back
      </a-button>
      <a-button class="button-next" type="primary" @click="handleSubmit">
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
    },
    fields: {
      type: Array,
      default: function () {
        return []
      }
    },
    description: {
      type: String,
      default: 'Creating IP Ranges'
    }
  },
  created () {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {
        this.$emit('fieldsChanged', changedFields)
      }
    })
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    },
    ipV4Regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i,
    ipV6Regex: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
  }),
  mounted () {
    this.fields.forEach(field => {
      var fieldVal = {}
      fieldVal[field.key] = this.getPrefilled(field.key)
      this.form.setFieldsValue(fieldVal)
    })
  },
  methods: {
    getPrefilled (key) {
      return this.prefillContent[key] ? this.prefillContent[key].value : null
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('nextPressed')
        }
      })
    },
    handleBack (e) {
      this.$emit('backPressed')
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

<style scoped lang="less">
  .form-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: center;
    padding-top: 16px;
    padding-top: 16px;
    margin-top: 8px;

    /deep/.has-error {
      .ant-form-explain {
        text-align: left;
      }
    }

    /deep/.ant-form-item-control {
      text-align: left;
    }
  }

  .form-action {
    margin-top: 16px;
  }
</style>
