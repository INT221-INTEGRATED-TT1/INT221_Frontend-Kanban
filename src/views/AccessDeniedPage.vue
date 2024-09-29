<script setup>

</script>
 
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p class="text-lg text-gray-700 mb-6">
        Sorry, you don't have permission to access this page.
      </p>
      <router-link
        to="/"
        class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Go Back to Home
      </router-link>
    </div>
  </div>
</template>
 
<style scoped>

</style>