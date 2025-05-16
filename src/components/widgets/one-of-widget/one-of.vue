<template>
  
  <div
    v-if = "options && options.data" 
    :class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
    :style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''"
  >
    
    <v-radio-group 
      v-if = "options && options.data" 
      hide-details
      :active-class = "(options.decoration) ? getPropertyValue(options.decoration.activeClass) : ''"
      :disabled = "(options.data) ? getPropertyValue(options.data.disabled) : false" 
      :readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
      :dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
      :column = "(options.decoration) ? getPropertyValue(options.decoration.column) : true"
      :row = "(options.decoration) ? getPropertyValue(options.decoration.row) : false"
      :messages ="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
      @change = "inputData"
      style=""
    >
        
        <v-radio 

          v-for="variant in vars" 
          :key="variant"
          :label= "variant"
          :value= "variant"
        >
          <template v-slot:label>
            <div
              :class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
              :style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
            >
              {{ (options.data) ? getPropertyValue(variant) : '' }}
            </div>
        </template> 
        </v-radio>
      </v-radio-group>
    
  </div>
</template> 

<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { isUndefined, isArray, get, set, extend } from "lodash"
import OneOfConfig from "./one-of-config.vue"; 



export default {

  name: "one-of-widget",

  icon: "mdi-radiobox-marked",

  mixins: [djvueMixin, listenerMixin],

  props: ["config"],

  data: () => ({
    response: "",
    options: null
  }),


  computed:{
    
    vars() {
      let res = this.getPropertyValue(this.options.data.variants)
      if(res && isArray(res)) return res
      return [] 
    },
  },
  
  watch:{

    options:{
      handler(){
          this.upd()
      },
      deep: true
    },

    config:{
      handler(){
        if(this.config) {
          this.options = this.config.data.embedded
        }  
      },
      deep: true
    }

  },
  

  methods: {

    upd(){
      if(this.options && this.options.data){
        this.options.decoration = this.config.data.embedded.decoration
        this.response = this.getPropertyValue( this.options.data.value )   
      }
    },

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


    getOptions(){
      return this.options
    },
    
    onUpdate({ data }, mode) {
      // console.log("ONUPDATE WIDGET", this, data, mode)
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
      // console.log("update", temp, this)
      this.$nextTick(() => { this.options = temp})
    },

    onReconfigure(widgetConfig) {
        return this.$dialogManager.showAndWait(OneOfConfig, { width: "90%" }, { config: widgetConfig })
    }, 

inputData(data){
      if(
        !isUndefined(this.options) 
        && !isUndefined(this.options.data) 
        && !isUndefined(this.options.data.value)
      ) {
        if((/^\{\{.+\}\}$/gi).test(this.options.data.value)) {
          set( 
            this, 
            this.options.data.value.replace("{{","").replace("}}","").trim(), 
            data
            //this.vars.filter((d, i) => this.selection[i])  
          )
          // console.log("SET VALUE", data, this)
        } else {
          if((/^\$\{.+\}$/gi).test(this.options.data.value)) {
            
            // console.log("SET VALUE $", data)
            
            let f = this.options.data.value
                      .replace("${","")
                      .replace(/}$/gim,"")
                      .replace(/this\./gim,"") + "=" + JSON.stringify(data)
            
            // console.log(f)
            eval(f)
                      
            // set( 
            //   this, 
            //   f, 
            //   data //this.vars.filter((d, i) => this.selection[i]) 
            // )

          } else {
            this.options.data.value = data //this.vars.filter((d, i) => this.selection[i])
          }
        }  
        
        let event = this.options.data.event || "input-data"
        this.emit(event, this, data)
      }   
    },


    // inputData(data){
    //   this.$nextTick(()=> {
    //     this.$forceUpdate()
    //   })
    //   let event = this.options.data.event || "change"
    //   this.emit(event, this, data)
    // },

   
  },



  

  mounted() {
    this.$emit("init")
  },

  created(){
    this.options = this.config.data.embedded
  }

}

</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>