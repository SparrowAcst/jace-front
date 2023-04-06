import snippets from "./snippets.js"

export default {

	name:"image-viewer-widget",

    icon: "mdi-image-multiple-outline",

    getInitialConfig(snippet){
        return snippets
    }    

}