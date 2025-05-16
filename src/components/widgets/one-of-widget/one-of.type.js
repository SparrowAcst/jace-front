export default {
  name: "one-of-widget",
  icon: "mdi-radiobox-marked",

  getInitialConfig() {

    return {
      type: "one-of-widget",
      name: "noname",
      icon: "mdi-radiobox-marked",
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
