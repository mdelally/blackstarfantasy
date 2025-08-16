<template>
  <div class="flex gap-2 items-center justify-center" v-if="lastFmData">
    <span class="text-xs text-stone-400" v-if="currentlyPlaying"
      >NOW PLAYING</span
    >
    <span v-else>LAST PLAYED</span>
    {{ trackString }}
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";

const lastFm = ref(null);
const lastFmData = ref(null);
const interval = ref(null);

onMounted(async () => {
  console.log("LastFm widget mounted");
  await getLastFmData();

  interval.value = setInterval(async () => {
    await getLastFmData();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

async function getLastFmData() {
  const response = await fetch(
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mdelally&api_key=2b9c986412c239b35ca13a48b569a26f&format=json&extended=1",
  );
  const data = await response.json();
  console.log(data.recenttracks.track[0]);
  lastFmData.value = data;
}

const trackString = computed(() => {
  return (
    lastFmData.value?.recenttracks?.track[0]?.name +
    " by " +
    lastFmData.value?.recenttracks?.track[0]?.artist.name
  );
});

const currentlyPlaying = computed(() => {
  return (
    lastFmData.value?.recenttracks?.track[0]?.["@attr"]?.nowplaying === "true"
  );
});
</script>
