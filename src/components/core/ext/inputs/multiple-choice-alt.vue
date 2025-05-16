<template>
	<div 
		:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
		:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" >
		
		<div 
			class="d-flex justify-end" 
			v-if="options && getPropertyValue"
			style="    z-index: 200 !important; position: sticky; height:0px"
		>
			<v-btn 
				v-if = "(options.decoration) ? getPropertyValue(options.decoration.clearable) : false"
				icon
				dense
				x-small 
				@click.stop="clearResponse" 
			>
	              <v-icon>mdi-close</v-icon>
	        </v-btn>
        </div>

		<v-radio-group 
			v-if = "options && options.data" 
			hide-details
			v-model="response" 
			:active-class = "(options.decoration) ? getPropertyValue(options.decoration.activeClass) : ''"
			:disabled = "(options.data) ? getPropertyValue(options.data.disabled) : false" 
			:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
			:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
			:column = "(options.decoration) ? getPropertyValue(options.decoration.column) : true"
			:inline = "(options.decoration) ? getPropertyValue(options.decoration.inline) : false"
			:row = "(options.decoration) ? getPropertyValue(options.decoration.row) : false"
			:messages ="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
			@change = "_inputData"
			style=""
		>
	      
	      <v-radio 
	      	v-for=" (variant, index) in variants" 
	      	:key="variant.label"
	      	:label= "variant.label"
	      	:value= "variant.label"
	      >
		      <template v-slot:label>
				<div
					:class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
					:style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
				>
					<span v-if="!variant.value && variant.value != ''">
					{{ variant.label }}
					</span>
					<v-text-field
						v-else
						class="mt-2"
						ref="input"
						v-model = "variant.value" 
						:value = "variant.value"
						outlined
						dense
						hide-details
						:label="variant.label" 
					
						:readonly="(options.data) ? getPropertyValue(options.data.readonly) : false"
						:disabled = "variant.label != response"
						
						@input="inputData[index]"
						
					></v-text-field>
				</div>
			  </template>	
	      </v-radio>
	    </v-radio-group>
		
	</div>
</template>	

<script>

import { isUndefined, isArray, find } from "lodash"

export default {
	
	props:[ "options", "getPropertyValue" ],

	data: () => ({
		response: "",
		responseValue: "",
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),

	computed:{
		vars() {
			let res = this.getPropertyValue(this.options.data.variants)
			let values = this.getPropertyValue(this.options.data.value)
			if(res && isArray(res)) {
				
				res = res.map((d, index) => {
					let v = this.getPropertyValue(d.split(":"))
					if(v.length == 1) return { variant: d }
					return {
						variant: v[0],
						value: v[1] || ""
					}
				})

				return res
			}	
			return []	
		}
	},


	methods:{

		changeRadio(data){
			console.log("changeRadio", data)
		},
		
		getLabel(variant){
			return variant.variant
		},

		getValue(variant){
			return (variant.value) ? `${variant.variant}:${variant.value}` : variant.variant
		},
		
		_inputDataByVariant(variant){
			return  ( (data, evt) => {
				this._inputData(variant.label)
			})
		},

		_inputData(data,evt){
			
			let f = find(this.variants, v => v.label == data)
			if(isUndefined(f.value)){
				this.$emit("change", this, data)	
			} else {
				this.$emit("change", this, `${f.label}:${f.value}`)
			}
			
		},

		clearResponse(){
			this.$nextTick(() => {
				this.response = ""
				this._inputData( (this.response) ? this.response : undefined )	
			})
		}
	},

	created(){
	
		this.response = this.getPropertyValue( this.options.data.value )
		if(!isUndefined(this.response)){
			this.response = this.response.split(":")
			this.responseValue = this.response[1]
			this.response = this.response[0]
		}

		let res = this.getPropertyValue(this.options.data.variants)
		
		if(res && isArray(res)) {
			
			res = res.map((d, index) => {
				let v = this.getPropertyValue(d.split(":"))
				if(v.length == 1) return { label: d }
				return {
					label: v[0],
					value: (this.response == v[0]) ? this.responseValue : ""
				}
			})
		} else {
			res = []
		}	

		this.variants = res 
		this.inputData = this.variants.map(v => (!isUndefined(v.value)) ? this._inputDataByVariant(v) : this._inputData)

	}

}
</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>