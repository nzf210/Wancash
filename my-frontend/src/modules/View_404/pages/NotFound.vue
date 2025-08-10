<template>
  <div class="not-found">
    <h1>404 - Halaman Tidak Ditemukan</h1>
    <p>Maaf, halaman yang Anda cari tidak ada.</p>
    <router-link to="/">Kembali ke Beranda</router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
  margin-top: 3rem;
}

.not-found h1 {
  color: #ff4444;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.not-found a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.not-found a:hover {
  background-color: #3aa876;
}
</style>
