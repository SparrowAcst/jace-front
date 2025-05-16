

<template>
  <div 
    v-if="options && getPropertyValue"
    :class = "(options.decoration) ? getPropertyValue(options.decoration.classes) : ''"
    :style = "(options.decoration) ? getPropertyValue(options.decoration.style) : ''"
  >
    <v-btn    
  
  
        :disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
        @click.stop="resolve()"
        :color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
        :outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
        :dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
        :rounded="(options.decoration) ? getPropertyValue(options.decoration.rounded) : false"
        :text="(options.decoration) ? getPropertyValue(options.decoration.text) : false"
        :fab="(options.decoration) ? getPropertyValue(options.decoration.fab) : false"
        :x-small="(options.decoration) ? getPropertyValue(options.decoration.xSmall) : false"
        :small="(options.decoration) ? getPropertyValue(options.decoration.small) : false"
        :icon="(options.decoration) ? getPropertyValue(options.decoration.onlyIcon) : false"
        :loading="(options.decoration) ? getPropertyValue(options.decoration.loading) : false"
          
          style="
            text-transform:none !important;
            font-weight: inherit !important;
            letter-spacing: inherit !important;
            font-size: inherit !important;
          "
        >
        <v-icon v-if="options.decoration && options.decoration.icon" left>
          {{getPropertyValue(options.decoration.icon)}}
        </v-icon>
        <v-icon v-if="options.decoration && options.decoration.rightIcon" right>
          {{getPropertyValue(options.decoration.icon)}}
        </v-icon>
        {{ (options.decoration) ? getPropertyValue(options.decoration.title) : ""}}
      </v-btn>
  </div>

</template> 

<script>

import { isUndefined } from "lodash"
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import EduPushButtonConfig from "./edu-push-button-config.vue"

export default {

  name: "edu-push-button-widget",

  icon: "mdi-card-outline",

  mixins: [djvueMixin, listenerMixin],

  props: ["config"],

  
  computed: {
    options(){
      console.log("Options access")
      return this.config.data.embedded
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
        // console.log("WIDGET WARNING ", this)
        // console.log("Cannot getPropertyValue for "+ v +"\n"+e.toString())
        return (!this.isProductionMode) ? "Cannot getPropertyValue: "+e.toString() : "" //v
      }       
    },


    onUpdate({ data }) {
      this.config.data.embedded = null
      this.$nextTick(() => {
        this.config.data.embedded = data;
      })
    },

    resolve() {
      let event = this.options.data.event || "push"
      this.emit(event)
    },
    
    onReconfigure(widgetConfig) {
        return this.$dialogManager.showAndWait(EduPushButtonConfig, { width: "90%" }, { config: widgetConfig })
    }, 

  },

  mounted() {
    this.$emit("init")
  },

  created() {
    // this.options = this.config.data.embedded
  }

}

</script>
