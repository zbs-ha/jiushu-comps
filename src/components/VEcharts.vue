<template>
  <v-v-echarts class="r-chart h-full w-full" :option="option" autoresize/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { EChartsOption } from 'echarts'
import VVEcharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 按需引入会用到的组件们
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

export default Vue.extend({
  name: 'VEcharts',
  components: {
    VVEcharts,
  },

  props: {
    option: {
      type: Object as PropType<EChartsOption>,
      required: true,
    },
  },
})
</script>

<style scoped lang="scss">
.r-chart {

}
</style>
