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
					
					readonly 
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
            		@click:clear = "clearValue"
            	
            	></v-text-field>
            </template>
            
            <v-date-picker 
              v-model="valueModel" 
              :min="(options.data) ? getPropertyValue(options.data.min) : false"
              :max="(options.data) ? getPropertyValue(options.data.max) : false"
              no-title
            ></v-date-picker>
        
        </v-menu>
		
	</div>

</template>	

<script>

import { isUndefined, isFunction } from "lodash"
import moment from "moment"


export default {
	props:["options","getPropertyValue"],
	
	data: () => ({
		menu:false,
		value: null
	}),

	computed:{

		valueModel: {
			
			get(){
				return (this.value) ? moment(this.value).format("YYYY-MM-DD") : ""
			},

			set(value){
				this.value = new Date(value)
				this.changeDateRange()
			}
		},

		displayedValue: {
			
			get(){
				if(!this.value) return ""
		      	return moment(this.value).format(this.getDateFormat())
			}	
		
		}
			
	},


	methods:{

		getDateFormat(){
			if(!this.options || !this.options.data || !this.options.data.format) return "DD MMM, YYYY"
			return this.options.data.format
		},
		
		changeDateRange(){
	      this.menu = false
	      this.$emit("change", this, this.value)
	    },

	    clearValue(){
	      this.value = null
	      this.changeDateRange()	
	    }

	},

	
	created(){
		this.value = this.getPropertyValue(this.options.data.value) 
		// console.log("DATE CREATED", this.options.data.value, this.getPropertyValue(this.options.data.value))
	}
}
</script>