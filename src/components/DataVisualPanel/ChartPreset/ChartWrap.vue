<template>
  <div class="r-ChartWrap h-full relative">
    <div class="h-full p-4 flex flex-col">
      <div class="flex-none pb-3 leading-none flex items-center justify-between">
        <span class="text-black text-[17px]">{{ chart.name || '图表' }}</span>
        <a-dropdown :trigger="['click']">
          <a-button icon="ellipsis" size="small"/>
          <a-menu slot="overlay" @click="chartOperate">
            <a-menu-item key="refresh" v-if="chart.dataCfg">刷新</a-menu-item>
            <a-menu-item key="delete">删除</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>

      <div
        v-if="!chart.dataCfg"
        class="flex-1 h-full flex justify-center items-center"
      >
        EMPTY
      </div>
      <chart-table
        v-else-if="chart.dataCfg.type === 'chart-table'"
        :chart-data="chartData"
        :chart="chart"
        class="flex-1"
      />
      <chart-line
        v-else-if="chart.dataCfg.type === 'chart-line'"
        :chart-data="chartData"
        :chart="chart"
        class="flex-1"
      />
      <chart-bar
        v-else-if="chart.dataCfg.type === 'chart-bar'"
        :chart-data="chartData"
        :chart="chart"
        class="flex-1"
      />
      <chart-pie
        v-else-if="chart.dataCfg.type === 'chart-pie'"
        :chart-data="chartData"
        :chart="chart"
        class="flex-1"
      />
      <div
        v-else
        class="flex-1"
      >
        Not Support Chart: {{ chart.dataCfg.type }}
      </div>
    </div>

    <div class="absolute inset-0 flex justify-center items-center" v-if="loading">
      <a-spin class="z-10"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  DVChartData,
  DVChartDataCfg,
  DvCtx,
  PanelChart,
} from '@/models/DataVisualPanel'
import Vue, { PropType } from 'vue'
import { findIndex } from 'lodash-es'
import ChartTable from './ChartTable.vue'
import ChartLine from './ChartLine.vue'
import ChartBar from './ChartBar.vue'
import ChartPie from './ChartPie.vue'

type DATA = {
  dvCtx: DvCtx
  chartData: DVChartData
  loading: boolean
}

export default Vue.extend({
  name: 'ChartWrap',
  components: {
    ChartPie,
    ChartBar,
    ChartLine,
    ChartTable,
  },

  inject: ['dvCtx'],

  props: {
    chart: {
      type: Object as PropType<PanelChart>,
      required: true,
    },
  },

  data(): DATA {
    return {
      // @ts-ignore
      dvCtx: this.dvCtx as DvCtx,

      chartData: [],
      loading: false,
    }
  },

  methods: {
    // 删除指定的图表
    deleteChartById(ident: string) {
      const idx = findIndex(this.dvCtx.panelCharts, { ident })
      this.dvCtx.panelCharts.splice(idx, 1)
    },

    chartOperate(item: { key: string }) {
      if (item.key === 'refresh') {
        this.refreshChartData(this.chart.dataCfg!, true)
      } else if (item.key === 'delete') {
        this.deleteChartById(this.chart.ident)
      }
    },

    async refreshChartData(dataCfg: DVChartDataCfg, refresh: boolean) {
      try {
        this.loading = true
        this.chartData = await this.dvCtx.genChartData(dataCfg, refresh)
      } finally {
        this.loading = false
      }
    },
  },

  created() {
    this.refreshChartData(this.chart.dataCfg, false)
  },
})
</script>

<style scoped lang="scss">
.r-ChartWrap {

}
</style>
