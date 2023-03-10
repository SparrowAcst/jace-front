<template>
  <div>
    <div v-if="!options" class="text-xs-center">
      <v-progress-circular indeterminate color="secondary ligten-2"></v-progress-circular>
    </div>
    <v-tabs v-else v-model="active">
      <v-tab key="general" ripple>General</v-tab>
      <v-tab key="fe" ripple>Factors & Effects</v-tab>
      <v-tab key="scale" ripple>Scale</v-tab>
      <v-tab key="statistic" ripple>Statistic</v-tab>
      <v-tab-item key="general" ripple>
        <v-card flat>
          <v-container>
            <h3 class="headline">Influence</h3>
            <v-switch :hint="(options.required) ? 'All constraints will be checked' : 'Response validation will be disabled'" persistent-hint label="Required" v-model="options.required" @change="$emit('update:options',options)"></v-switch>
            <v-divider></v-divider>
            <v-textarea v-model="options.title" label="Question"></v-textarea>
            <v-textarea v-model="options.note" label="Note"></v-textarea>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item key="fe" ripple>
        <v-card flat>
            <v-row class="mx-0 pa-3">
              <v-col cols="6" class="mx-0 pa-3">
               <dj-list 
                  :items="options.factors"
                  itemField="title" 
                  title="Factors"
                  label="Enter factors"  
                  @update="onChangeFactors"
                  draggable
                ></dj-list>

                <!-- <dj-list :list="options.factors" title="factor" @update="onChangeFactors"></dj-list> -->
              </v-col>
              <v-col cols="6" class="mx-0 pa-3">
                <dj-list 
                  :items="options.effects"
                  itemField="title" 
                  title="Effects"
                  label="Enter effects"  
                  @update="onChangeEffects"
                  draggable
                ></dj-list>

                <!-- <dj-list :list="options.effects" title="effect" @update="onChangeEffects"></dj-list> -->
              </v-col>
            </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item key="scale" ripple>
        <v-card flat class="mx-0 pa-3">
          <v-container>
            <v-select :items="[3,5,7,9]" label="Maximum rate value" v-model="max" @change="generateScale">
            </v-select>
            <v-layout row v-for="(s, scaleIndex) in options.scale" :key="scaleIndex">
              <v-text-field :label="`${s.value} title`" v-model="s.title" @input="$emit('update:options',options)"></v-text-field>
            </v-layout>
            <v-divider></v-divider>
            <v-switch label="Show value" v-model="options.showValue" @change="$emit('update:options',options)"></v-switch>
            <v-divider></v-divider>
            <v-switch label="Show title" v-model="options.showTitle" @change="$emit('update:options',options)"></v-switch>
            <v-divider></v-divider>
            <palette-picker :value="options.palette" @change="onChangePalette"></palette-picker>
           
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item key="statistic" ripple>
        <v-card flat class="mx-0 pa-3">
          <v-container>
            <v-switch :hint="(options.showResponsesStat) ? 'Show statistical distribution in production mode' : ''" persistent-hint label="Statistical hints" v-model="options.showResponsesStat" @change="$emit('update:options',options)"></v-switch>
            <v-divider></v-divider>
            <v-card flat color="transparent" class="mt-3">
              <v-layout fill-height row>
                <v-flex xs2 pa-2 class="text-xs-center headline" style="border-left:1px solid #dedede; border-bottom:1px solid #dcdcdc;  border-top:1px solid #dcdcdc;">
                </v-flex>
                <v-flex v-for="(e, idx) in options.effects" :key="idx" :class="`${cellClass} text-xs-center`" :style="`
                      min-height:3em; 
                      border-left:1px solid #dedede; 
                      border-bottom:1px solid #dcdcdc;  
                      border-top:1px solid #dcdcdc;
                      ${ (idx == (options.effects.length-1)) ? 'border-right: 1px solid #dcdcdc !important;' : ''}
                    `">
                  <span class="caption">{{e.title}}</span>
                </v-flex>
              </v-layout>
              <v-layout fill-height row v-for="(f, index1) in options.factors" :key="index1">
                <v-flex xs2 pa-2 class="caption" align-center style="border-left: 1px solid #dcdcdc;
                    border-bottom:1px solid #dcdcdc; ">
                  {{f.title}}
                </v-flex>
                <v-flex v-for="(e, index2) in options.effects" :key="index2" :class="`${cellClass} text-xs-center`" :style="`
                    min-height:3em; 
                    border-left: 1px solid #dcdcdc;
                    border-bottom:1px solid #dcdcdc; 
                    ${ (index2 < (options.effects.length-1)) ? '' :'border-right: 1px solid #dcdcdc !important;'}
                  `" align-center>
                  <v-layout align-center style="height:100%;" @click="onSetValue($event,f,e)">
                    <v-flex class="text-xs-center body-2">
                      <echart v-if="getChartOptions(f,e)" :options="getChartOptions(f,e)" :height="height"></echart>
                    </v-flex>
                  </v-layout>
                  <v-layout style="height:100%;"></v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <!--  <pre>
        {{JSON.stringify(options,null,"\t")}}
      </pre>   -->
  </div>
</template>
<script>
import { find, countBy } from "lodash"
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import palettePicker from "@/components/core/ext/palette-picker.vue"
import statMixin from "../mixins/statistic.mixin.js"
import colorUtility from "../../color-utility.js"
import djKeyValue from "@/components/core/ext/dj-field-editor.vue"

export default {

  mixins: [djvueMixin, listenerMixin, statMixin],

  props: ["config", "options", "stat"],

  components: {
    "dj-list": djKeyValue,
    "palette-picker": palettePicker
  },

  methods: {

    generateScaleStyle() {

      if (!this.options.scale || !this.options.palette.color) return
      if (this.options.scale.length > 0 && this.options.palette.color.length > 0) {
        this.options.scale.forEach(v => {
          v.color = colorUtility.color(this.options.scale, v.value, this.options.palette, this.$vuetify.theme.themes.light)
          v.background = colorUtility.background(this.options.scale, v.value, this.options.palette, this.$vuetify.theme.themes.light)
          v.style = `color: ${colorUtility.color(this.options.scale, v.value, this.options.palette, this.$vuetify.theme.themes.light)} !important;` +
            `background: ${colorUtility.background(this.options.scale, v.value, this.options.palette, this.$vuetify.theme.themes.light)} !important;`
        })
      }

      this.options.undefinedValue = {
        style: `color: ${colorUtility.color(this.options.scale, null, this.options.palette, this.$vuetify.theme.themes.light)} !important;` +
          `background: ${colorUtility.background(this.options.scale, null, this.options.palette, this.$vuetify.theme.themes.light)} !important;`
      }
    },



    onChangeFactors(items) {
      this.options.factors = items.map( d => {
        d.id = (d.id) ? d.id : this.randomName()
        return d
      })
      this.$emit("update:options", this.options)
    },

    onChangeEffects(items) {
      this.options.effects = items.map( d => {
        d.id = (d.id) ? d.id : this.randomName()
        return d
      })
      this.$emit("update:options", this.options)
    },

    onChangePalette(palette) {
      this.options.palette = palette
      this.$nextTick(() => {
        // console.log("CHANGE PALETTE")
        this.generateScaleStyle()
        this.$nextTick(() => { this.$emit("update:options", this.options) })
      })
    },

    onChange() {
      this.$emit("update:options", this.options)
    },

    onSetOptions(){
      // console.log("onSetOptions")
      this.generateScaleStyle()
    },

    generateScale(value) {
      if (value != this.options.scale.length) {
        let newScale = [];

        for (let i = 0; i < value; i++) {
          newScale.push({ value: i + 1 })
        }
        this.options.scale = newScale
        this.generateScaleStyle()
        this.onChange()
      }
    },

    getChartOptions(factor, effect) {
      let f = find(this.statOptions, s => s.factor.id == factor.id && s.effect.id == effect.id)
      if (f) return f.chartOptions
      return null
    },

    calculateStat() {
      if (!this.options) return {}
      
      if (!this.options.effects || !this.options.factors) return {}

      let s = this.stat.responses.filter(a => a)

      let stats = []
      s.forEach(item => {
        stats = stats.concat(item)
      })

      let r = []

      this.options.factors.forEach(f => {
        this.options.effects.forEach(e => {
          r.push({
            factor: f,
            effect: e,
            values: stats
              .filter(s => s.e1 == f.id && s.e2 == e.id && s.value && find(this.options.scale, v => v.value == s.value))
              .map(s => s.value)
          })
        })
      })

      r = r.filter(s => s.values.length > 0)

      r.forEach(s => {
        let c = countBy(s.values);
        s.data = this.options.scale.map(v => ({
          title: v.value,
          value: (c[v.value]) ? c[v.value] : 0
        }))
      })

      // r.forEach(s => {
      //   s.chartOptions = {

      //     tooltip: {
      //       trigger: 'item',
      //       formatter: "{a} <br/>{b}: {c} ({d}%)"
      //     },

      //     color: this.options.scale.map(v => v.background),
      //     series: [{
      //       type: 'pie',

      //       name: `${s.factor.title} => ${s.effect.title}`,
      //       radius: ['5%', '25%'],
      //       data: s.data.map(d => ({ name: d.title, value: d.value }))
      //     }]
      //   }
      // })



      r.forEach(s => {
        s.chartOptions = {
          color: [this.$vuetify.theme.themes.light.primary],
          angleAxis: {
            type: 'category',
            data: this.options.scale.map(d => d.value),
            axisLabel: {
              margin: 2,
              fontSize: 8,
              fontWeight: "bold",
              color: this.$vuetify.theme.themes.light.secondary
            }
          },
          radiusAxis: {
            splitNumber: 1,
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          polar: {},
          series: [{
            type: 'bar',
            itemStyle: {
              opacity: 0.5
            },
            data: s.data.map(d => d.value),
            coordinateSystem: 'polar'
          }]
        }
      })


      this.height = 150;

      return r

    }

  },

  computed: {

    cellClass() {
      let width = Math.trunc(10 / this.options.effects.length);
      width = (width > 3) ? 3 : width;
      return `xs${width}`
    },

    max: {
      get() {
        return this.options.scale.length
      },
      set(value) {
        this.generateScale(value)
      }
    }
  },


  data: () => ({
    active: null,
    height: null
  }),


  mounted() { this.$emit("init") }
}

</script>
