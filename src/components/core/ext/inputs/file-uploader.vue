<template>
	<div
		:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
		:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''"
	>	
		
		<v-file-input 
			v-if = "(options.data) ? !getPropertyValue(options.data.uploadProcess) : true"
			type="file"
			:model="fls"
			:accept="(options.data) ? getPropertyValue(options.data.accept) : ''"
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

		<div 
			v-else
			class="px-3 pt-2 pb-3"
			style="    
				border: 1px solid #bdbdbd;
			    border-radius: 4px;
			    background: #F5F5F5;"
		>
			<div v-for="(upload, index) in upls" :key="index" class="mt-2">
				<div class="caption mb-1" style="line-height:0.9;">
					{{upload.name}} {{upload.value}}%
				</div>

				<v-progress-linear 
					:value = "upload.value"
					:buffer-value= "upload.bufferValue"
					:stream = "upload.stream || false"
					:indeterminate = "upload.indeterminate || false"
					:color = "upload.color || 'primary'"
					:height="(options.decoration && options.decoration.progress) ? getPropertyValue(options.decoration.progress.height) || 3 : 3"
				>	
				</v-progress-linear>	
			
			</div>	
		</div>	

	</div>

</template>	

<script>

import { isUndefined, isArray } from "lodash"

export default {
	props:["options","getPropertyValue"],
	
	data: () => ({
		files:[],
		uploads:[]
	}),

	computed:{
		fls() {
			let res = this.getPropertyValue(this.options.data.value)
			if(res && isArray(res)) return res
			return []	
		},
		
		upls() {
			let res = this.getPropertyValue(this.options.data.uploads)
			if(res && isArray(res)) return res
			return	
		}

	},	


	methods:{
		fileChanged(file) {
	      this.files = file
	      this.$emit("select-files", this, this.files)
	    }
	},


	created(){
		
		this.uploads = this.getPropertyValue(this.options.data.uploads) || []
		this.uploads = (isArray(this.uploads)) ? this.uploads : []
		this.files = this.getPropertyValue(this.options.data.value) || []
		this.files = (isArray(this.files)) ? this.files : []

	}
}
</script>