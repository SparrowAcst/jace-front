<template>
  <v-tabs
      v-if="options"
      v-model="tab"
      background-color="transparent"
      :color="(options.decoration) ? options.decoration.color : ''"
      :background-color="(options.decoration) ? options.decoration.bgColor : ''"
      :active-class="(options.decoration) ? options.decoration.activeClass : ''"
      :slider-size="(options.decoration) ? options.decoration.sliderSize : ''"
      :slider-color="(options.decoration) ? options.decoration.sliderColor : ''"
      show-arrows
      :vertical = "(options.decoration) ? options.decoration.vertical : false"
      :right = "(options.decoration) ? options.decoration.right : ''"
      :left = "(options.decoration) ? options.decoration.left : ''"
       
    >
      <v-tab
        v-for="(item, index) in options.tabs"
        :key="index"
        :class="options.decoration.classes"
        :disabled= "getPropertyValue(item.disabled)"
        :style="`
          text-transform:none !important;
          padding: 0 10px;
          justify-content: flex-start;
          ${(options.decoration.vertical) ? 'border-bottom: 1px solid #cfd7e6' : 'none'};
        `"
        @click="selectTab(item)"
      >
        
        <!-- <v-badge 
          v-if="item.badge"
          :color="item.badge.color || 'primary'"
          :content="item.badge.content || '+2'"
          inline
          right
          light
        >
          <i v-if="item.icon" :class="`mdi ${item.icon} pr-1`"></i>
          {{ item.title }}
        </v-badge>
 -->      
        <div 
          class="d-flex align-center" 
          style="width:100%"
        >
          <v-icon v-if="item.icon" class="pr-1">
            {{item.icon}}
          </v-icon>
          <div>{{ getPropertyValue(item.title) }}</div>
          <div class="spacer"></div>
          <div v-if="item.badge" :class="item.badge.decoration.class" :style="item.badge.decoration.style">
            {{item.badge.content}}
          </div>  
        </div>
      
      </v-tab>
    </v-tabs>
</template>
<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { isString, findIndex, get, set, extend } from "lodash"

<<< if( jace.mode == "development") { >>>

import TabBarConfig from "./tab-bar-config.vue"


<<< } >>>


export default {

  name: "tab-bar-widget",

  icon: "mdi-tab",

  mixins: [djvueMixin, listenerMixin],

  methods: {

    // onUpdate ({data, options}) {
    //   this.options = data
    //   let t = findIndex(data.tabs, d => d.selected)
    //   if( t != this.tab) 
    //     this.$nextTick(() => {
    //       this.tab = t
    //     })
         
    // },

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
      this.$nextTick(() => { 
        this.options = temp
        let t = findIndex(data.tabs, d => d.selected)
        if( t != this.tab) 
          this.$nextTick(() => {
            this.tab = t
          })
        })
    },
    
    select (tabIndex) {
      this.tab = tabIndex
    },

    setTabIndex (tabIndex) {
      this.tab = tabIndex
    },
      
    selectTab(tab){
      let event = tab.event || "select-tab"
      this.emit(event, tab) 
    },

    getPropertyValue(v){
      // console.log("PROP VALUE", v)
      // console.log(this.options)
      try {
          if((/^\{\{.+\}\}$/gi).test(v)){
            let res = get(this, v
                                .replace("{{","")
                                .replace("}}","")
                                .trim()
                      )          
              // console.log(res)
              return res        
            }

          if((/^\$\{.+\}$/gi).test(v)) {
            
            let f = `(${v
                      .replace("${","")
                      .replace(/}$/gim,"")
                    })`
            
            
            let res = eval(f)
            // console.log(res)
            return res
          }
        
          // console.log(v)
          return v
      } catch (e) {
        console.log("WIDGET WARNING ", this)
        console.log("Cannot getPropertyValue for "+ v +"\n"+e.toString())
        return (!this.isProductionMode) ? "Cannot getPropertyValue: "+e.toString() : "" //v
      }       
    },



<<< if( jace.mode == "development") { >>>

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(TabBarConfig, { width: "90%" }, { config: widgetConfig })
    }

<<< } >>>

  },

  // watch:{
  //   tab: value => {
  //     console.log("$TAB", value)
  //   }
  // },

  props: ["config"],

  data:() => ({
    tab:null,
    options:{
      "decoration": {
        "color": "secondary lighten-1",
        "bgColor": "#ffffff",
        "sliderColor": "#232f3d",
        "sliderSize": "3",
        "activeClass": "active",
        "classes": "title font-weight-light",
        "right": false,
        "left": true,
        "vertical": true
      },
      tabs:[]
    }
  }),

  // computed: {
  //   options() {
  //     return this.config.data.embedded
  //   }
  // },

  mounted() { this.$emit("init") }

}

</script>
