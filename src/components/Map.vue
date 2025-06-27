<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import provincesGeojson from "../utils/provinces.json";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default {
  data() {
    return {
      map: null,
    };
  },

  mounted() {
    this.initMap();
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },

  methods: {
    initMap() {
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        center: [12.5, 41.9], // Centro Italia
        zoom: 5,
        maxBounds: [
          [5.0, 34.0],
          [21.0, 48.5],
        ],
      });

      this.map.on("load", () => this.setupMapLayers());
    },

    setupMapLayers() {
      this.map.addSource("provinces", {
        type: "geojson",
        data: provincesGeojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 40,
      });

      this.map.addLayer({
        id: "clusters",
        type: "circle",
        source: "provinces",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            10,
            "#f1f075",
            30,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      this.map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "provinces",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 14,
        },
        paint: {
          "text-color": "#000",
        },
      });

      this.map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "provinces",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      this.registerMapEvents();
    },

    registerMapEvents() {
      this.map.on("click", "unclustered-point", (e) => {
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice();
        const { name } = feature.properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${name}</strong>`)
          .addTo(this.map);

        this.map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 10,
          essential: true,
        });

        this.$emit("provinceSelected", name);
      });

      this.map.on("click", "clusters", async (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;

        const clusterId = features[0].properties.cluster_id;

        try {
          const zoom = await new Promise((resolve, reject) => {
            this.map
              .getSource("provinces")
              .getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) reject(err);
                else resolve(zoom);
              });
          });

          this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom,
          });
        } catch (err) {
          console.error("Errore espansione cluster:", err);
        }
      });

      const setCursor = (cursor) => {
        this.map.getCanvas().style.cursor = cursor;
      };

      ["clusters", "unclustered-point"].forEach((layer) => {
        this.map.on("mouseenter", layer, () => setCursor("pointer"));
        this.map.on("mouseleave", layer, () => setCursor(""));
      });
    },
  },
};
</script>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 40vw;
  width: 60%;
  max-width: 60vw;
  height: 100vh;
  outline: 3px solid #1a2224;
}

.mapboxgl-marker {
  cursor: pointer;
}

.mapboxgl-popup-content {
  outline: 2px solid #0077cc;
  background: white;
  color: #1a2224;
  font-family: sans-serif;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  box-shadow: 2px 4px 4px #00000057;
  font-size: 1.4rem;
  font-weight: 400;
  padding: 1.4rem;
}
.mapboxgl-popup-close-button {
  font-size: 1.2rem;
}
</style>
