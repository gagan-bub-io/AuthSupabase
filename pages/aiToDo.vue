<template>
    <div class="flex justify-end items-center p-2">
        <div>
            <FormKit @click="signOut" type="submit" label="Signout" />
        </div>
    </div>

    <h1 class="text-3xl font-bold mb-4">AI will Generat Todo List</h1>

    <div class="flex items-center">
        <input type="text" id="todoInput" v-model="promptText" placeholder="enter your prompt......"
            class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
        <button @click="generateContent" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Generate</button>
    </div>
    
    <div class="flex flex-col">
        <div v-if="generatedText" class="flex-shrink-0 w-full max-w-[50%] overflow-hidden">
            {{ generatedText }}<br>
            <button @click="generateContent" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">ReGenerate</button>
            <button @click="Add" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Add</button>
        </div>
        <span v-if="generatedText" class=" font-bold mt-2">Want to enter manually <button @click="navigateTo('/humanToDo')" class="ml-2 text-blue-500">Manual ToDo</button></span>
    </div>



    <!-- Display todo content -->
    <ul class="w-full max-w-md float-right mr-96">
        <h1 class="text-4xl font-bold">Your Task's</h1>
        <li v-for="(todo, index) in todos" :key="index"
            class="flex items-center justify-between border border-gray-300 rounded p-2 mb-2">
            <span class="w-full overflow-hidden break-words mr-4">{{ todo.Task }}</span>
            <button @click="deleteTodo(todo, index)" class=" hover:text-red-700 cursor-pointer">x</button>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GoogleGenerativeAI } from "@google/generative-ai";
const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.public.apiKey);
const generatedText = ref(null);
const promptText = ref("");

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const loading = ref(false)

const todos = ref([]);
const todo = ref('');
const flag = ref(true);

//-----------------AI TODO----------------------
async function generateContent() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(promptText.value);
    const response = await result.response;
    const text = await response.text();
    console.log('text', text);
    generatedText.value = text;
}

const Add = async () => {
    todo.value = generatedText.value
    if (todo.value.trim() !== '') {

        const { data, error } = await supabase
            .from('ToDoTable')
            .insert([{ user_id: user.value.id, Task: todo.value },
            ])
            .select();
        todos.value = data || [];

        //todos.value.push(todo.value.trim());
        todo.value = '';
        showAllTasks()
    }
};


const showAllTasks = async () => {
    let { data, error } = await supabase
        .from("ToDoTable")
        .select("*")
        .eq("user_id", user.value.id);
    if (error) {
        console.error('Error fetching todos:', error.message);
    } else {
        console.log('data', data);
        todos.value = data || [];
    }
};
await showAllTasks()
onMounted(showAllTasks);


const deleteTodo = async (todo, index) => {
    console.log('todo', todo);


    const { data, error } = await supabase
        .from('ToDoTable')
        .delete()
        .eq('id', todo.id)
    console.log('data', data);
    todos.value.splice(index, 1);
};

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        navigateTo("/login");
    }
}
definePageMeta({
    middleware: ["auth"],
});
</script>