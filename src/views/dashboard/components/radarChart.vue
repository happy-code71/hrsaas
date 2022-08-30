<template>
    <div class="radar-echart" ref="chart">

    </div>
</template>

<script>
// 按需引入
import * as echarts from 'echarts/core';// 引入echarts主模块
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers';
import {
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
echarts.use([RadarChart, TitleComponent, TooltipComponent, CanvasRenderer])

// node 引入
// require('echarts/lib/chart/radar') // 引入雷达图
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
export default ({
    data() {
        return {
            canvasClass: null,
            option: {
                title: {
                    text: '基础雷达图'
                },

                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '考勤', max: 100 },
                        { name: '技术', max: 100 },
                        { name: '管理', max: 100 },
                        { name: '分享', max: 100 },
                        { name: 'bug', max: 100 },
                        { name: '助人', max: 100 }
                    ]
                },
                series: [
                    {
                        name: 'Budget vs spending',
                        type: 'radar',
                        data: [
                            {
                                value: [20, 33, 11, 84, 90, 51],
                                name: '张三'
                            },
                            {
                                value: [98, 20, 84, 50, 10, 95],
                                name: '李四'
                            }
                        ]
                    }
                ]
            }
        }
    },
    mounted() {
        this.canvasChart()
    },
    methods: {
        canvasChart() {
            this.canvasClass = this.$refs.chart
            let myChart = echarts.init(this.canvasClass)
            myChart.setOption(this.option)
        }
    },
    components: {

    }
})
</script>

<style scoped>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>