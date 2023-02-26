<template>
  <div>
      <div class="mx-0 pa-3">
        <div xs1 class="d-flex justify-center">
          <v-progress-circular 
            indeterminate 
            :size = "opts.size || 48" 
            :color = "opts.color || 'secondary'" 
            :width = "opts.size || 2"
          ></v-progress-circular>
        </div>
        <div class="title secondary--text text-center font-weight-light pa-1">
          {{ opts.message }}
        </div>
      </div>
  </div>
</template>

<script>
import listenerMixin from "@/mixins/core/listener.mixin.js";

export default {

  name: "progressDialog",
  mixins: [listenerMixin],

  props: ["options", "submit", "dialogID"],


  data: () => ({
    opts: { message: "" },
  }),

  methods: {

    resolve() {
      // this.$emit('submit', true)
      this.submit(true)
    },

    reject() {
      // this.$emit('submit', false)
      this.submit(false)
    },

    setOptions(options) {
      options = options || { 
        message: "Wait one moment ..." 
      }
      this.opts = options
    }
  },

  // layout: progressLayout,

  created() {

    this.setOptions(this.options)

    this.on({
      event: "loader-dialog-cancel",
      callback: () => {
        this.off()
        this.resolve()
      },
      rule: params => {
        // console.log("CANCEL",params.dialogID, this.dialogID)
        return params.dialogID == this.dialogID
      }
    })

    this.on({
      event: "loader-dialog-set",
      callback: (options) => {
        // console.log("OPTIONS",options)
        // this.off()
        this.setOptions(options)
      },
      rule: params => {
        // console.log("SET",this.dialogID, params)
        return params.dialogID == this.dialogID
      }
    })
  }




}

</script>
