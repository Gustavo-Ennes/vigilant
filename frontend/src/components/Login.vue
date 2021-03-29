<template>
	<b-container fluid class='bg-dark vh-100'>
		<b-row align-v="center" align-h="center">
	        <b-col cols="12">
	          	<h1 class='display-3 logo logoPlace'>vigilant</h1>
	        </b-col>
	        <b-col cols="12">
	          <b-icon
	            class="w-100 text-center mt-2"
	            icon="binoculars"
	            animation="null"
	            font-scale="4"
	            :variant="'light'"
	            :rotate="'180'"
	          ></b-icon>
	        </b-col>
	      </b-row>

		<b-row align-v='center' align-h='center'>
			<b-col lg='4'>
				<b-card :sub-title-text-variant="'danger'" title='Login' :sub-title='subTitle' class='form'>
					<b-card-body>
						<b-form-group
				        id="input-group-1"
				        label="Name:"
				        label-for="input-1"
				        description="We'll never share your data with anyone else."
				      	>
					        <b-form-input
					          id="input-1"
					          v-model="name"
					          type="email"
					          placeholder="Enter name"
					          required
					        ></b-form-input>
				      </b-form-group>
				      <b-form-group
				        id="input-group-2"
				        label="Password:"
				        label-for="input-2"
				      	>
					        <b-form-input
					          id="input-2"
					          v-model="pass"
					          type="password"
					          placeholder="Enter password"
					          required
					        ></b-form-input>
				      </b-form-group>
				      <b-overlay
					    :show="isLoading"
					    :variant="'dark'"
					    :blur="'5px'"
					    :opacity="'0.9'"
					  >
				      	<b-button variant='secondary' @click="handleClick" block>Log In </b-button>
				      </b-overlay>
					</b-card-body>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default{
	name:'Login',
	data(){
		return {
			name: '',
			pass: '',
			subTitle: '',
			isLoading: false,
			formError: false,
		}
	},
	computed: {
		payload(){
			return {name: this.name, pass: this.pass}
		}
	},
	methods: {
		async handleClick(){
			if(this.isFormValid()){
				this.isLoading = true
				let res = await fetch(`${this.$store.getters.getURL()}/login`, {
			        method: "POST",
			        headers: {
			          "Content-Type": "application/json;charset=utf-8",
			        },
			        body: JSON.stringify(this.payload),
			      });
				let content = await res.json()
				if(content.user !== null){
					this.$store.commit("set", {type: 'u', object: content.user})
				}else{
					this.formError = true
					this.subTitle = "Wrong username or pass"
				}
				this.clearForm()
				this.isLoading = false
			}else{
				this.formError = true
				this.subTitle = "Check if the name and pass are filled"
			}

		},
		clearForm(){
			this.name = ''
			this.pass = ''
			// this.subTitle = ''
			// this.formError = false
		},
		isFormValid(){
			return this.name !== '' && this.pass !== ''
		}
	}
};

</script>

<style scoped>
	.logoPlace{
		margin-top: 40px !important;
	}
	.form{
		margin-top:40px;
	}
</style>