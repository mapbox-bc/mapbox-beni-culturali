<template>
  <div class="container">
    <div class="city-name">
      <slot></slot>
    </div>

    <div class="details">
      <div class="wrapper">
        <h2>{{ detail.label }}</h2>
        <img class="image" :src="detail.preview" alt="Immagine" />
        <p>{{ detail.date }}</p>
      </div>
      <div class="wrapper">
        <h3>Descrizione:</h3>
        <p>{{ detail.description }}</p>
      </div>
      <div class="wrapper">
        <h3>Informazioni Storiche:</h3>
        <p>{{ detail.historicalInformation }}</p>
      </div>
      <div class="wrapper">
        <h3>Materiali e Tecniche:</h3>
        <p>{{ detail.materialAndTechnique }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0;
  text-align: center;
}

h3 {
  font-size: 1.4rem;
  margin: 0.3rem 0;
}

p {
  text-align: justify;
  padding: 1rem;
  margin: 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0.6rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 92%;
  align-items: center;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  color: #333;
  background-color: #f1f5f9;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  transition: box-shadow 0.2s ease;
}
.image {
  max-height: 38vh;
  max-width: 80%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>

<script setup>
const props = defineProps({
  detail: Object,
});
</script>
