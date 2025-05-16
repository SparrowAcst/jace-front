<template>
	    <center v-if="options && getPropertyValue">
		    <iframe 
		    	:width="(options.decoration) ? getPropertyValue(options.decoration.width) || '100%' : '100%'" 
		    	:height="(options.decoration) ? getPropertyValue(options.decoration.height) || '520' : '520'" 
		    	:src="(options.data) ? getPropertyValue(options.data.src) || '' : ''" 
		    	:frameborder="(options.decoration) ? getPropertyValue(options.decoration.border) || '0' : '0'" 
		    	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
		    	allowfullscreen>
		    </iframe>
	    </center>
</template>	

<script>
export default {
	props:["options","getPropertyValue"],
	computed:{
		decoration(){
			return ( this.options && this.options.decoration ) ? this.options.decoration : {}
		}
	}
}
</script>