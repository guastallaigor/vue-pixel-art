<template>
  <div id="app">
    <section class="container is-dark">
      <h1 class="text-center">Vue Pixel Art</h1>
    </section>
    <div class="layout wrap-row mt h100">
      <section class="draw container with-title w50 h-container">
        <h2 class="title">Draw</h2>
      </section>
      <section class="form container with-title w50 h-container">
        <h2 class="title">Configuration</h2>
        <div class="layout wrap-row">
          <div class="field w33 pr-field">
            <label for="width">Width</label>
            <div class="layout nowrap-row align-end">
              <input type="number" id="width" name="width" class="input" v-model="width">
              <span class="pl">px</span>
            </div>
          </div>
          <div class="field w33 pr-field">
            <label for="height">Height</label>
            <div class="layout nowrap-row align-end">
              <input type="number" id="height" name="height" class="input" v-model="height">
              <span class="pl">px</span>
            </div>
          </div>
          <div class="field w33 pr-field">
            <label for="height">Pixel</label>
            <div class="layout nowrap-row align-end">
              <input type="number" id="pixel" name="pixel" class="input" v-model="pixel">
              <span class="pl">px</span>
            </div>
          </div>
        </div>
        <div class="field mt">
          <label for="color">Color</label>
          <input
            v-model="color"
            class="input"
            type="text"
            :style="{ backgroundColor: color }"
            @click="$refs.colorPicker.click()"
          />
          <input
            @input="updateColor"
            ref="colorPicker"
            type="color"
            style="display: none"
          />
        </div>
        <div class="field mt">
          <label for="height">Code generated</label>
          <textarea id="code" :rows="getRows" name="code" class="input w100" v-model="code"></textarea>
        </div>
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
    width: null,
    height: null,
    color: '#1cb785',
    code: '<div class="vue-pixel-art"></div>',
    end: `}
          </style>`
  }),
  computed: {
    getRows () {
      if (window.innerWidth > 1439) {
        return 15
      }

      if (window.innerWidth > 720) {
        return 10
      }

      return 8
    }
  },
  methods: {
    updateColor(e) {
      this.color = e.target.value
    }
  }
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

.hide {
  display: none;
}

.pr-field {
  padding-right: 10px;
}

.mt {
  margin-top: $px * 16;
}

.pl {
  padding-left: $px * 5;
}

.w50 {
  width: 50%;
}

.h100 {
  height: 100%;
}

.w33 {
  width: 33%;
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
