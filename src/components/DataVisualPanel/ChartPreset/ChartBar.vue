<template>
  <div class="r-ChartBar w-full h-full">
    <v-echarts :option="ecCfg"/>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DVChartDataBar, DVChartEcCfg, PanelChart } from '@/models/DataVisualPanel'
import VEcharts from '@/components/VEcharts.vue'
import chartBarCfg from './ECConfig/ChartBar'

export default Vue.extend({
  name: 'ChartBar',
  components: {
    VEcharts,
  },

  props: {
    chartData: {
      type: Array as PropType<DVChartDataBar>,
      required: true,
    },

    chart: {
      type: Object as PropType<PanelChart>,
      required: true,
    },
  },

  computed: {
    ecCfg(): DVChartEcCfg {
      return chartBarCfg(this.chartData.map((c) => ({ name: c.x, value: c.y })))
    },
  },
})
</script>

<style scoped lang="scss">
.r-ChartBar {

}
</style>
