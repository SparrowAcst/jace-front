<template>
	<div class="dj-checkboxes">
		<div 
			v-if="options && options.data"
			:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
			:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" >
			<div v-if="getPropertyValue(options.data.showControl)"
				style="margin: 0 0 5px !important" 
			>
				<v-checkbox 
					:indeterminate="selection.filter(s => s).length != selection.length && selection.filter(s => s).length > 0"
					v-model="control"
					hide-details
					:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
					:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
					:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
					:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
					:inset="(options.decoration) ? getPropertyValue(options.decoration.inset) : false"
					:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
					:messages="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
					@change="changeSelection"
					style="margin: 0 0 5px !important" 
				>
					<template v-slot:label>
						<div
							class="font-weight-bold"
							:class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
							:style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
						>
							{{(options.decoration) ? getPropertyValue(options.decoration.title) : ""}}
						</div>
					</template>
				</v-checkbox>
				<v-divider></v-divider>
			</div>	
			<v-checkbox   	
				v-for="(variant, index) in vars"
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
						{{ (options.data) ? getPropertyValue(variant) : '' }}
					</div>
				</template>	
			</v-checkbox>

		</div>
	</div>
</template>	

<script>

import { isUndefined, isArray } from "lodash"

export default {
	
	props:[ "options", "getPropertyValue" ],

	data: () => ({
		selection: [],
		control: null,
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),

	computed:{
		vars() {
			let res = this.getPropertyValue(this.options.data.variants)
			if(res && isArray(res)){
				res = res
			} else {
				res = []
			}	

			let resp = this.getPropertyValue(this.options.data.value) || []
			let selection = res.map(d => resp.includes(d))
			this.selection = selection
			
			return res	
		}
	},
	
	methods:{
		
		inputData(data){
			this.$emit("change", this, this.getPropertyValue(this.options.data.variants).filter( (d,index) => this.selection[index]))
		},

		changeSelection(data){
			for(let i=0; i< this.selection.length; i++){
				this.selection[i] = data	
			}
			// this.$forceUpdate()
			this.inputData()
		},

	}, 


	created(){
		if(this.options.data){
			let resp = this.getPropertyValue(this.options.data.value) || []
			let variants = this.getPropertyValue(this.options.data.variants || [])
			if(variants && isArray(variants)){
				let selection = variants.map(d => resp.includes(d))
				this.selection = selection
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