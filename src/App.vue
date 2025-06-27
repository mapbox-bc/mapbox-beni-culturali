<template>
  <div class="layout">
    <!-- Colonna sinistra -->
    <div class="sidebar">
      <div class="header">
        <h1
          @click="
            province = null;
            data = [];
          "
        >
          Beni Culturali in Italia
        </h1>
      </div>
      <div v-if="!province" :key="province">
        <p class="tip">Clicca su una provincia per visualizzarne i dettagli.</p>

        <div class="main-cities">
          <div
            class="city-card"
            v-for="city in [
              'Roma',
              'Milano',
              'Napoli',
              'Torino',
              'Firenze',
              'Bologna',
              'Palermo',
              'Venezia',
              'Cagliari',
            ]"
            :key="city"
            @click="handleProvinceSelected(city)"
          >
            <h2>{{ city }}</h2>
            <p>Dettagli sulla città di {{ city }}.</p>
          </div>
        </div>
      </div>

      <Info
        v-if="province"
        :key="province"
        :province="province"
        :culturalAssets="data"
      />
    </div>

    <!-- Colonna destra -->
    <div class="map-container">
      <Map @provinceSelected="(province) => handleProvinceSelected(province)" />
    </div>
  </div>

  <div id="loading-overlay" class="hidden">
    <div class="dot-loader"><span></span><span></span><span></span></div>
  </div>
</template>

<style scoped>
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: all;
}

#loading-overlay.hidden {
  display: none;
}

.dot-loader span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 5px;
  background-color: #333;
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out both;
}

.dot-loader span:nth-child(1) {
  animation-delay: 0s;
}
.dot-loader span:nth-child(2) {
  animation-delay: 0.2s;
}
.dot-loader span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.layout {
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Colonna sinistra */
.sidebar {
  width: 40%;
  overflow-y: auto;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
}

.header {
  margin: 1.6rem;
}

.header h1 {
  margin: 0;
  width: fit-content;
  font-size: 2rem;
  color: #0077cc;
  cursor: pointer;
}

.tip {
  font-size: 1.1rem;
  color: #666;
  margin-left: 2rem;
}

.main-cities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 2rem;
}

.city-card {
  background: #f5f5f5;
  padding: 0.8rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
  text-align: center;
}

.city-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.city-card h2 {
  font-size: 1.2rem;
  color: #0077cc;
  margin-bottom: 0.3rem;
}

/* Colonna destra (mappa) */
.map-container {
  width: 60%;
  height: 100vh;
  overflow: hidden;
}

.map-container > * {
  width: 100%;
  height: 100%;
}
</style>

<script setup>
import { ref } from "vue";
import Map from "./components/Map.vue";
import Info from "./components/Info.vue";
import fetchData from "./api/sparql.js";

const province = ref(null);
const data = ref([]);

function setLoading(isLoading) {
  const overlay = document.getElementById("loading-overlay");
  if (isLoading) overlay.classList.remove("hidden");
  else overlay.classList.add("hidden");
}

function handleProvinceSelected(markedProvince) {
  province.value = markedProvince;
  setLoading(true);

  fetchData(
    markedProvince
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/'/g, "")
      .replace(/ì/g, "i")
  )
    .then((result) => {
      console.log(result);
      data.value = result;
    })
    .catch((err) => console.error("Error fetching SPARQL data:", err))
    .finally(() => {
      setLoading(false);
    });
}
</script>
