<template>
  <div class="rating-container">
    <div class="average-rating" v-if="loading">
      <span>Lade Bewertung...</span>
    </div>
    <div class="average-rating" v-else>
      <div v-if="averageRating !== null">
        <span class="average-text">Durchschnittliche Bewertung: </span>
        <div class="stars-display">
          <span
            v-for="star in 5"
            :key="star"
            :class="{ 'filled': star <= averageRating }"
            class="star"
          >
            ★
          </span>
        </div>
        <span class="rating-value">{{ averageRating.toFixed(1) }}</span>
        <span class="count">({{ ratingCount }} Bewertungen)</span>
      </div>
      <div v-else>
        <span class="no-rating">Noch keine Bewertungen vorhanden.</span>
      </div>
    </div>

    <div class="user-rating-section">
      <span class="rate-text">Bewerte diese Folge:</span>
      <div class="stars-input">
        <span
          v-for="star in 5"
          :key="star"
          @click="submitRating(star)"
          class="star-input"
          :class="{ 'hovered': star <= userHoverRating, 'active': star <= userRating }"
          @mouseenter="userHoverRating = star"
          @mouseleave="userHoverRating = 0"
        >
          ★
        </span>
      </div>
    </div>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  folgenID: {
    type: String,
    required: true,
  },
});

const averageRating = ref(null);
const ratingCount = ref(0);
const userRating = ref(0);
const userHoverRating = ref(0);
const loading = ref(true);
const message = ref('');

const fetchRating = async () => {
  loading.value = true;
  message.value = '';
  try {
    const response = await axios.get(`/api/ratings/${props.folgenID}`);
    averageRating.value = response.data.averageRating;
    ratingCount.value = response.data.ratingCount;
  } catch (error) {
    console.error('Fehler beim Laden der Bewertung:', error);
    averageRating.value = null;
  } finally {
    loading.value = false;
  }
};

const submitRating = async (rating) => {
  //console.log(props.folgenID);
  userRating.value = rating;
  message.value = 'Bewertung wird gesendet...';
  try {
    await axios.post('/api/ratings', {
      folgenId: props.folgenID, // <-- Stellen Sie sicher, dass dies übergeben wird
      rating: rating,
    });
    message.value = 'Danke für deine Bewertung! ✨';
    // Lade die neue Durchschnittsbewertung
    await fetchRating();
  } catch (error) {
    console.error('Fehler beim Senden der Bewertung:', error);
    message.value = 'Fehler beim Senden deiner Bewertung. Bitte versuche es später erneut.';
  }
};

// Hole die Bewertung, wenn sich die Folgen-ID ändert oder die Komponente geladen wird
watch(() => props.folgenId, fetchRating, { immediate: true });
</script>

<style scoped>
.rating-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  text-align: center;
}

.average-rating {
  margin-bottom: 20px;
}

.average-text {
  font-weight: bold;
  color: #333;
}

.stars-display {
  display: inline-block;
  color: #ccc;
  font-size: 24px;
}

.stars-display .star.filled {
  color: #f3d43d;
}

.rating-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-left: 5px;
}

.count {
  font-size: 14px;
  color: #777;
}

.no-rating {
  color: #777;
  font-style: italic;
}

.user-rating-section {
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.rate-text {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.stars-input .star-input {
  font-size: 30px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}

.stars-input .star-input:hover,
.stars-input .star-input.hovered,
.stars-input .star-input.active {
  color: #f3d43d;
}

.message {
  margin-top: 15px;
  font-size: 14px;
  color: #007bff;
}
</style>