<template>
  <div>
    <h1>This is Pie</h1>


    <Pie 
        :data="dataChart"
        :options="optionsChart"
        :key="pieChartUpdate"
    /> 


  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)


export default {
    name: 'PieChart',
    components: { Pie },
    props: ["dataAPI", "keyTransfer", "newData"],
    mounted(){
        this.handleDataTransfer()
    },

    watch: {
        keyTransfer: function(){
            this.handleDataTransfer()
        }
    },
    // labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],


    data(){
        return {
            pieChartUpdate: 0,

            dataChart : {
                labels: [],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                        data: [40, 20, 80, 10]
                    }
                ]
            },

            optionsChart: {
                responsive: true
            }
        }
    },

    methods:{
        handleDataTransfer(){
            console.info("--------------------------DataTransfer")  
            console.log(this.dataAPI)
            console.log(this.newData)


            this.dataChart.labels.push(this.newData.label)
            console.log(this.dataChart.labels)

            

            
            // this.dataChart.labels.push(this.dataAPI.datasets[0].label)



            // console.log( this.dataAPI.datasets[0].data)
            // this.dataChart.datasets.data.length = 0
            // this.dataChart.datasets.data.push(this.dataAPI.datasets[0].data)


            // console.log( this.newData)
            this.dataChart.datasets.push(this.newData)





            this.pieChartUpdate+=1
        }
    }

}
</script>

<style>

</style>