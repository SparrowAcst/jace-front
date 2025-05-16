<template>
	<div v-if="options && getPropertyValue"
		:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''"      
	    :style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''"      
	>
		<div class="d-flex justify-end">{{note}}</div>
		<v-progress-linear
	      v-model="model"
	      :color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
	      :background-color="(options.decoration) ? getPropertyValue(options.decoration.backgroundColor) : ''"
	      :reverse="(options.decoration) ? getPropertyValue(options.decoration.reverse) : true"
	      width = "100%"
	    >
	    </v-progress-linear>

	</div>

</template>	

<script>
import moment from "moment"
export default {
	
	props:["options","getPropertyValue"],
	
	data: () => ({
		model: null,
		note: ""
	}),

	methods:{
		stop(){
			if(this.interval){
				clearInterval(this.interval)	
			}
		}
	},

	created(){
		
		let d = (this.options.data) ? this.getPropertyValue(this.options.data.duration) : "10 seconds"
		d = d.split(" ")
		
		let duration = moment.duration(d[0], d[1])
		let current = duration.clone()
		let bin = moment.duration( 1, d[1] ).asMilliseconds()
		
		if( Number.parseInt(d[0]) < 5 ){
			bin = Math.round(bin / 2)
		}
        
		this.model = 100 * current.asMilliseconds() / duration.asMilliseconds()
		this.note = `Time left ${current.humanize()}`
		

		this.interval = setInterval(() => {
			current.subtract(bin)
		
			this.model = 100 * current.asMilliseconds() / duration.asMilliseconds()
			this.note = `Time left ${current.humanize()}`
			if( current.asMilliseconds() <= 0 ){
				clearInterval(this.interval)
				this.note = `Time is up`
				this.$emit("push-button", this)
			}
		}, bin)
	}
	
}
</script>