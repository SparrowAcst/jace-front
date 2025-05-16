<template>
	<div v-if="options && getPropertyValue">
		<v-autocomplete 
			:value = "(options.data && options.data.value) ? getPropertyValue(options.data.value) : null"
			:label="(options.data) ? getPropertyValue(options.data.label) : ''" 
			:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
			:required="(options.data) ? getPropertyValue(options.data.required) : false"  
			:clearable="(options.data) ? getPropertyValue(options.data.clearable) : false"
			:multiple="(options.data) ? getPropertyValue(options.data.multiple) : false" 
			:auto-select-first = "(options.data) ? getPropertyValue(options.data.autoSelectFirst) : false"

			:items="(options.data) ? getPropertyValue(options.data.items) || [] : [] " 
			:item-text = "(options.data) ? getPropertyValue(options.data['itemText']) || '' : '' "
			:item-value="(options.data) ? getPropertyValue(options.data['itemValue']) || 'item => item' : 'item => item'" 
			:chips = "(options.decoration) ? getPropertyValue(options.decoration.chips) : false"
			:deletable-chips = "(options.decoration) ? getPropertyValue(options.decoration.deletableChips) : false"
			:search-input.sync="search"
			:prepend-icon = "(options.decoration) ? getPropertyValue(options.decoration['prepend-icon']) : ''"
			:color="(options.decoration) ? getPropertyValue(options.decoration.color) : '' "
			:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
			:outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
			:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
			:hide-details="(options.decoration) ? getPropertyValue(options.decoration.hideDetails) : false"
			@change="change"
		>
        </v-autocomplete>
		
	</div>

</template>	

<script>

import { isUndefined } from "lodash"

export default {
	props:["options", "getPropertyValue"],
	

	data: () => ({
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		},
		search:null,
		selection: null
	}),

	methods:{
		updateSelection(options){
			this.selection = (options.data && options.data.value) ? this.getPropertyValue(options.data.value) : null
			console.log("update selection", this.selection)
			
		},
		change(data){
			this.search = null
			this.selection = data
			this.$emit("change",this, data)
		}
	},

	watch:{
		options:{
			handler(val){
				this.selection = this.getPropertyValue(this.options.data.value)
				// if (!val) return
				// if (!this.getPropertyValue) return
				// this.updateSelection(val)	
			},
			deep:true
		},
		// getPropertyValue:{
		// 	handler(val){
		// 		if (!this.options) return
		// 		if (!val) return
		// 		this.updateSelection(this.options)	
		// 	},
		// 	deep:true
		// },

		// selection(){
		// 	this.search = null
		// 	this.$emit("change",this, this.selection)
		// }
	},

	created(){
		this.selection = (this.options.data && this.options.data.value) 
			? this.getPropertyValue(this.options.data.value) 
			: null
	}
}
</script>