<template>
  <div>
    <v-text-field 
      v-model="inputAPI" 
      label="Nhập link api của bạn" 
      @keyup.enter="getDataAPI()">
    </v-text-field>

    <v-btn 
      :disabled="btnDisabled"
      color="primary" 
      block
      @click="getDataAPI()" 
      > Phân tích 
    </v-btn>

    <div class="loading" v-if="loading">
        <v-progress-circular
        indeterminate
        color="primary" 
        size=100
      /> 
      <h1 class="notify-text">Đang phân tích biểu đồ của bạn</h1>
    </div>

   

  <div v-else>
    <div class="data-choose" v-if="loaded">
        <div v-for="item in keyAPI" :key="item">
            <v-btn 
              color="#90CAF9"
             :disabled="clicked.includes(item)" 
             @click="addToChart(item)"
             > {{ item }} 
            </v-btn>
        </div>
    </div>
  </div>
    

    <Bar
    v-if="loaded"
    :options="chartOptions"
    :data="chartData"
    :key="componentKey" 
    />  

  
  </div>
</template>

<script>
import axios from "axios";

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
  name: 'BarChart',  
  components: { Bar },
  data(){
      return{
        inputAPI: '',
        keyAPI: [],
        componentKey: 0,
        loaded: false,
        btnDisabled: false,
        loading: false,
        clicked: [],

        dataAPI: "",

        chartData: {
          labels: [],
          datasets: [ 
          ]
        },
        chartOptions: {
          responsive: true
        }
        
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
          this.loading = true
          try{
            axios.get(`${this.inputAPI}`)
             .then(res => this.analystAPI(res))
            this.btnDisabled = true

          }
          catch(e){
            console.error(e)
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

          for (let i = 1; i <= this.dataAPI.length; i++){
              this.chartData.labels.push(i)
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
        },


    }
}
</script>

<style lang="scss" scoped>
.data-choose{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;

  border: 1px solid #809cff;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
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

</style>