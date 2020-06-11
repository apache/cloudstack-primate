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
    <p v-html="$t('message.change.offering.confirm')"></p>

    <a-form class="form">
      <div v-if="loading" class="loading">
        <a-icon type="loading" style="color: #1890ff;"></a-icon>
      </div>

      <div class="form__item">
        <p class="form__label">
          <span class="required">*</span>
          {{ $t('label.menu.service.offerings') }}
        </p>
        <a-select v-model="selectedOffering" :defaultValue="selectedOffering">
          <a-select-option
            v-for="offering in offerings"
            :key="offering.name"
            :value="offering.id"
          >{{ offering.name }}</a-select-option>
        </a-select>
      </div>

      <template v-if="isOfferingCustomized()">
        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('label.cpuspeed') }}
          </p>
          <a-input-number v-model="cpuSpeed"></a-input-number>
          <span v-if="validationError" class="required">{{ $t('label.required') }}</span>
        </div>

        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('label.cpunumber') }}
          </p>
          <a-input-number v-model="cpuNumber"></a-input-number>
          <span v-if="validationError" class="required">{{ $t('label.required') }}</span>
        </div>

        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('label.memory.mb') }}
          </p>
          <a-input-number v-model="memory"></a-input-number>
          <span v-if="validationError" class="required">{{ $t('label.required') }}</span>
        </div>
      </template>

      <div :span="24" class="action-button">
        <a-button @click="closeAction">{{ this.$t('label.cancel') }}</a-button>
        <a-button :loading="loading" type="primary" @click="handleSubmit">{{ this.$t('label.ok') }}</a-button>
      </div>

    </a-form>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'ChangeServiceOffering',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  inject: ['parentFetchData'],
  data () {
    return {
      offerings: [],
      selectedOffering: '',
      cpuSpeed: '',
      memory: '',
      cpuNumber: '',
      customOfferings: [],
      validationError: false,
      loading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      api('listServiceOfferings', {
        response: 'json',
        listAll: true,
        details: 'min'
      }).then(response => {
        this.offerings = response.listserviceofferingsresponse.serviceoffering
        this.selectedOffering = this.offerings[0].id
        this.loading = false
      })
    },
    isOfferingCustomized () {
      for (var offering of this.offerings) {
        if (offering.id === this.selectedOffering) {
          return offering.iscustomized
        }
      }
    },
    closeAction () {
      this.$emit('close-action')
    },
    handleSubmit () {
      if (this.isOfferingCustomized()) {
        if (!(this.cpuSpeed && this.cpuNumber && this.memory)) {
          this.validationError = true
          return
        }
      }

      var params = {
        id: this.resource.id,
        serviceofferingid: this.selectedOffering,
        response: 'json'
      }
      params['details[0].cpuSpeed'] = this.cpuSpeed
      params['details[0].cpuNumber'] = this.cpuNumber
      params['details[0].memory'] = this.memory

      this.loading = true
      api('changeServiceForVirtualMachine', params).then(response => {
        this.$notification.success({
          message: 'Successfully changed offering'
        })
        this.loading = false
        this.$parent.$parent.close()
        this.parentFetchData()
      }).catch(error => {
        this.$notifyError(error)
        this.$parent.$parent.close()
        this.parentFetchData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;

  &__item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
  }

  &__label {
    display: flex;
    font-weight: bold;
    margin-bottom: 5px;
  }
}

.action-button {
  text-align: right;

  button {
    margin-right: 5px;
  }
}

.required {
  margin-right: 2px;
  color: red;
  font-size: 0.7rem;
}

.loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}
</style>
