<template>
	<div v-if="options && getPropertyValue">

		<v-menu 
			v-model="menu" 
			:close-on-content-click="false" 
			:nudge-right="40" 
			transition="scale-transition" 
			offset-y 
			dense
			min-width="290px"
		>
        
            <template v-slot:activator="{ on, attrs }">
              	<v-text-field 
	              	:value = "displayedValue"
					:label="(options.data) ? getPropertyValue(options.data.label) : ''" 
					:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
					:readonly="false" 
					
					:required="(options.data) ? getPropertyValue(options.data.required) : false"  
					:clearable="(options.data) ? getPropertyValue(options.data.clearable) : false"
					
					:rules="(options.data && options.data.required) ? [rules.required] : []"
					
					:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
					:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
					:outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
					:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
					:hide-details="(options.decoration) ? getPropertyValue(options.decoration.hideDetails) : false"
	              	prepend-icon="event" 
	              	v-bind="attrs"
            		v-on="on"
            		@change="changeView"
	        	
            	></v-text-field>
            </template>
            
            <v-date-picker 
              v-model="value" 
              @change="changeDateRange()"
              :min="(options.data) ? getPropertyValue(options.data.min) : false"
              :max="(options.data) ? getPropertyValue(options.data.max) : false"
              range
              no-title
            ></v-date-picker>
        
        </v-menu>
		
	</div>

</template>	

<script>

import { isUndefined } from "lodash"
import moment from "moment"

export default {
	props:["options","getPropertyValue"],
	
	data: () => ({
		menu:false,
		value:[]
	}),

	computed:{

		displayedValue:{
			
			get(){
				if(!this.value) return ""
				let res = (this.value) ? this.value.join(" ~ ") : null
				res = (res) ? res : null
		      	return res
			},

			set(value){
				console.log("SET", value)
				if(!value){
					this.value = []
					this.changeDateRange()
				}
			}

		}		
	},

	// watch:{
	// 	value: (newValue, oldValue) => {
	// 		console.log("NEW", newValue, "OLD", oldValue)
	// 	}
	// },

	methods:{
		
		changeDateRange(){
	      this.menu = false
	      if( this.value.length == 2 && moment(this.value[0]).isAfter(moment(this.value[1])) ) this.value.reverse()
	      this.$emit("change", this, this.value)
	    },

	    changeView(data){
	    	console.log("CHANGE VIEW", data)
	    	if(!data){
				this.value = []
				this.changeDateRange()
			}
	    }

	},

	
	created(){
		this.value = this.getPropertyValue(this.options.data.value) 
	}
}
</script>