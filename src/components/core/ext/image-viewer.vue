<template>
  <div>
     <img v-if="options" v-for="src in images" :src="src" :key="src" style="width:0px;">
  </div>
</template>
<script>

import Viewer from 'viewerjs'
export default {
  props: {
    images: {
      type: Array,
    },
    rebuild: {
      type: Boolean,
      default: false,
    },
    trigger: {},
    options: {
      type: Object,
    },
  },
  
  data() {
    return {
    }
  },
  
  computed: {
  },
  
  watch: {
    images() {
      this.$nextTick(() => {
        this.onChange()
      })
    },
    trigger: {
      handler() {
        this.$nextTick(() => {
          this.onChange()
        })
      },
      deep: true,
    },
    options: {
      handler() {
        this.$nextTick(() => {
          this.rebuildViewer()
        })
      },
      deep: true,
    },
  },
  
  mounted() {
    this.createViewer()
  },

  unmounted() {
    this.destroyViewer()
  },
  methods: {
    onChange() {
      if (this.rebuild) {
        this.rebuildViewer()
      }
      else {
        this.updateViewer()
      }
    },
    rebuildViewer() {
      this.destroyViewer()
      this.createViewer()
    },
    updateViewer() {
      if (this.$viewer) {
        this.$viewer.update()
        this.$emit('inited', this.$viewer)
      }
      else {
        this.createViewer()
      }
    },
    destroyViewer() {
      this.$viewer && this.$viewer.destroy()
    },

    createViewer() {
      if(this.options){
         this.options.url = "src"
      }
      // console.log("create viewer instance", this.options)
      
      this.$viewer = new Viewer(this.$el, this.options)
      // console.log(this.$viewer)
      // if (window.attachEvent) {
      //   window.attachEvent('onresize', this.onChange);
      // } else {
      //   window.addEventListener('resize', this.onChange);
      // }

      this.$emit('inited', this.$viewer)
    },
  },
}
</script>