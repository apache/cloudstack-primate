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
  <a-form-item>
    <div class="form-item-scroll">
      <a-radio-group
        v-for="(os, osIndex) in osList"
        :key="osIndex"
        class="radio-group"
        v-model="value"
        @change="($event) => updateSelectionTemplateIso($event.target.value)"
      >
        <a-radio
          class="radio-group__radio"
          :value="os.id"
        >
          {{ os.displaytext }}&nbsp;
          <a-tag
            :visible="os.ispublic && !os.isfeatured"
            color="blue"
          >{{ $t('isPublic') }}</a-tag>
          <a-tag
            :visible="os.isfeatured"
            color="green"
          >{{ $t('isFeatured') }}</a-tag>
          <a-tag
            :visible="isSelf(os)"
            color="orange"
          >{{ $t('isSelf') }}</a-tag>
          <a-tag
            :visible="isShared(os)"
            color="cyan"
          >{{ $t('isShared') }}</a-tag>
        </a-radio>
      </a-radio-group>
    </div>
  </a-form-item>
</template>

<script>
import store from '@/store'

export default {
  name: 'TemplateIsoRadioGroup',
  props: {
    osList: {
      type: Array,
      default: () => []
    },
    inputDecorator: {
      type: String,
      default: ''
    },
    selected: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: ''
    }
  },
  created () {
    if (this.inputDecorator === 'templateid') {
      this.value = this.osList[0].id
      this.$emit('emit-update-template-iso', this.inputDecorator, this.value)
    }
  },
  watch: {
    selected (newValue, oldValue) {
      if (newValue !== this.inputDecorator) {
        this.value = ''
      }
    },
    osList (newData, oldData) {
      if (newData && newData.length > 0) {
        this.osList = newData
        this.value = this.osList[0].id
        this.$emit('emit-update-template-iso', this.inputDecorator, this.value)
      }
    }
  },
  methods: {
    isShared (item) {
      return !item.ispublic && (item.account !== store.getters.userInfo.account)
    },
    isSelf (item) {
      return !item.ispublic && (item.account === store.getters.userInfo.account)
    },
    updateSelectionTemplateIso (id) {
      this.$emit('emit-update-template-iso', this.inputDecorator, id)
    }
  }
}
</script>

<style lang="less" scoped>
  .radio-group {
    display: block;

    &__radio {
      margin: 0.5rem 0;
    }
  }

  .ant-tag {
    margin-left: 0.4rem;
  }

  .form-item-scroll {
    max-height: 19vh;
    overflow-y: auto;
  }
</style>
