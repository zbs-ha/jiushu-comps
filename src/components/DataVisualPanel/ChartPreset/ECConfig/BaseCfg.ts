import { EChartsOption } from 'echarts'

export default (): EChartsOption => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
})
