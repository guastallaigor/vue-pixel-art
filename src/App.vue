<template>
  <main id="app">
    <section class="container is-dark">
      <h1 class="text-center">Vue Pixel Art</h1>
    </section>
    <div class="layout wrap-row mt h100">
      <section class="container with-title w50 h-container">
        <h2 class="title">Paint</h2>
        <div class="editor">
          <div class="draw" ref="drawGrid"></div>
        </div>
      </section>
      <section class="form container with-title w50 h-container">
        <h2 class="title">Configuration</h2>
        <div class="layout wrap-row align-end">
          <div class="field mr-field">
            <button class="btn is-error" @click="changeSize">Clear paint</button>
          </div>
          <div class="field pr-field">
            <label for="size">Size</label>
            <div class="layout nowrap-row align-end">
              <input
                type="number"
                id="size"
                name="size"
                class="input w100px"
                :class="{'is-error': sizeError}"
                v-model="size"
                @input="changeSize(parseInt($event.target.value, 10))"
              />
              <span class="pl">px</span>
            </div>
          </div>
          <div class="field pr-field">
            <label for="height">Pixels</label>
            <div class="layout nowrap-row align-end">
              <input
                type="number"
                id="pixel"
                name="pixel"
                class="input w100px"
                v-model="pixel"
              />
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
        <div class="layout nowrap-row relative">
          <div class="field mt">
            <button
              class="btn is-primary"
              v-clipboard:copy="code"
              v-clipboard:success="onCopy"
            >Copy to clipboard</button>
          </div>
           <transition name="fade" mode="out-in">
            <div class="balloon from-left copied transition" v-if="show">
              Copied!
            </div>
          </transition>
        </div>
      </section>
      <footer class="layout justify-center align-center wrap-column">
        <div>
          <span class="pr">Made with</span>
          <i class="icon heart"></i>
          <span class="pl">by</span>
          <a class="pl" href="https://github.com/guastallaigor" target="_blank">@guastallaigor</a>
        </div>
        <div class="mt mb">
          <span class="pr">Project refactored from</span>
          <a href="https://github.com/BcRikko/css-collection/" target="_blank">CSS Collection / DotGen</a>
        </div>
        <div>
          <span class="pr">Credits:</span>
          <a class="pl" href="https://github.com/BcRikko" target="_blank">@bc_rikko</a>
        </div>
      </footer>
    </div>
    <github-corner/>
  </main>
</template>

<script>
import GithubCorner from '@/components/GithubCorner.vue'

const CODE_START = '<div class="vue-pixel-art"></div>'

export default {
  components: {
    GithubCorner
  },
  data: () => ({
    size: 8,
    pixel: 4,
    show: false,
    sizeError: false,
    color: '#1cb785',
    code: CODE_START,
    end: `}
          </style>`
  }),
  computed: {
    getRows () {
      if (window.innerWidth > 1439) {
        return 11
      }

      if (window.innerWidth > 720) {
        return 7
      }

      return 5
    }
  },
  mounted () {
    this.changeSize()
  },
  beforeDestroy () {
    this.removeChilds()
  },
  methods: {
    updateColor (e) {
      const value = e.target.value
      this.color = value
    },
    removeChild (el) {
      el.removeEventListener('click', this
        .paint
        .bind(this, el))
      el.removeEventListener('mousedown', this
        .mousedown
        .bind(this, el))
      el.removeEventListener('mouseup', this
        .mouseup
        .bind(this, el))
      el.removeEventListener('mousemove', this
        .mousemove
        .bind(this, el))
      el
        .parentElement
        .removeChild(el)
    },
    removeChilds () {
      const refs = this.$refs
      const grid = refs.drawGrid
      const allDivs = grid.querySelectorAll('div')

      Array.from(allDivs).forEach(el => {
        this.removeChild(el)
      })
    },
    resetEventListner () {
      const refs = this.$refs
      const grid = refs.drawGrid
      const allDivs = grid.querySelectorAll('div')

      Array.from(allDivs).forEach(el => {
        el.addEventListener('mousedown', this
          .mousedown
          .bind(this, el))
        el.addEventListener('mouseup', this
          .mouseup
          .bind(this, el))
        el.addEventListener('mousemove', this
          .mousemove
          .bind(this, el))
        el.addEventListener('click', this
          .paint
          .bind(this, el))
      })
    },
    hexToRgb (hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : null
    },
    mousemove (el) {
      if (this.isMouseDown) {
        this.mustPaint(el)
      }
    },
    mousedown (el) {
      this.isMouseDown = true
    },
    mouseup (el) {
      this.isMouseDown = false
    },
    mustPaint (el) {
      this.setBgColor(el, this.color)
    },
    paint (el) {
      const style = el.style
      const setBackgroundColor = style.backgroundColor === this.hexToRgb(this.color)
        ? 'transparent'
        : this.color

      this.setBgColor(el, setBackgroundColor)
    },
    setBgColor (el, color) {
      el
        .style
        .backgroundColor = color

      this.output()
    },
    output () {
      const refs = this.$refs
      const grid = refs.drawGrid
      const allDivs = grid.querySelectorAll('div')
      const pixel = parseInt(this.pixel, 10)
      const size = parseInt(this.size, 10)
      const boxShadows = Array.from(allDivs)
        .map((el, i) => {
          return [
            `${pixel * (i % size) + pixel}px`, // col
            `${pixel * Math.ceil((i + 1) / size)}px`, // row
            0,
            el
              .style
              .backgroundColor || 'transparent'
          ].join(' ')
        })

      const spliced = boxShadows.filter(it => !/(\s0 transparent$)/.test(it))
      const boxShadowProperty = spliced.join(', \n')
      this.code = `<div class="vue-pixel-art"></div>
<style>
.vue-pixel-art::before {
  content: "";
  position: absolute;
  top: ${pixel * -1}px;
  left: ${pixel * -1}px;
  width: ${pixel}px;
  height: ${pixel}px;
  background: transparent;
  box-shadow: ${boxShadowProperty};
}
</style>`
    },
    changeSize () {
      if (this.size > 100) {
        this.sizeError = true
        return
      }

      this.sizeError = false

      const refs = this.$refs
      const grid = refs.drawGrid
      const length = parseInt(this.size ** 2, 10)
      const qtdDivs = Array(length).fill(0)

      this.code = CODE_START
      this.removeChilds()

      qtdDivs.forEach(i => {
        const div = document.createElement('div')
        grid.appendChild(div)
      })

      this.resetEventListner()

      grid
        .style
        .gridTemplateColumns = '1fr '.repeat(this.size)
      grid
        .style
        .gridTemplateRows = '1fr '.repeat(this.size)
    },
    onCopy() {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 2000)
    }
  }
}
</script>

<style>
html, body {
  height: calc(100% - 4em);
  width: 100%;
}

a, a:hover {
  text-decoration: none !important;
}

.draw div {
  border: 1px solid #b6b6b6;
  background-color: transparent;
}
</style>

<style scoped lang="scss">
@import './style/flex.scss';

$px: 2px;

#app {
  grid-template:
    "editor settings"
    "editor output"
    / auto 400px;
  font-family: 'Press Start 2P', -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
    sans-serif;
  height: 100%;
  width: 100%;
}

.copied {
  position: absolute !important;
  border: 0 !important;
  top: -50px !important;
  left: 30% !important;
}

.transition {
  transition: .3s all linear !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .8s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.relative {
  position: relative;
}

.hide {
  display: none;
}

.pr-field {
  padding-right: 20px;
}

.mr-field {
  padding-right: 20px;
}

.mt {
  margin-top: $px * 16;
}

.mb {
  margin-bottom: $px * 16;
}

footer .mt {
  margin-top: $px * 11;
}

footer .mb {
  margin-bottom: $px * 11;
}

.pl {
  padding-left: $px * 5;
}

.pr {
  padding-right: $px * 5;
}

.w100px {
  width: 100px;
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

.editor {
  grid-area: editor;

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
}

pre {
  white-space: pre-wrap;
  color: rgb(212, 0, 255);
  line-height: 30px;
}
</style>
