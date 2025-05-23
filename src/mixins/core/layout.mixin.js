import djvueMixin from "@/mixins/core/djvue.mixin.js"
import listenerMixin from "@/mixins/core/listener.mixin.js"
import initiableMixin from "@/mixins/core/initiable.mixin.js"
import { values } from "lodash"


export default {

  mixins: [djvueMixin, listenerMixin, initiableMixin],

  beforeDestroy() {
    this.emit("page-stop", this, this.app.currentPage)
    this.off()
  },

  data: () => ({
    djType: "layout",
    djId: null
  }),

  methods: {

    getMediators() {
      let pageLevelMediators = []
      values(this.app.currentPage.holders).forEach(h => {
        pageLevelMediators = pageLevelMediators.concat(h.widgets.filter(w => w.type == "mediator-widget"))
      })

      pageLevelMediators = pageLevelMediators.map(m => this.$djvue.selectWidgets(this.$root, item => (item.config) && (item.config.id == m.id))[0])

      let appLevelMediators = []
      values(this.app.config.skin.holders).forEach(h => {
        appLevelMediators = appLevelMediators.concat(h.widgets.filter(w => w.type == "mediator-widget"))
      })

      appLevelMediators = appLevelMediators.map(m => this.$djvue.selectWidgets(this.$root, item => (item.config) && (item.config.id == m.id))[0])

      // if (pageLevelMediators.length == 0) pageLevelMediators.push({ run: () => {} })
      // if (appLevelMediators.length == 0) appLevelMediators.push({ run: () => {} })

      const result = pageLevelMediators.map( d => ({
          instance: d,
          level: "Page level"
        }))
        .concat( appLevelMediators.map( d=> ({
          instance: d,
          level: "App level"
        })))

      // console.log("MEDIATORS", result)     
      return result
      // [pageLevelMediators, appLevelMediators]
    },

    pageStart() {
      let mediators = this.getMediators();
      // console.log(mediators)
      console.log("PageStart", mediators)

      Promise.all(this.getMediators().map(m => {
        console.log("RUN", m.instance.run)
        return m.instance.run()
      }))
      .then(() => {
        // Promise.all(mediators[1].map(al => al.run()))
        //   .then(() => {
            this.$nextTick(() => {
              jaceApp.app.isPageStarted = true
              this.emit("page-start")
                .then(() => {
                  this.emit("page-start-after")
                })
            })
      })
      .catch((e) => {
        // eslint-disable-next-line
        console.error(e.toString())
        this.$djvue.warning({
          type: "error",
          title: `Mediator Error`,
          text: e.toString()
        })

        this.$nextTick(() => {
          jaceApp.app.isPageStarted = true
          this.emit("page-start")
            .then(() => {
              this.emit("page-start-after")
            })
        })

      })

        // })
        // .catch((e) => {
        //   // eslint-disable-next-line	
        //   console.error("Page level error", e.toString())
        //   this.$djvue.warning({
        //     type: "error",
        //     title: `Page level Error`,
        //     text: e.toString()
        //   })

        //   this.$nextTick(() => {
        //     this.emit("page-start")
        //       .then(() => {
        //         this.emit("page-start-after")
        //       })
        //   })

        // })
    },

  //   async pageStart() {
     
  //     let mediators = this.getMediators();
     
  //     // console.log("PageStart", mediators)
     
  //     try {
  //       // console.log("EXECUTE SCRIPTS", mediators.length)
  //       for( let i=0; i <  mediators.length; i++ ){
  //         console.log("RUN", mediators[i].instance.config.id)
  //         await mediators[i].instance.run() 
  //       }

  //     } catch(e) {

  //       console.error(e.toString())
  //       this.$djvue.warning({
  //         type: "error",
  //         title: `Mediator Error`,
  //         text: e.toString()
  //       })

  //     } finally {

  //       this.$nextTick( async () => {
  //         jaceApp.app.isPageStarted = true
  //         await this.emit("page-start")
  //         this.emit("page-start-after")
  //       })

  //     }
  // },     


      // Promise.all(this.getMediators().map(m => {
      //   console.log("RUN", m.instance.run)
      //   return m.instance.run()
      // }))
      // .then(() => {
      //   // Promise.all(mediators[1].map(al => al.run()))
      //   //   .then(() => {
      //       this.$nextTick(() => {
      //         jaceApp.app.isPageStarted = true
      //         this.emit("page-start")
      //           .then(() => {
      //             this.emit("page-start-after")
      //           })
      //       })
      // })
      // .catch((e) => {
      //   // eslint-disable-next-line
      //   console.error(e.toString())
      //   this.$djvue.warning({
      //     type: "error",
      //     title: `Mediator Error`,
      //     text: e.toString()
      //   })

      //   this.$nextTick(() => {
      //     jaceApp.app.isPageStarted = true
      //     this.emit("page-start")
      //       .then(() => {
      //         this.emit("page-start-after")
      //       })
      //   })

      // })

        // })
        // .catch((e) => {
        //   // eslint-disable-next-line  
        //   console.error("Page level error", e.toString())
        //   this.$djvue.warning({
        //     type: "error",
        //     title: `Page level Error`,
        //     text: e.toString()
        //   })

        //   this.$nextTick(() => {
        //     this.emit("page-start")
        //       .then(() => {
        //         this.emit("page-start-after")
        //       })
        //   })

        // })
    // },

    onChildsInitiated() {
      this.pageStart() 
    }
  },

  created() {
    this.djId = this.$djvue.randomName()
    this.on({
      event: "layout-page-start",
      callback: (caller) => {
        console.log("layout-page-start")
        if( this.beforeLayoutStart ) this.beforeLayoutStart()
        // this.pageStart() 
      },
      rule: () => true
    })


    this.on({
      event: "page-stop",
      callback: () => { this.off() },
      rule: () => true
    })
    
  }

}
