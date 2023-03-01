<template>
  <div>

    <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="getDataAPI()"
      >
               
      <v-text-field 
        v-model="inputAPI" :rules="inputRules"
        label="Nhập link api của bạn" 
        required
        @keyup.enter="getDataAPI()"
        autofocus
        >
      </v-text-field>

      <v-btn 
        :disabled="btnDisabled"
        color="primary" 
        block
        @click="getDataAPI()" 
        
        > Phân tích 
      </v-btn>
   </v-form>

    <div class="loading" v-if="loading">
        <v-progress-circular
        indeterminate
        color="primary" 
        size=100
      /> 
      <h1 class="notify-text">Đang phân tích biểu đồ của bạn</h1>
    </div>


    
    <!-- Select Chart -->
    <div v-if="loaded"  class="chart-choose">

      <div class="data-choose">

        <v-chip
          class="ma-2"
          color="cyan-darken-4"
          pill
        >Select Chart
        </v-chip>

        <v-divider 
          color="primary" 
          thickness="2px">
        </v-divider>


        <div v-for="chart in keySelectChart" :key="chart" class="data-item">
              <v-btn 
                color="#90CAF9"
                min-width="220px"
                block
              :disabled="clickedChart.includes(chart)" 
              @click="handleSelectChart(chart)"
              > {{ chart }} 
              </v-btn>     
        </div>

                 

      </div>
    </div>
   

  <div v-if="showSelectData" class="chart-choose">
    <div class="data-choose" >

        <v-chip
          class="ma-2"
          color="cyan-darken-4"
          pill
        >
          Select data
        </v-chip>

        <v-divider 
          color="primary" 
          thickness="2px">
        </v-divider>  
      
        <div v-for="item in keyAPI" :key="item" class="data-item">
            <v-btn 
              color="#90CAF9"
              min-width="220px"
             :disabled="clicked.includes(item)" 
             @click="addToChart(item)"
             > {{ item }} 
            </v-btn>
        </div>
    </div>
  </div>
    

  <div class="chart-cover" v-if="showBarChart">

    <v-chip
      class="ma-2"
      color="green-darken-4"
      pill
    >
      Bar chart
    </v-chip>

    <div class="chart-area">  
      <Bar
        v-if="showBarChart"
        :options="chartOptions"
        :data="chartData"
        :key="componentKey" 
      />  
    </div>

  </div>

    <PieChart 
      v-if="showPieChart"
      :keyTransfer="updateChart"
      :newData="newData"
      :resetChart="resetChart"
    />


  </div>
</template>

<script>
import axios from "axios";

import { Bar } from 'vue-chartjs'
import PieChart from "./PieChart.vue";


import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
  name: 'Chart',
  components: { Bar, PieChart },
  data(){
      return{
        showSelectData: false,
        showBarChart: false,
        valid: false, 
        inputAPI: '',
        keyAPI: [],
        componentKey: 0,
        loaded: false,
        btnDisabled: false,
        loading: false,
        clicked: [],
        
        dataAPI: "",
        inputRules: [
            v => !!v || 'Bạn cần nhập link API',
            v => (v && v.length > 0) || 'Link API không được để trống',
            v => (v && v.length > 10) || 'Link API không được dưới 10 kí tự',
        ],

        chartData: {
          labels: [],
          datasets: []
        },

        chartOptions: {
          responsive: true,
        },

        // Pie chart
        showPieChart: false,
        updateChart: 0,
        newData: '',
        resetChart: 0,
    

        // button choose chart
        keySelectChart: ['Bar', 'Pie'],
        clickedChart: '',
        denyChooseChart: false,

        

      }
    },

    mounted(){
      this.changeTitle()
    },

    methods: {

      changeTitle(){
        document.title = "Phân tích biểu đồ"
      },

        getDataAPI(){
          if(this.valid && this.inputAPI != ''){

            this.loading = true
            try{
              axios.get(`${this.inputAPI}`)
              .then(res => this.analystAPI(res))
              this.btnDisabled = true
            }
            catch(e){
              console.error(e)
            }
          }
          
        },

        analystAPI(API){
          this.btnDisabled = false
          this.loading = false   
          this.dataAPI = API.data;

          // show data for choosing
          const splitAPI = Object.keys(API.data[0])
          this.keyAPI.length=0
          for (let i = 0; i < splitAPI.length; i++){
              this.keyAPI.push(splitAPI[i])
          }



          this.chartData.labels.length=0
          for (let i = 1; i <= this.dataAPI.length; i++){
              this.chartData.labels.push(i)
            console.log(this.chartData.labels)
          }


          this.loaded = true // load frame data can choose
        },

        addToChart(item){
          this.clicked.push(item)             //disable button 

          // Random color when choose data
          var randomColor = Math.floor(Math.random()*16777215).toString(16);
          const newdata = { 
            label: `${item}`,
            backgroundColor: `#${randomColor}`,
            data: []
          }   

          // value data 
          for (var a = 0; a < this.dataAPI.length; a++){
            newdata.data.push(this.dataAPI[a][`${item}`])
          }


          this.chartData.datasets.push(newdata) // ITEM DATA


          //TIP : update chart 
          this.componentKey += 1; 

          //Pie
          this.updateChart +=1
          this.newData = newdata

        },


        handleSelectChart(chartChoose){
          this.clickedChart = chartChoose


          if(chartChoose){
            this.showSelectData = true
            this.denyChooseChart = true
          }

          var charName = chartChoose

          switch(charName) {
            case 'Bar': {
              this.showBarChart = true
              this.showPieChart = false
              break
            }

            case 'Pie': {

              this.showBarChart = false
              this.showPieChart = true
              break
            }

          }

        }

    }
}
</script>

<style lang="scss" scoped>

.chart-choose{
  width: 100%;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: start;

}

.data-choose{
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;

  border: 1px solid #809cff;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
}

.data-item{
  padding: 10px;
}

.loading{
  width: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.notify-text{
  margin-top: 50px;
  color: #1867c0;
}


.chart-cover{
  margin-top: 50px;
  width: 100%;
  height: 500px;
  display: flex;
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