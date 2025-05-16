<template>
  <div class="dj-checkboxes">
    <div 
      v-if="options && options.data"
      :class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
      :style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" >
      <v-checkbox     
        v-for="(variant, index) in vars"
        :key="index"
        hide-details
        v-model="selection[index]" 
        :disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
        :readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
        :color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
        :flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
        :inset="(options.decoration) ? getPropertyValue(options.decoration.inset) : false"
        :dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
        :messages="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
         
        @change="inputData"
      >
        <template v-slot:label>
          <div
            :class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
            :style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
          >
            {{ (options.data) ? getPropertyValue(variant) : '' }}
          </div>
        </template> 
      </v-checkbox>

    </div>
  </div>
</template> 

<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { isUndefined, isArray, get, set, extend } from "lodash"
import ManyOfConfig from "./many-of-config.vue"; 



export default {

  name: "many-of-widget",

  icon: "mdi-checkbox-marked-outline",

  mixins: [djvueMixin, listenerMixin],

  props: ["config"],

  data: () => ({
    response: "",
    selection: [],
    options: null
  }),


  computed:{
    
    vars() {
      let res = this.getPropertyValue(this.options.data.variants)
      if(res && isArray(res)) return res
      return [] 
    }
  
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
        let resp = this.getPropertyValue(this.options.data.value) || []
        let variants = this.getPropertyValue(this.options.data.variants || [])
        if(variants && isArray(variants)){
          let selection = variants.map(d => resp.includes(d))
          this.selection = selection
        }   
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
      this.options = null
      this.$nextTick(() => { this.options = temp})
    },

    onReconfigure(widgetConfig) {
        return this.$dialogManager.showAndWait(ManyOfConfig, { width: "90%" }, { config: widgetConfig })
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
            this.vars.filter((d, i) => this.selection[i])  
          )
        } else {
          if((/^\$\{.+\}$/gi).test(this.options.data.value)) {
        
            let f = this.options.data.value
                      .replace("${","")
                      .replace(/}$/gim,"")
                      .replace(/this\./gim,"")

            f = f + " = " + JSON.stringify( this.vars.filter((d, i) => this.selection[i]) )
            eval(f)          
            // set( 
            //   this, 
            //   f , 
            //   this.vars.filter((d, i) => this.selection[i]) 
            // )

          } else {
            this.options.data.value = this.vars.filter((d, i) => this.selection[i])
          }
        }  
        
        let event = this.options.data.event || "input-data"
        this.emit(event, this,  this.vars.filter((d, i) => this.selection[i]))
      }   
    },

   
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