<template>
  <div class="r-ChartTable w-full h-full">
    <a-table
      :pagination="false"
      rowKey="id"
      bordered
      size="small"
      :columns="columns"
      :data-source="chartData"
      :scroll="{ y: scrollHeight }"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DVChartDataTable, PanelChart } from '@/models/DataVisualPanel'
import { calcChartHeight } from '../Constants'

export default Vue.extend({
  name: 'ChartTable',

  props: {
    chartData: {
      type: Array as PropType<DVChartDataTable>,
      required: true,
    },

    chart: {
      type: Object as PropType<PanelChart>,
      required: true,
    },
  },

  data() {
    return {
    }
  },

  computed: {
    scrollHeight(): string {
      return `calc(${calcChartHeight(this.chart.layout.h)}px - 100px)`
    },

    columns(): Record<string, any>[] {
      if (this.chart.dataCfg.type === 'chart-table') {
        return this.chart.dataCfg.headers.map((h) => ({
          title: h.fieldName,
          dataIndex: h.fieldName,
          key: h.fieldPath.join('.'),
        }))
      }

      return []
    },
  },
})
</script>

<style scoped lang="scss">
.r-ChartTable {

}
</style>
