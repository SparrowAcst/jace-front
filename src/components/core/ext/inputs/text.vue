<template>
	<div v-if="options && getPropertyValue">
		<v-text-field 
			ref="input"
			:v-model="(options.data && options.data.value) ? getPropertyValue(options.data.value) : null" 
			:value = "(options.data && options.data.value) ? getPropertyValue(options.data.value) : null"
			:label="(options.data) ? getPropertyValue(options.data.label) : ''" 
			
			:hint="(options.data) ? getPropertyValue(options.data.hint) : ''"
			:persistent-hint="(options.data) ? getPropertyValue(options.data.hint) : false" 


			:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
			:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false" 
			
			:required="(options.data) ? getPropertyValue(options.data.required) : false"  
			:clearable="(options.data) ? getPropertyValue(options.data.clearable) : false"
			
			:rules="(options.data && options.data.required) ? [rules.required] : []"
			
			:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
			:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
			:outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
			:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
			:hide-details="(options.decoration) ? getPropertyValue(options.decoration.hideDetails) : false"
			:prepend-icon="(options.decoration) ? getPropertyValue(options.decoration.prependIcon) || '' : ''" 

			@input="inputData"
			@focus="focus"
			
		></v-text-field>
		
	</div>
</template>	

<script>

import { isUndefined } from "lodash"

export default {
	props:["options","getPropertyValue"],
	data: () => ({
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),
	methods:{
		inputData(data){
			this.$emit("change", this, data)
		},

		focus(event){
			// console.log("FOCUS TEXT", event)
			this.$emit("focus", this.$refs.input)
		}
	}
}
</script>