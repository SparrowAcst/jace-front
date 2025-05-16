export default {
  name: "timer-widget",
  icon: "mdi-clock-alert",

  getInitialConfig() {

    return {
      type: "timer-widget",
      name: "noname",
      icon: "mdi-clock-alert",
      options: {
        widget: {
          visible: true
        }

      },

      data: {
        embedded: {
          
          data:{
            duration: "10 seconds"
          },

          decoration:{

          }
        
        }
      }
    }

  }
}
