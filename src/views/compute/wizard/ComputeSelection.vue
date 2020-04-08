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
  <a-col>
    <a-row>
      <a-col>
        <a-form-item :label="this.$t('cpunumber')">
          <a-row>
            <a-col :span="10" v-show="isConstrained">
              <a-slider
                :min="minCpu"
                :max="maxCpu"
                v-model="cpuNumberInputValue"
                @change="($event) => updateComputeCpuNumber($event)"
              />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model="cpuNumberInputValue"
                :formatter="value => `${value}`"
                @change="($event) => updateComputeCpuNumber($event)"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col v-show="!isConstrained">
        <a-form-item :label="this.$t('cpuspeed')">
          <a-input-number
            v-model="cpuSpeedInputValue"
            @change="($event) => updateComputeCpuSpeed($event)"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-form-item :label="this.$t('memory')">
        <a-row>
          <a-col :span="10" v-show="isConstrained">
            <a-slider
              :min="minMemory"
              :max="maxMemory"
              v-model="memoryInputValue"
              @change="($event) => updateComputeMemory($event)"
            />
          </a-col>
          <a-col :span="4">
            <a-input-number
              v-model="memoryInputValue"
              :formatter="value => `${value}`"
              @change="($event) => updateComputeMemory($event)"
            />
          </a-col>
        </a-row>
      </a-form-item>
    </a-row>
  </a-col>
</template>

<script>
export default {
  name: 'ComputeSelection',
  props: {
    isConstrained: {
      type: Boolean,
      default: true
    },
    minCpu: {
      type: Number,
      default: 1
    },
    maxCpu: {
      type: Number,
      default: 2
    },
    minMemory: {
      type: Number,
      default: 1
    },
    maxMemory: {
      type: Number,
      default: 256
    },
    cpunumberInputDecorator: {
      type: String,
      default: ''
    },
    cpuspeedInputDecorator: {
      type: String,
      default: ''
    },
    memoryInputDecorator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cpuNumberInputValue: 1,
      cpuSpeedInputValue: 1,
      memoryInputValue: 1
    }
  },
  methods: {
    updateComputeCpuNumber (value) {
      console.log('hfhkjdhfskj')
      this.$emit('update-compute-cpunumber', this.cpunumberInputDecorator, value)
    },
    updateComputeCpuSpeed (value) {
      this.$emit('update-compute-cpuspeed', this.cpuspeedInputDecorator, value)
    },
    updateComputeMemory (value) {
      this.$emit('update-compute-memory', this.memoryInputDecorator, value)
    }
  }
}
</script>

<style scoped>

</style>
