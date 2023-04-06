export default {
  
    type:"image-viewer-widget", 
    name:"noname",
    icon:"mdi-image-multiple-outline",
    
    options: { 
        widget:{
          visible:true,
          height:600
        },
    },
    
    
    data:{
        source:"embedded",
        embedded:{
            data:"data"
        }
    }

} 