<template>
  <div class="flex gap-2 items-center justify-center" v-if="lastFmData">
    <Icon icon="fa6-brands:lastfm" class="w-5 h-5 text-orange-500" />
    <span class="text-xs text-stone-400" v-if="currentlyPlaying"
      >NOW PLAYING</span
    >
    <span class="text-xs text-stone-400" v-else>LAST PLAYED</span>
    <div
      id="nowPlaying"
      class="flex items-center justify-center"
      :class="{ 'no-animation': !currentlyPlaying }"
    >
      <marquee
        width="180"
        scrollamount="3"
        class="bg-black/60 text-white text-sm tracking-wider"
      >
        {{ trackString }}
      </marquee>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

const lastFm = ref(null);
const lastFmData = ref(null);
const interval = ref(null);

onMounted(async () => {
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

<style scoped>
#nowPlaying {
  background-image: url("../../assets/img/MusicSoundEqualizer.gif");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#nowPlaying.no-animation {
  background-image: unset;
}
</style>
