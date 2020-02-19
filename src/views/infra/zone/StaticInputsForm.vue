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
    <span class="ant-form-text" style="text-align: justify; padding: 16px;" v-if="description && description.length > 0">
      {{ description }}
    </span>
    <a-form class="form-content" :form="form" @submit="handleSubmit">
      <a-form-item v-for="(field, index) in this.fields" :key="index" :label="field.title" v-bind="formItemLayout">
        <a-input
          v-decorator="[field.key, { rules: [{ required: field.required, message: field.placeHolder, initialValue: getPrefilled(field.key) }] }]"
        />
      </a-form-item>
    </a-form>
    <div class="form-action">
      <a-button @click="handleBack">
        Back
      </a-button>
      <a-button style="margin-left: 8px" type="primary" @click="handleSubmit">
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
    }
  }),
  mounted () {
    this.fields.forEach(field => {
      var fieldVal = {}
      fieldVal[field.key] = this.getPrefilled(field.key)
      console.log('Filling up')
      console.log(fieldVal)
      console.log(this.prefillContent)
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
    }
  }
}
</script>

<style>
  .form-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: 'center';
    padding-top: 16px;
    padding-top: 16px;
    margin-top: 8px;
  }

  .form-action {
    margin-top: 16px;
  }
</style>
