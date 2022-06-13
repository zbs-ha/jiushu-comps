<template>
  <div class="r-dv-panel h-full">
    <data-visual-panel
      :on-fetch-panel="fetchPanel"
      :on-save-panel="savePanel"
      :on-fetch-source-list="fetchSourceList"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// // 直接引入组件
// import DataVisualPanel from '@/components/DataVisualPanel/DataVisualPanel.vue'

// 引入打包生成的组件
import { DataVisualPanel } from 'jiushu-comps'
import 'jiushu-comps/dist/jiushu-comps.css'

import { DvDataSource, PanelData } from '@/models/DataVisualPanel'

function delayMs(timeMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeMs)
  })
}

export default Vue.extend({
  name: 'dv-panel',
  components: { DataVisualPanel },

  data() {
    return {}
  },

  methods: {
    async fetchSourceList(): Promise<DvDataSource[]> {
      await delayMs(1000)

      const list = new Array(20).fill({})
        .map((v, i) => ({
          name: `aaa${i}`,
          age: i,
          score: i * 10,
          info: {
            sss1: Math.random(),
            sss2: Math.random(),
            xxx: {
              sss3: Math.random(),
            },
          },
        }))

      return [
        {
          name: 'api',
          label: '数据接口',
          list,
        },
        {
          name: 'model',
          label: '数据模型',
          list,
        },
      ]
    },

    // 模拟获取 {panel: PanelData}
    async fetchPanel(): Promise<{ panel?: PanelData }> {
      await delayMs(1000)

      const data = localStorage.getItem('key-panel-data')
      if (!data) {
        return {}
      }

      return JSON.parse(data)
    },

    // 模拟保存 {panel: PanelData}
    async savePanel(data: { panel: PanelData }) {
      await delayMs(1000)

      localStorage.setItem('key-panel-data', JSON.stringify(data))
    },
  },
})
</script>

<style scoped lang="scss">
.r-dv-panel {

}
</style>
