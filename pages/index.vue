<template>
  <div class="flex justify-end items-center p-2">
    <div>
      <FormKit @click="signOut" type="submit" label="Signout" />
    </div>
  </div>
  <div class="flex flex-col items-center mt-36">
    <button @click="navigateTo('humanToDo')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded mb-4">Add Todo</button>
    <button @click="navigateTo('aiToDo')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-8 rounded">AI will Add Todo</button>
  </div>
</template>

<script setup>
 const user = useSupabaseUser();
 const supabase = useSupabaseClient();
async function signOut() {
   const { error } = await supabase.auth.signOut();
   console.log("errro");
   if (!error) {
     navigateTo("/login");
   }
 }

 definePageMeta({
   middleware: ["auth"],
 });  
</script>