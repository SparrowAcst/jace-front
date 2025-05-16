export default {
  name: "many-of-widget",
  icon: "mdi-checkbox-marked-outline",

  getInitialConfig() {

    return {
      type: "many-of-widget",
      name: "noname",
      icon: "mdi-checkbox-marked-outline",
      options: {
        widget: {
          visible: true
        }

      },

      data: {
        embedded: {
          
          data:{
            variants: ["a", "b", "c"]
          },

          decoration:{

          }
        
        }
      }
    }

  }
}
