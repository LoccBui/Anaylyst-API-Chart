<template>
  <div class="container">

    <v-chip
      class="ma-2"
      color="green-darken-4"
      pill
    >
      Pie chart
    </v-chip>


    <div class="chart-area"> 
        <Pie 
            :data="dataChart"
            :options="optionsChart"
            :key="pieChartUpdate"
        /> 
    </div>

  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)


export default {
    name: 'PieChart',
    components: { Pie },
    props: ["keyTransfer", "newData"],
    mounted(){
        this.handleDataTransfer()
    },

    watch: {
        keyTransfer: function(){
            this.handleDataTransfer()
        }


    },


    data(){
        return {
            pieChartUpdate: 0,

            dataChart : {
                labels: [],
                datasets: []
            },

            optionsChart: {
                responsive: true
            }
        }
    },

    methods:{
        handleDataTransfer(){
            if(this.dataChart.labels[0] == null){
                this.dataChart.labels.length =0
            }
            
            
            //title value: labels
            this.dataChart.labels.push(this.newData.label)            

            //data : datasets -> data
            this.dataChart.datasets.push(this.newData)

            this.pieChartUpdate += 1
        }
    }

}
</script>

<style lang="scss" scoped>
.container{
    margin-top: 50px;
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
     align-items: center;

}
.chart-area{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
}
</style>

