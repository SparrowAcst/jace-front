<template>
    <div v-if="options" class="viewer-wrapper">
      <viewer
        ref="viewer"
        :options="options.options"
        :images="options.images"
        rebuild
        class="viewer"
        @inited="inited"
      ></viewer>
    </div>
</template>



<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";

import { ref, onMounted } from "vue";

import { set, get, isString, extend} from "lodash"

import configDialog from "./image-viewer-config.vue";

import 'viewerjs/dist/viewer.css'

export default {

    name: "image-viewer-widget",

    icon: "mdi-image-multiple-outline",

    mixins: [djvueMixin, listenerMixin],

    props: ["config"],

    components: {
      viewer : () => import("@/components/core/ext/image-viewer.vue"),
  
    },

    data: () => ({
        options: null
    }),

    // watch: {
    //     options: {
    //         handler(newValue, oldValue) {
    //             if (newValue && newValue.url && this.instance) {
    //               // if(oldValue && oldValue.url != newValue.url)
    //                 // this.instance.loadDocument(newValue.url)
    //             }
    //         },
    //         deep: true
    //     }
    // },

    methods: {

        
        onUpdate({ data }, mode) {
          
          if( mode ){
            if (mode.override) {
              set(this, mode.override, data)
              // console.log("MODE", this.options)
            }
            if (mode.extend) {
              set(this, mode.extend, extend(get(this, mode.extend), data))
            }
          } else {
            this.options = data  
          }
          let temp = extend({},this.options)
          this.options = null
          // this.$nextTick(() => { 
                this.options = temp
                // console.log("UPDATE IMAGE VIEWER",this.options)
                // this.show() 
          // })
        },

   
        onReconfigure(widgetConfig) {
                return this.$dialogManager.showAndWait(configDialog, { width: "90%" }, { config: widgetConfig })
        },

      inited (viewer) {
        this.$viewer = viewer
      },
      
      show () {
        if(this.$viewer) this.$viewer.show()
      }

    },

    created() {
        this.options = this.config.data.embedded || null
    },

    async mounted() {
        this.$emit("init")
    },
}

</script>