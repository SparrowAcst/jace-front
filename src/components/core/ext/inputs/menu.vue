<template>
	<div v-if="options && getPropertyValue">
		<v-menu offset-y close-on-click>
	        <template v-slot:activator="{ on, attrs }">
	          <v-btn v-if="(options.decoration) ? getPropertyValue(options.decoration.iconOnly) : false"
				icon 
				v-bind="attrs"
	            v-on="on"
	            transition="slide-x-transition"
				:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
			    :color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
			>
		              <v-icon
		              	:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
		              >{{(options.decoration) ? getPropertyValue(options.decoration.icon) : 'mdi-chevron-left-circle-outline'}}</v-icon>
		    </v-btn>	
	        <v-btn    
	            v-else
	            v-bind="attrs"
	            v-on="on"
	            :disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
			    :color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
				:outlined="(options.decoration) ? getPropertyValue(options.decoration.outlined) : false"
				:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
			    :rounded="(options.decoration) ? getPropertyValue(options.decoration.rounded) : false"
		        :text="(options.decoration) ? getPropertyValue(options.decoration.text) : false"
		        :x-small="(options.decoration) ? getPropertyValue(options.decoration.xSmall) : false"
	        	:small="(options.decoration) ? getPropertyValue(options.decoration.small) : false"
	        
	            style="
	              text-transform:none !important;
	              font-weight: inherit !important;
	              letter-spacing: inherit !important;
	              font-size: inherit !important;
	            "
	          >
	            <v-icon v-if="options.decoration && options.decoration.icon" left>
	              {{getPropertyValue(options.decoration.icon)}}
	            </v-icon>
	            {{getPropertyValue(options.decoration.title)}}
	            <v-icon right>
	              {{getPropertyValue(options.decoration.iconRight)}}
	            </v-icon>
	          </v-btn>

	        </template>
	    	<v-list v-if="options.data && options.data.items" dense>
	          <v-list-item
	            v-for="(c, c_index) in getPropertyValue(options.data.items)"
	            :key="c_index"
	            :disabled = "(c.disabled) ? getPropertyValue(c.disabled) : false"
	            @click="resolve(c)"
	          >
	            <div v-if="c.type !== 'divider'" class="flex d-flex align-center">
		            <v-list-item-icon v-if="!!c.icon" class="mr-1">
		              <v-icon v-text="c.icon"></v-icon>
		            </v-list-item-icon>
		            <v-list-item-content>
		              <v-list-item-title v-text="c.title"></v-list-item-title>
		            </v-list-item-content>
		        </div>    
	            <v-divider v-else></v-divider>
	          </v-list-item>
	      	</v-list>
	      </v-menu>

	    </div>  


</template>	

<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";

export default {
	props:["options","getPropertyValue"],

	mixins: [djvueMixin, listenerMixin],
	
	computed:{
		decoration(){
			return ( this.options && this.options.decoration ) ? this.options.decoration : {}
		},
		settings(){
			return ( this.options && this.options.data ) ? this.options.data : {}
		}

	},
	
	methods:{
		resolve(item){
			// console.log("push-menu", item)
			this.$emit("push-menu", item)
		}
	}
}
</script>