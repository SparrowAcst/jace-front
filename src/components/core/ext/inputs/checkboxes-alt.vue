<template>
	<div class="dj-checkboxes">
		<div 
			v-if="options && options.data"
			:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
			:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" 
		>
			<v-checkbox   	
				v-for="(variant, index) in variants"
				:key="index"
				hide-details
				v-model="selection[index]" 
				:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
				:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
				:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
				:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
				:inset="(options.decoration) ? getPropertyValue(options.decoration.inset) : false"
				:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
				:messages="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
				 
				@change="inputData"
			>
				<template v-slot:label>
					<div
						:class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
						:style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
					>
					<span v-if="!vals[index] && vals[index] != ''">
						{{ (options.data) ? getPropertyValue(variant.label) : '' }}
					</span>
					<v-text-field
						class="mt-2"
						v-else
						ref="input"
						v-model="variant.value" 
						:value = "variant.value"
						outlined
						dense
						hide-details
						:label="(options.data) ? getPropertyValue(variant.label) : ''" 
					
						:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
						
						@input="inputData"
						@focus="focus"
						
					></v-text-field>	
					</div>
				</template>	
			</v-checkbox>
		</div>
	</div>
</template>	

<script>

import { isUndefined, isArray, isString, findIndex, find } from "lodash"

export default {
	
	props:[ "options", "getPropertyValue" ],

	data: () => ({
		selection: [],
		variants:[],
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),

	computed:{
		vars() {
			let res = this.getPropertyValue(this.options.data.variants)
			if(res && isArray(res)) return res.map(d => d.split(":")).map(d => d[0].trim())
			return []	
		},

		vals() {
			let res = this.getPropertyValue(this.options.data.variants)
			if(res && isArray(res)) {
				return res.map(d => d.split(":")[1])
			}	
			return []	
		}
	},
	
	methods:{
		
		inputData(data){
			let res = this.getPropertyValue(this.variants)
				.map( d => {
					if(!d.value) return d.label
					return `${d.label}:${d.value}`	
				})
				.filter( (d, index) => this.selection[index])
			
			this.$emit("change", this, res)
		},

		focus(event){
			this.$emit("focus", this.$refs.input)
		}

	}, 


	created(){
		if(this.options.data){
			let resp = this.getPropertyValue(this.options.data.value) || []
			resp = (isArray(resp)) ? resp : [resp]

			let variants = this.getPropertyValue(this.options.data.variants || [])
			
			if(variants && isArray(variants)){
				resp = resp.map(d => {
					let arr = d.split(":")
					if (arr.length == 1) return { label: arr[0]}
					return {label: arr[0], value: arr[1] || ""}	
				})
				
				let vars = variants.map( d => {
					let arr = d.split(":")
					if (arr.length == 1) return { label: arr[0]}
					let f = find(resp, d => d.label == arr[0])
					let value = (f) ? f.value : ""
					return {label: arr[0], value}	
				})

				let selection = vars.map(d => resp.map(d => d.label).includes(d.label))
				this.selection = selection
				
				let values = vars.map(d => d.value)
				
				this.variants = vars
			} 	
		}
	}
}
</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>