<template>
  <main id="app">
    <section class="container is-dark">
      <h1 class="text-center">Vue Pixel Art</h1>
    </section>
    <div class="layout wrap-row mt h100">
      <section class="container with-title w50 h-container">
        <h2 class="title">Draw</h2>
        <div class="draw" ref="drawGrid"></div>
      </section>
      <section class="form container with-title w50 h-container">
        <h2 class="title">Configuration</h2>
        <div class="layout wrap-row">
          <div class="field w33 pr-field">
            <label for="size">Size</label>
            <div class="layout nowrap-row align-end">
              <input type="number" id="size" name="size" class="input" v-model="size">
              <span class="pl">px</span>
            </div>
          </div>
          <div class="field w33 pr-field">
            <label for="height">Pixels</label>
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
          <textarea id="code" :rows="getRows" name="code" readonly class="input w100" v-model="code"></textarea>
        </div>
      </section>
    </div>
    <github-corner/>
  </main>
</template>

<script>
import GithubCorner from '@/components/GithubCorner.vue'

export default {
  components: {
    GithubCorner
  },
  data: () => ({
    size: 8,
    pixel: 4,
    color: '#1cb785',
    code: '<div class="vue-pixel-art"></div>',
    end: `}
          </style>`
  }),
  computed: {
    getRows () {
      if (window.innerWidth > 1439) {
        return 14
      }

      if (window.innerWidth > 720) {
        return 10
      }

      return 8
    }
  },
  mounted () {
    this.changeSize(8)
  },
  beforeDestroy () {
    this.removeChilds()
  },
  methods: {
    updateColor (e) {
      this.color = e.target.value
    },
    removeChild (el) {
      el.removeEventListener('click', this.draw.bind(this, el))
      el.parentElement.removeChild(el)
    },
    removeChilds () {
      const grid = this.$refs.drawGrid
      const allDivs = grid.querySelectorAll('div')

      Array.from(allDivs).forEach(el => {
        this.removeChild(el)
      })
    },
    resetEventListner () {
      const grid = this.$refs.drawGrid
      const allDivs = grid.querySelectorAll('div')

      Array.from(allDivs).forEach(el => {
        el.addEventListener('click', this.paint.bind(this, el))
      })
    },
    paint (el) {
      el.style.backgroundColor = this.color || 'transparent'
    },
    output() {
      const grid = this.$refs.drawGrid
      const allDivs = grid.querySelectorAll('div')
      const boxShadows = Array.from(grid.querySelectorAll(allDivs))
        .filter(el => {
          el.style.backgroundColor && el.style.backgroundColor != 'transparent'
        })
        .map(
        (el, i) => {
          return [
            `${this.pixel * (i % this.size) + this.pixel}px`, // col
            `${this.pixel * Math.ceil((i + 1) / this.size)}px`, // row
            0,
            el.style.backgroundColor
          ].join(' ');
        }
      );
      this.code = `<div class="vue-pixel-art"></div>
      <style>
      .vue-pixel-art::before {
        content: "";
        position: absolute;
        top: ${this.pixel * -1}px;
        left: ${this.pixel * -1}px;
        width: ${this.pixel}px;
        height: ${this.pixel}px;
        background: transparent;
        box-shadow: ${boxShadows.join(', \n')};
      }
      </style>`
    },
    changeSize (size) {
      this.size = size || 8
      const grid = this.$refs.drawGrid
      const allDivs = grid.querySelectorAll('div')
      const length = parseInt(this.size ** 2, 10)
      const qtdDivs = Array(length).fill(0)

      this.removeChilds()

      qtdDivs.forEach(i => {
        const div = document.createElement('div')
        grid.appendChild(div)
      })

      this.resetEventListner()

      grid.style.gridTemplateColumns = grid.style.gridTemplateRows = '1fr '.repeat(
        this.size
      );
    }
  },
  watch: {
    size (value) {
      const intval = parseInt(value, 10)
      this.changeSize(intval)
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

.w30 {
  width: 30%;
}

.w40 {
  width: 40%;
}

.w50 {
  width: 50%;
}

.w60 {
  width: 60%;
}

.w70 {
  width: 70%;
}

.h100 {
  height: 100%;
}

.w33 {
  width: 33%;
}

.h-container {
  height: calc(100% - 10em);
}

.draw {
  display: grid;
  margin: auto;
  width: 600px;
  height: 600px;
  border: 3px solid #333333;
  background-color: #fdfdfd;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  background-image: linear-gradient(45deg, #e2e2e2 25%, transparent 25%, transparent 75%, #e2e2e2 75%, #e2e2e2),
    linear-gradient( 45deg, #e2e2e2 25%, transparent 25%, transparent 75%, #e2e2e2 75%, #e2e2e2);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
}

.draw div {
  border: 1px solid #b6b6b6;
  background-color: transparent;
}

pre {
  white-space: pre-wrap;
  color: rgb(212, 0, 255);
  line-height: 30px;
}
</style>
