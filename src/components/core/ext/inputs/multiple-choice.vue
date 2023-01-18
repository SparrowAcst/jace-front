<template>
	<div 
		:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
		:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" >
		
		<!-- <pre class="caption">{{options}}</pre>
		{{getPropertyValue(options.data.value)}}
		<br/>
		RESPONSE
		{{JSON.stringify(response)}} -->
		
		<div 
			class="d-flex justify-end" 
			v-if="options && getPropertyValue"
			style="    z-index: 200 !important; position: sticky; height:0px"
		>
			<v-btn 
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
			:row = "(options.decoration) ? getPropertyValue(options.decoration.row) : false"
			:messages ="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
			@change = "inputData"
			style=""
		>
	      <!-- <template v-slot:label>
	        <div 
	        	v-if="options.data"
	        	v-html="(options.data) ? getPropertyValue(options.data.label) : ''"
	        ></div>	
	      </template> -->
	      
	      <v-radio 
	      	v-for="variant in vars" 
	      	:key="variant"
	      	:label= "variant"
	      	:value= "variant"
	      >
		      <template v-slot:label>
				<div
					:class="(options.decoration) ? getPropertyValue(options.decoration.labelClass) : ''"
					:style="(options.decoration) ? getPropertyValue(options.decoration.labelStyle) : ''"
				>
					{{ (options.data) ? getPropertyValue(variant) : '' }}
				</div>
			  </template>	
	      </v-radio>
	    </v-radio-group>
		
	</div>
</template>	

<script>

import { isUndefined, isArray } from "lodash"

export default {
	
	props:[ "options", "getPropertyValue" ],

	data: () => ({
		response: "",
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),

	computed:{
		vars() {
			let res = this.getPropertyValue(this.options.data.variants)
			if(res && isArray(res)) return res
			return []	
		}
	},
	

	methods:{
		inputData(data){
			this.$nextTick(()=> {
				this.$forceUpdate()
			})
			this.$emit("change", this, data)
		},
		clearResponse(){
			this.$nextTick(() => {
				this.response = ""
				this.inputData( (this.response) ? this.response : undefined )	
			})
		}
	},

	created(){
		this.response = this.getPropertyValue( this.options.data.value )
	}

}
</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>