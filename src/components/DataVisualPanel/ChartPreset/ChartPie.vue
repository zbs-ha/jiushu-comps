<template>
  <div class="r-ChartPie w-full h-full">
    <v-echarts :option="ecCfg"/>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DVChartDataPie, DVChartEcCfg, PanelChart } from '@/models/DataVisualPanel'
import VEcharts from '@/components/VEcharts.vue'
import chartBarCfg from './ECConfig/ChartPie'

export default Vue.extend({
  name: 'ChartPie',
  components: {
    VEcharts,
  },

  props: {
    chartData: {
      type: Array as PropType<DVChartDataPie>,
      required: true,
    },

    chart: {
      type: Object as PropType<PanelChart>,
      required: true,
    },
  },

  computed: {
    ecCfg(): DVChartEcCfg {
      return chartBarCfg(this.chartData.map((c) => ({ name: c.subdivide, value: c.angle })))
    },
  },
})
</script>

<style scoped lang="scss">
.r-ChartPie {

}
</style>
