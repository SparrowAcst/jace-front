<template>
	<span v-if="options && options.data && getPropertyValue"> 
		{{value}}
	</span>
</template>	

<script>

import listenerMixin from "@/mixins/core/listener.mixin.js";

export default {
	
	mixins:[listenerMixin],
	props:["options","getPropertyValue"],
	data: () => ({

		value: null
	
	}),

	// computed:{
	// 	value(){
	// 		if(this.options && this.options.data && this.getPropertyValue) {
	// 			return this.getPropertyValue(this.options.data.value)
	// 		} else {
	// 			return "UNDEFINED"
	// 		}	 
	// 	},
	// 	settings(){
	// 		return ( this.options && this.options.data ) ? this.options.data : {}
	// 	}
	// },

	created(){
		this.on({
			event:"$$force-update",
			callback: () => {
				if(this.options && this.options.data && this.getPropertyValue){
					this.value = this.getPropertyValue(this.options.data.value)	
				}
			}
		})
		
		if(this.options && this.options.data && this.getPropertyValue){
			this.value = this.getPropertyValue(this.options.data.value)	
		}
		 
	}
}
</script>