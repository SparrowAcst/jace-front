<template>
	<div :class="{'v-responsive v-image':!error,'v-responsive':error}">
		<v-img v-show="!error" :src="src" v-bind="$attrs" :error="onError" :load="onLoad"></v-img>
		<v-icon v-show="error" v-bind="$attrs" style="margin:auto;">{{icon}}</v-icon>
	</div>	
</template>	

<script>
	export default {
		inheritAttrs: false,
		props:["src","icon"],
		data: ()=>({
			error: true
		}),
		methods:{
			onError(e){
				// console.log("ERROR", JSON.stringify(this.src), e)
				this.error = true
			},
			onLoad(){
				// console.log("SUCCESS", this.src)
				this.error = false	
			}
		},
		watch:{
			src(newValue){
				// this.error = true
				// let img = new Image()
				
				// img.onerror = this.onError
				// img.onload = this.onLoad
				// img.src = newValue
			}
		},

		created(){
			let img = new Image()
			
			img.onerror = this.onError
			img.onload = this.onLoad
			img.src = this.src
		}

	}
</script>