<template>
  <div v-if="options && getPropertyValue"
    :class="(options.decoration) ? getPropertyValue(options.decoration.classes) : 'subtitle-2'"      
    :style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''"      
  >
    <div class="d-flex align-end">
      <i class= "mdi mdi-clock-alert display-1 primary--text text--lighten-4"></i>
      <v-spacer></v-spacer>
      <div style="line-height: 0.9">{{note}}</div>    
    </div>  
    
    <v-progress-linear
        v-model="model"
        :color="(options.decoration) ? getPropertyValue(options.decoration.color) : 'primary'"
        :background-color="(options.decoration) ? getPropertyValue(options.decoration.backgroundColor) : '#ffffff'"
        :reverse="(options.decoration) ? getPropertyValue(options.decoration.reverse) : true"
        width = "100%" 
        :height = "(options.decoration) ? getPropertyValue(options.decoration.height) : 6"
        style="border: 1px solid #eaecef;"
      >
      </v-progress-linear>

  </div>

</template> 


<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { isUndefined, isArray, get, set, extend } from "lodash"
import TimerConfig from "./timer-config.vue"; 
import moment from "moment"


export default {

  name: "timer-widget",

  icon: "mdi-clock-alert",

  mixins: [djvueMixin, listenerMixin],

  props: ["config"],

  data: () => ({
    model: null,
    note: "",
    options: null
  }),


  watch:{
    // options(newValue){
    //   if(newValue){
    //     this.restart()
    //   }
    // },
    config:{
      handler(){
        console.log("watch", this.config.data.embedded)
        if(this.config) this.options = this.config.data.embedded
      },
      deep: true
    }
  },

  methods: {

    getPropertyValue(v){
      try {
          if((/^\{\{.+\}\}$/gi).test(v))
            return get(this, v
                      .replace("{{","")
                      .replace("}}","")
                      .trim()
            )

          if((/^\$\{.+\}$/gi).test(v)) {
            
            let f = `(${v
                      .replace("${","")
                      .replace(/}$/gim,"")
                    })`
            
            
            return eval(f)
          }
        
          return v
      } catch (e) {
        return (!this.isProductionMode) ? "Cannot getPropertyValue: "+e.toString() : "" //v
      }       
    },

    set(options){
      // this.config.data.embedded = data
      // console.log("SET TIMER", options)
      this.options = options
    },

    start(){
      this.restart()
    },

    restart(){
      // console.log("RESTART TIMER",this.options)

      if(this.interval){
        this.stop()
      }
    
      let d = (this.options.data) ? this.getPropertyValue(this.options.data.duration) : "10 seconds"
      d = d.split(" ")
      
      let duration = moment.duration(d[0], d[1])
      let current = duration.clone()
      let bin = moment.duration( 1, d[1] ).asMilliseconds()
      
      if( Number.parseInt(d[0]) < 5 ){
        bin = Math.round(bin / 2)
      }
          
      this.model = 100 * current.asMilliseconds() / duration.asMilliseconds()
      this.note = `Time left ${current.humanize()}`
      

      this.interval = setInterval(() => {
        current.subtract(bin)
      
        this.model = 100 * current.asMilliseconds() / duration.asMilliseconds()
        this.note = `Time left ${current.humanize()}`
        if( current.asMilliseconds() <= 0 ){
          clearInterval(this.interval)
          this.note = `Time is up`
          let event = "timeout"
          this.emit(event, this)
        }
      }, bin)
    
    },

    stop(){
      if(this.interval){
        clearInterval(this.interval)
        this.interval = null  
      }
    },
    
    onUpdate({ data }, mode) {
      // console.log("ONUPDATE TIMER WIDGET", this, data, mode)
      if( mode ){
        if (mode.override) {
          set(this, mode.override, data)
        }
        if (mode.extend) {
          set(this, mode.extend, extend(get(this, mode.extend), data))
        }
      } else {
        this.options = data  
      }
      let temp = extend({},this.options)
      // console.log("IG ONUPDATE", data, mode, extend({},temp), this)
      this.options = null
      
      this.$nextTick(() => {
        this.options = temp
        // this.restart()
        // console.log("UPDATE", this.options)
      })
    },

    onReconfigure(widgetConfig) {
        return this.$dialogManager.showAndWait(TimerConfig, { width: "90%" }, { config: widgetConfig })
    }, 

   
  },



  

  mounted() {
    this.$emit("init")
  },

  created(){
    // this.options = this.config.data.embedded 
    // this.restart()
  }

}

</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>