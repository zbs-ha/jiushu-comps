<template>
  <div class="r-ChartLine w-full h-full">
    <v-echarts :option="ecCfg"/>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DVChartDataLine, DVChartEcCfg, PanelChart } from '@/models/DataVisualPanel'
import VEcharts from '@/components/VEcharts.vue'
import chartBarCfg from './ECConfig/ChartLine'

export default Vue.extend({
  name: 'ChartLine',
  components: {
    VEcharts,
  },

  props: {
    chartData: {
      type: Array as PropType<DVChartDataLine>,
      required: true,
    },

    chart: {
      type: Object as PropType<PanelChart>,
      required: true,
    },
  },

  computed: {
    ecCfg(): DVChartEcCfg {
      const items = this.chartData.map((c) => ({
        name: c.x,
        value: c.y,
      }))

      return chartBarCfg(items)
    },
  },
})
</script>

<style scoped lang="scss">
.r-ChartLine {

}
</style>
