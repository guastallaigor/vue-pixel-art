<template>
  <div id="app">
    <section class="container is-dark">
      <h1 class="text-center">Vue-pixel-art</h1>
    </section>
    <div class="layout wrap-row mt-3 h100">
      <section class="draw container with-title w50 h-container">
        <h2 class="title">Draw</h2>
      </section>
      <section class="form container with-title w50 h-container">
        <h2 class="title">Configuration</h2>
      </section>
    </div>
    <github-corner/>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner.vue'

export default {
  components: {
    GithubCorner
  },
  data: () => ({

  })
}
</script>

<style>
html, body {
  height: calc(100% - 4em);
  width: 100%;
}
</style>

<style scoped lang="scss">
@import './style/main.scss';

$px: 2px;

#app {
  font-family: 'Press Start 2P', -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
    sans-serif;
  height: 100%;
  width: 100%;
}

.mt-3 {
  margin-top: $px * 16;
}

.w50 {
  width: 50%;
}

.h100 {
  height: 100%;
}

.h-container {
  height: calc(100% - 9em);
}

pre {
  white-space: pre-wrap;
  color: rgb(212, 0, 255);
  line-height: 30px;
}
</style>
