<template>
  <main id="app">
    <section class="nes-container is-dark">
      <h1 class="text-center">Vue Pixel Art</h1>
      <github-corner/>
    </section>
    <div class="layout wrap-row mt h100">
      <section class="nes-container with-title w50 h-container section-paint">
        <h2 class="title">Paint</h2>
        <div class="layout align-end is-paint">
          <div class="layout nowrap-column">
            <label>Preview</label>
            <div class="preview">
              <div class="before" ref="previewBefore"></div>
            </div>
          </div>
          <div class="editor">
            <div class="draw" :style="getDrawStyle" ref="drawGrid"></div>
          </div>
        </div>
      </section>
      <section class="form nes-container with-title w50 h-container section-config">
        <h2 class="title">Configuration</h2>
        <div class="layout wrap-row align-end">
          <div class="nes-field mr-field">
            <button class="nes-btn is-error" @click="changeSize">Clear paint</button>
          </div>
          <div class="nes-field mr-field">
            <button class="nes-btn" :class="getClassBtnErase" @click="togglePaintErase">{{ getLabelBtnErase }}</button>
          </div>
          <div class="nes-field pr-field is-size">
            <label for="size">Size</label>
            <div class="layout nowrap-row align-end">
              <input
                type="number"
                id="size"
                name="size"
                class="nes-input w100px"
                :class="{'is-error': sizeError}"
                v-model="size"
                @input="changeSize"
              />
              <span class="pl">px</span>
            </div>
          </div>
          <div class="nes-field pr-field is-pixels">
            <label for="height">Pixels</label>
            <div class="layout nowrap-row align-end">
              <input
                type="number"
                id="pixel"
                name="pixel"
                class="nes-input w100px"
                v-model="pixel"
                @input="output"
              />
              <span class="pl">px</span>
            </div>
          </div>
        </div>
        <div class="nes-field mt">
          <div class="layout nowrap-row align-end">
            <div class="nes-field pr-field">
              <label>
                <input type="checkbox" class="nes-checkbox" v-model="borders" @click.stop="toggleBorders">
                <span>Borders</span>
              </label>
            </div>
            <div class="layout nowrap-column nes-field">
              <label for="color">Color</label>
              <input
                v-model="color"
                class="nes-input color"
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
          </div>
        </div>
        <div class="nes-field mt">
          <label for="height">Code generated</label>
          <textarea id="code" ref="textcode" :rows="getRows" name="code" readonly class="nes-input w100" v-model="code"></textarea>
        </div>
        <div class="layout nowrap-row relative">
          <div class="nes-field mt pr-field">
            <button
              class="nes-btn is-primary"
              v-clipboard:copy="code"
              v-clipboard:success="onCopy"
            >Copy to clipboard</button>
          </div>
           <transition name="fade" mode="out-in">
            <div class="nes-balloon from-left copied transition" v-if="show">
              Copied!
            </div>
          </transition>
          <div class="nes-field mt pr-field">
            <button v-if="code" class="nes-btn is-warning" @click="download">
              {{ downloading ? 'Downloading...' : 'Download as image' }}
            </button>
          </div>
          <div class="nes-field mt">
            <button class="nes-btn is-success" @click="$refs.file.click()">
              Image to 8bit
            </button>
          </div>
          <input
            ref="file"
            accept=".jpg, .jpeg, .png"
            id="file"
            type="file"
            @change="pixelateImgAndDownload"
          />
        </div>
      </section>
      <footer class="layout justify-center align-center wrap-column">
        <div>
          <span class="pr">Made with</span>
          <i class="nes-icon heart"></i>
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
        <div class="is-canvas">
          <canvas id="canvas" class="canvas" ref="canvas"></canvas>
        </div>
      </footer>
    </div>
  </main>
</template>

<script>
import GithubCorner from '@/components/GithubCorner.vue'
import DomToImage from 'dom-to-image'
import download from 'downloadjs'
import eightBit from '8bit'

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
    isMouseDown: false,
    color: '#1cb785',
    code: CODE_START,
    erase: false,
    borders: true,
    downloading: false,
    white: false,
    imgSrc: ''
  }),
  computed: {
    getRows () {
      if (window.innerWidth > 1439) {
        return 9
      }

      if (window.innerWidth > 720) {
        return 7
      }

      return 5
    },
    getLabelBtnErase () {
      const { erase } = this

      return erase ? 'Erase activated' : 'Paint activated'
    },
    getClassBtnErase () {
      const { erase } = this

      return {
        'is-warning': erase,
        'is-success': !erase
      }
    },
    getDrawStyle () {
      const { white } = this

      return white ? 'background:#fff !important;' : ''
    }
  },
  mounted () {
    this.changeSize()

    document.addEventListener('mouseup', (el) => {
      if (el &&
        el.target &&
        el
          .target
          .parentNode &&
        el
          .target
          .parentNode.className !== 'draw') {
        this.isMouseDown = false
      }
    })
  },
  beforeDestroy () {
    this.removeChilds()
    document
      .removeEventListener('mouseup', () => ({}))
  },
  methods: {
    pixelateImgAndDownload () {
      const refs = this.$refs
      const isFile = refs.file
      const files = isFile.files
      const hasFiles = files.length

      if (files && hasFiles) {
        const canvas = document.getElementById('canvas')

        setTimeout(() => {
          const file = files[0]
          const img = new Image()
          img.onload = () => {
            eightBit(canvas, img, 10)
          }
          img.src = URL.createObjectURL(file)
        })

        try {
          setTimeout(async () => {
            const fileDownload = await DomToImage.toBlob(canvas)
            download(fileDownload, 'vue-pixel-art-img-to-8bit.png', 'image/png')
          }, 1000)
        } catch (e) {
          console.error(e)
        }
      }
    },
    download () {
      this.downloading = true
      this.white = true
      this.toggleBorders()

      try {
        setTimeout(async () => {
          const refs = this.$refs
          const drawGrid = refs.drawGrid
          const file = await DomToImage.toBlob(drawGrid)
          download(file, 'vue-pixel-art.png', 'image/png')
          this.downloading = false
          this.white = false
          this.toggleBorders()
        })
      } catch (e) {
        this.downloading = false
        this.white = false
        this.toggleBorders()
      }
    },
    togglePaintErase () {
      this.erase = !this.erase
    },
    getAllDivs () {
      const refs = this.$refs
      const grid = refs.drawGrid

      return grid.querySelectorAll('div')
    },
    toggleBorders () {
      const allDivs = this.getAllDivs()

      Array.from(allDivs).forEach(el => {
        el.className = el.className ? '' : 'no-border'
      })
    },
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
      const allDivs = this.getAllDivs()

      Array.from(allDivs).forEach(el => {
        this.removeChild(el)
      })
    },
    resetEventListner () {
      const allDivs = this.getAllDivs()

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
      this.setBgColor(el, this.erase ? 'transparent' : this.color)
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
    setPreview () {
      const size = parseInt(this.size, 10)
      const pixel = (577 / size) / 3
      const boxShadows = this.getBoxShadows(pixel)
      const refs = this.$refs
      const before = refs.previewBefore
      before.style.top = `${pixel * -1}px`
      before.style.left = `${pixel * -1}px`
      before.style.width = `${pixel}px`
      before.style.height = `${pixel}px`
      before.style.boxShadow = boxShadows
      before.style.background = 'transparent'
    },
    getBoxShadows (pixel) {
      const allDivs = this.getAllDivs()
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

      return spliced.join(', \n')
    },
    output () {
      const pixel = parseInt(this.pixel, 10)
      const boxShadows = this.getBoxShadows(pixel)
      this.setPreview()
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
  box-shadow: ${boxShadows};
}
</style>`
    },
    changeSize () {
      const refs = this.$refs
      const before = refs.previewBefore
      before.style = ''

      if (this.size > 100) {
        this.sizeError = true
        return
      }

      this.sizeError = false
      this.borders = true
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
    onCopy () {
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

.draw .no-border {
  border: 0;
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

.preview {
  border: 4px solid #333333 !important;
  height: 200px !important;
  width: 200px !important;
  display: inline-block !important;
  margin-right: 2.8em !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.before {
  box-sizing: border-box;
  position: relative;
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

.pr-field-double {
  padding-right: 40px;
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

.btn {
  margin: 0 !important;
  margin-bottom: 2px !important;
}

.input {
  padding: 0.55rem 1rem !important;
}

.h-container {
  height: calc(100% - 10em);

  @media screen and (max-width: 1366px) {
    height: 100%;
  }
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

@media screen and (max-width: 1366px) {
  .section-paint {
    width: 100%;
    height: calc(100% - 5em);
    @media screen and (max-height: 769px) and (max-width: 1366px) {
      height: calc(100% + 2em);
    }
  }
  .section-config {
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1em;
    height: calc(100% -7em);
    @media screen and (max-height: 769px) {
      height: 100%;
    }
  }
  footer {
    margin-bottom: 1em;
  }
}

@media screen and (min-width: 1367px) and (max-width: 1748px) {
  .is-paint {
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .section-paint, .section-config {
    height: calc(100% + 10em);

    @media screen and (max-height: 769px) {
      height: calc(100% + 17em);
    }
  }
  .section-config {
    margin-bottom: 1em;
  }
  .preview {
    align-self: center;
    margin-bottom: 1em;
    display: flex !important;
  }
  footer {
    margin-bottom: 1em;
  }
}

@media screen and (min-width: 1367px) and (max-width: 1508px) {
  .is-size, .is-pixels {
    margin-top: 1em;
  }
}

@media screen and (min-width: 1367px) and (max-width: 1847px) {
  .is-pixels {
    margin-top: 1em;
  }
}

@media screen and (min-width: 1749px) {
  .section-paint, .section-config {
    height: calc(100% - 10em);
    margin-bottom: 1em;

    @media screen and (max-height: 769px) {
      height: calc(100% + 6em);
    }
  }
  footer {
    margin-bottom: 1em;
  }
}

input[type="file"], .is-canvas {
  position: absolute;
  top: -2000px;
  z-index: -1;
  left: 0;
}
</style>
