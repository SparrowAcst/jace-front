<template>
		
	<v-file-input 
		type="file" 
		:label="(options.data) ? getPropertyValue(options.data.label) : ''" 
		:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
		:required="(options.data) ? getPropertyValue(options.data.required) : false"  
		:clearable="(options.data) ? getPropertyValue(options.data.clearable) : false"
		:multiple="(options.data) ? getPropertyValue(options.data.multiple) : false"
		:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
		:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
		:outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
		:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
		
		:counter="(options.decoration) ? getPropertyValue(options.decoration.counter) : false"

		:chips="(options.decoration) ? getPropertyValue(options.decoration.chips) : false"
		:small-chips="(options.decoration) ? getPropertyValue(options.decoration.smallChips) : false"
		:truncate-length="(options.decoration) ? getPropertyValue(options.decoration.truncateLength) : 15"
				

		:hide-details="(options.decoration) ? getPropertyValue(options.decoration.hideDetails) : false"
		:prepend-icon="(options.decoration) ? getPropertyValue(options.decoration.prependIcon) || '' : ''" 
		:show-size= "(options.decoration) ? getPropertyValue(options.decoration.showSize) || false : false"
		@change="fileChanged" 
	/>

</template>	

<script>

import { isUndefined } from "lodash"

export default {
	props:["options","getPropertyValue"],
	
	data: () => ({
		value: null
	}),

	methods:{
		fileChanged(file) {
	      this.value = file
	      this.$emit("select-files", this, this.value)
	    }
	},

	watch:{
		options:{
			handler(val){
				if (!val) return
				if (!this.getPropertyValue) return
			},
			deep:true
		},
		getPropertyValue:{
			handler(val){
				if (!this.options) return
				if (!val) return
			},
			deep:true
		}

	},

	created(){
		// this.value = (this.options.data) ? this.getPropertyValue(this.options.data.value) : ''
	}
}
</script>