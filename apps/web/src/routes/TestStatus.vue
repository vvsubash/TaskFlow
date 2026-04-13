<script setup lang="ts">
import { onMounted, ref } from "vue";
const data = ref<{ ok: boolean } | null>(null);
onMounted(async () => {
  const response = await fetch("/api/health");
  data.value = await response.json();
});
</script>

<template>
  <h1>Test Status {{ data?.ok }}</h1>
</template>
