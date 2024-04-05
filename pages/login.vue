<script setup>
import { ref } from "vue";
const supabase= useSupabaseClient()
const flag = ref(true);


const submitted = ref(false);

//------------------------------------------Login-------------------------------------
async function signInWithEmail(form) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })
  console.log('data', data);  console.log('error', error);
  if(!error){
    console.log('login'); 
    navigateTo("/")
  }
  else{
    console.log('login first'); 
    alert('enter the correct email and password')
  }

}   

//--------------------------------------loginWithMagicLink-----------------------------------------

async function loginWithMagicLink(formData) {
  console.log(formData)
  const { data, error } = await supabase.auth.signInWithOtp({
    email: formData.email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: false,
      // emailRedirectTo: data,
    },
  })
  console.log('data', data);  console.log('error', error);
  if(!error){
    console.log('login'); 
    navigateTo("/")
  }
  else{
    console.log('loginfirst'); 
    alert('enter the correct email and password')
  }

}

//-----------------------------------------------------LINKED IN-------------------------------------------
async function signInWithLinkedIn(formData) {
    console.log(formData);
    console.log('LINKEDIN');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
  })
  console.log('data', data);  console.log('error', error);
if(data){
  console.log('data', data); 
    navigateTo("/")
  }
}


</script>

<template>
<div class="w-full h-screen flex flex-col justify-center items-center bg-gray-100" >
  <div class="w-3/4 h-max max-w-md p-6 bg-white border border-gray-300 rounded-lg">
      
    <FormKit
        type="form"
        id="registration-example"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Register"
        @submit="signInWithEmail"
        :actions="false"
        #default="{ value }"
        v-if="flag"
      >
        <h1 class="text-2xl font-bold mb-2 text-center">Login</h1>
        <FormKit
          type="text"
          name="email"
          label="Your email"
          placeholder="jane@example.com"
          help="What email should we use?"
          validation="required|email"
        />

        <FormKit
            type="password"
            name="password"
            label="Password"
            validation="required|length:6|matches:/[^a-zA-Z]/"
            :validation-messages="{
              matches: 'Please include at least one symbol',
            }"
            placeholder="Your password"
            help="Choose a password"
        />
         <FormKit type="submit" label="Login" />
    </FormKit>

    <!-- -------------------------------------------------------------------------------->

    <FormKit
        type="form"
        id="git-example"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Register"
        @submit="loginWithMagicLink"
        :actions="false"
        #default="{ value }"
        v-else
      >
        <h1 class="text-2xl font-bold mb-2 text-center">Login Through MagicLink</h1>
        <FormKit
          type="text"
          name="email"
          label="Your email"
          placeholder="jane@example.com"
          help="What email should we use?"
          validation="required|email"
        />

         <FormKit type="submit" label="Login" />
    </FormKit>

<div class="flex items-center justify-center">
  <div class="h-0.5 bg-gray-400 w-1/2"></div>
  <span class="mx-2 text-gray-400">or</span>
  <div class="h-0.5 bg-gray-400 w-1/2"></div>
</div>

    <div class="flex justify-between pl-16">
        <FormKit type="submit" label="Linkedin" @click="signInWithLinkedIn"/>
        <FormKit type="submit" label="Magic Link" @click="flag = !flag"/>
    </div>    
    <NuxtLink class="flex justify-center pl-5" to="/signup">New user? Signup</NuxtLink>

</div>

  </div>
</template>
