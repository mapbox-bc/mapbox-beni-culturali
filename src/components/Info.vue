<template>
  <div v-if="!showDetail" class="results-container">
    <h2 class="results-title">
      Risultati per: <span class="province">{{ province }}</span>
    </h2>

    <div class="search-box">
      <label for="search">Cerca per nome:</label>
      <input
        id="search"
        type="text"
        v-model="searchQuery"
        placeholder="Es. Duomo, Castello, Museo..."
      />
    </div>

    <div class="assets-list">
      <div
        class="asset-card"
        v-for="culturalAsset in paginatedAssets"
        :key="culturalAsset.bc"
        @click="
          showDetail = true;
          provinceSelected = culturalAsset;
        "
      >
        <p class="asset-label">{{ culturalAsset.label }}</p>
      </div>
    </div>

    <div class="pagination" v-if="filteredResults.length > itemsPerPage">
      <button @click="prevPage" :disabled="currentPage === 0">
        ← Precedente
      </button>
      <span>Pagina {{ currentPage + 1 }} di {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages - 1">
        Successiva →
      </button>
    </div>
    <p v-if="filteredResults.length === 0" class="no-results">
      Nessun risultato trovato.
    </p>
  </div>

  <div v-else>
    <Detail :detail="provinceSelected">
      <h2 class="results-title">
        Risultati per: <span class="province">{{ province }}</span>
      </h2>
    </Detail>
  </div>
</template>

<style scoped>
.results-container {
  margin: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.results-title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  text-align: center;
}

.province {
  color: #0077cc;
  font-weight: 600;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.asset-card {
  background-color: #f1f5f9;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  transition: box-shadow 0.2s ease;
}

.asset-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.asset-label {
  font-size: 1.1rem;
  color: #333;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

button {
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #005fa3;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #ccc;
}

.search-box {
  margin-bottom: 1rem;
  text-align: center;
}

.search-box input {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  width: 80%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.search-box label {
  display: block;
  font-weight: 600;
  color: #333;
}

.no-results {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 2rem;
}
</style>

<script setup>
import { ref, computed, watch } from "vue";
import Fuse from "fuse.js";
import Detail from "./Detail.vue";

const props = defineProps({
  province: String,
  culturalAssets: Array,
});

const currentPage = ref(0);
const itemsPerPage = 10;
const showDetail = ref(false);
const searchQuery = ref("");
const filteredResults = ref([]);
let provinceSelected = null;

watch(
  () => props.culturalAssets,
  () => {
    filteredResults.value = props.culturalAssets;
    currentPage.value = 0;
  },
  { immediate: true }
);

watch(searchQuery, (query) => {
  if (!query) {
    filteredResults.value = props.culturalAssets;
  } else {
    const fuse = new Fuse(props.culturalAssets, {
      keys: ["label"],
      threshold: 0.3,
    });
    filteredResults.value = fuse.search(query).map((res) => res.item);
    currentPage.value = 0;
  }
});

const totalPages = computed(() => {
  return Math.ceil(filteredResults.value.length / itemsPerPage);
});

const paginatedAssets = computed(() => {
  const start = currentPage.value * itemsPerPage;
  return filteredResults.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value - 1) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 0) currentPage.value--;
}
</script>
