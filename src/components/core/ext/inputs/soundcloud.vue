<template>
	    
	    <center v-if="options && getPropertyValue">
		
	    	<iframe 
	    		:width="(options.decoration) ? getPropertyValue(options.decoration.width) || '100%' : '100%'" 
		    	:height="(options.decoration) ? getPropertyValue(options.decoration.height) || '520' : '520'" 
		    	:src="(options.data) ? getPropertyValue(options.data.src) || '' : ''" 
		    	:frameborder="(options.decoration) ? getPropertyValue(options.decoration.border) || '0' : '0'" 
		    	allow="autoplay" 
	    		src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1613057106&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
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