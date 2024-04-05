<script setup>
import { ref } from "vue";
const supabase= useSupabaseClient()
const submitted = ref(false);
const submitHandler = async (data) => {
  console.log(data);
};

async function signUpNewUser(form) {
      console.log('form', form);
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    
  })
  console.log('data', data);  console.log('error', error);
  alert("SignUp successful")
}

definePageMeta({
  middleware: ["auth"],
});

</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center bg-gray-100" >
    <div class="max-w-md p-6 bg-white border border-gray-300 rounded-lg">
      
      <FormKit
        type="form"
        id="registration-example"
        :form-class="submitted ? 'hidden' : 'block'"
        submit-label="Register"
        @submit="signUpNewUser"
        :actions="false"
        #default="{ value }"
        class="w-full"
      >
        <h1 class="text-3xl font-bold mb-4 text-center text-black">Signup</h1>
        <FormKit
          type="text"
          name="name"
          label="Your name"
          placeholder="Enter Your Name"
          help="What do people call you?"
          validation="required"
          class="mb-4"
        />
        <FormKit
          type="text"
          name="email"
          label="Your email"
          placeholder="jane@example.com"
          help="What email should we use?"
          class="mb-4"
        />
        <div class="flex justify-between">
          <FormKit
            type="password"
            name="password"
            label="Password"

            placeholder="Enter Your password"
            help="Choose a password"
            class="w-full md:w-1/2 md:mr-2"
          />
          <FormKit
            type="password"
            name="password_confirm"
            label="Confirm password"
            placeholder="Confirm password"

            help="Confirm your password"
            class="w-full md:w-1/2"
          />
        </div>

        <FormKit
          type="submit"
          label="SignUp"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        />
      </FormKit>
      
    <NuxtLink to="/Login">Alredy have account?Login</NuxtLink>
    </div>
  </div>
</template>
