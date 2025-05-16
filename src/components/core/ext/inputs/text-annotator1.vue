<template>
    <div v-if="options && getPropertyValue" class="text-annotation-container" :class="(options.decoration && options.decoration.class) ? getPropertyValue(options.decoration.class) || '' : ''" :style="(options.decoration && options.decoration.style) ? getPropertyValue(options.decoration.style) || '' : ''" v-on:mouseup="onMouseUp">
        <template v-for="(item, index) in chunks">
            <span class="text-for-annotation" v-if="item && item.type === 'text'" :key="index" :class="{ 'text-indent': isTextIndent(index)}" style="padding: 3px;" :start="item.start">
                {{item.content}}
            </span>
            <span v-if="item && item.type === 'whitespaces'"> {{item.content}} </span>
            <br v-if="item && item.type === 'wrap'" :key="index" style="padding: 3px; border:1px solid blue;" :start="item.start" />
            <span v-if="item && item.type === 'annotation'" class="text-annotation mx-2" @mouseover="setFocus(item, true)" @mouseleave="setFocus(item, true)" @click="startEdit" :style="{ border: border(item), cursor: 'default', borderRadius: '0.5em' }" :start="item.start">
                <v-tooltip v-if="options && options.decoration && getPropertyValue(options.decoration.showTooltip)" bottom color="#00000000" open-delay=500>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-if="item" v-bind="attrs" v-on="on" style="cursor: pointer" :class="'entity-'+item.id">
                            <span v-if="options && options.decoration && getPropertyValue(options.decoration.showTag)" class="text-annotation__annotation font-weight-light px-2" :class="'entity-'+item.id" :style="{ backgroundColor: tagBackground(item), color: 'white', padding: '0.05em 0', borderRadius: '0.5em 0 0 0.5em' }">
                                {{ item.tag }}
                            </span>
                            <span class="text-annotation__word">
                                <span class="px-2" :class="'entity-'+item.id" :style="{backgroundColor: markBackground(item), padding: '0.05em 0', borderRadius: ( options && options.decoration && getPropertyValue(options.decoration.showTag)) ? '0 0.5em 0.5em 0' : '0.5em' }">
                                    {{ item.content }}
                                </span>
                            </span>
                                
                        </span>
                    </template>
                    <div class="secondary--text pa-2 ma-1" style="background: #fffde7; border: 1px solid #bbbbbb;">
                        <div v-if="options && options.decoration && options.decoration.tooltip && getPropertyValue(options.decoration.tooltip.tag)" class="title" :style="{color: tagBackground(item)}">
                            {{item.tag}}
                        </div>
                        <div v-if="options && options.decoration && options.decoration.tooltip && getPropertyValue(options.decoration.tooltip.updatedAt)" class="subtitle-2 text-right" style="margin-top:-0.5em;">
                            {{item.updatedAt}}
                        </div>
                        <div v-if="options && options.decoration && options.decoration.tooltip && getPropertyValue(options.decoration.tooltip.author)" class="d-flex align-center" style="margin-top:-1em;">
                            <v-avatar>
                                <img :src="item.author.photo">
                            </v-avatar>
                            <div class="px-3" style="line-height:0.7">
                                <div class="subtitle-2">{{item.author.name}}</div>
                                <div class="caption" style="margin-top: -0.6em;">{{item.author.role}}</div>
                            </div>
                        </div>
                        <pre v-if="options && options.decoration && options.decoration.tooltip && getPropertyValue(options.decoration.tooltip.note)" class="caption  pt-2" style="line-height: 1">{{note(item)}}</pre>
                    </div>
                </v-tooltip>
                <span v-else :class="'entity-'+item.id" style="cursor: pointer">
                    <span v-if="options && options.decoration && getPropertyValue(options.decoration.showTag)" class="text-annotation__annotation font-weight-bold px-2" :class="'entity-'+item.id" :style="{ backgroundColor: tagBackground(item), color: 'white', padding: '0.05em 0' }">
                        #{{ item.tag }}
                    </span>
                    <span class="text-annotation__word">
                        <span class="px-2" :class="'entity-'+item.id" :style="{backgroundColor: markBackground(item), padding: '0.05em 0'}">
                            {{ item.content }}
                        </span>
                    </span>
                </span>
            </span>
        </template>
        <v-menu 
            v-if="edited && !((data) ? getPropertyValue(data.readonly) || false : false)" 
            v-model="menu" 
            :disabled="(data) ? getPropertyValue(data.readonly) || false : false" 
            :close-on-content-click="false" 
            min-width=370 
            :position-x="edited.position.x" 
            :position-y="edited.position.y" 
            @input="changeMenuModel" 
            z-index=5000
        >
            <div class="secondary--text px-1 pt-3" style="background: #ffffff">
                {{getPropertyValue(data.readonly)}}
                <div v-if="edited">
                    <div class="d-flex align-center mx-2 mb-4">
                        <v-avatar>
                            <img :src="edited.author.photo">
                        </v-avatar>
                        <div class="px-3" style="line-height:0.7">
                            <div class="subtitle-2">{{edited.author.name}}</div>
                            <div class="caption" style="margin-top: -0.6em;">{{edited.author.role}}</div>
                        </div>
                        <v-spacer></v-spacer>
                        <div class="subtitle-2 text-right">{{edited.updatedAt}}</div>
                    </div>
                    <v-autocomplete outlined dense :value="edited.tag" label="Tag" :items="(options.decoration && options.decoration.entities) ? getPropertyValue(options.decoration.entities).map( d => d.tag) || [] : []" @change="changeTag">
                    </v-autocomplete>
                    <v-textarea outlined :value="edited.note" label="Note" @input="changeNote"></v-textarea>
                </div>
                <div class="d-flex">
                    <v-btn text @click="removeMark()">
                        Remove
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text @click="cancelMark()">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" text @click="updateMark()">
                        Update
                    </v-btn>
                </div>
            </div>
        </v-menu>
    </div>
</template>
<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { find, findIndex, extend, last, sortBy } from "lodash"
import { v4 } from "uuid"
import moment from "moment"

window.moment = window.moment || moment

const genId = () => last(v4().split("-"))

export default {
    props: ["options", "getPropertyValue"],

    mixins: [djvueMixin, listenerMixin],

    data: () => ({
        focused: null,
        menu: null,
        edited: null,
        menu: false
    }),


    computed: {

        decoration() {
            return (this.options && this.options.decoration) ? this.options.decoration : {}
        },

        settings() {
            return (this.options && this.data) ? this.data : {}
        },

        chunks() {
            if (!this.options || !this.data) return []
            this.data.entities = this.data.entities || []

            this.data.entities.forEach(e => {
                e.id = e.id || genId()
            })

            this.data.entities = sortBy(this.data.entities, d => d.start)

            this.$chunks = this.generateChunks(this.data)

            return this.$chunks
        },


    },

    created(){
        this.data = {
            text: (this.options && this.options.data) ? this.getPropertyValue(this.options.data.text) || "" : "",
            entities: (this.options && this.options.data) ? this.getPropertyValue(this.options.data.entities) || [] : [],
            readonly: (this.options && this.options.data) ? this.getPropertyValue(this.options.data.readonly) || false : false
        }
        this.decoration = (this.options) ? this.options.decoration : {}
        this.decoration.entities = (this.options && this.options.decoration) ? this.getPropertyValue(this.options.decoration.entities) || [] : [],

        }    
    },

    methods: {

        // generate text chunks
        generateTextChunks(text, start) {
            
            let chunks = [];
            const snippets = text.split("\n")
            snippets.forEach((s, index) => {
                    
                chunks.push({
                    type: (!!s.trim()) ? "text" : "whitespaces",
                    content: s,
                    start
                })
                
                start += s.length
                

                if (index < snippets.length - 1) {
                    
                
                        chunks.push({
                            type: "wrap",
                            content: "↵",
                            start
                        })

                    start++
                    
                }

            })

            return chunks
        },


        generateChunks({ text, entities }) {
            let chunks = [];
            let currentPos = 0;

            let enabledEntities = entities.filter( e => !e.disabled)

            enabledEntities.forEach(e => {

                let part = text.substring(currentPos, e.start+1)
                chunks = chunks.concat(this.generateTextChunks(part, currentPos))
                currentPos += e.start+1


                part = text.substring(e.start, e.end)
                currentPos = e.end
                
                let chunk = {
                    id: e.id,
                    type: "annotation",
                    author: e.author,
                    tag: e.tag,
                    note: e.note,
                    content: part,
                    start: e.start,
                    end: e.end,
                    disabled: e.disabled || false,
                    updatedAt: moment(new Date(e.updatedAt)).format("DD MMM., YYYY HH:mm"),
                    newItem: e.newItem
                }

                chunks.push(chunk);
            })

            let part = text.substring(currentPos)
            chunks = chunks.concat(this.generateTextChunks(part, currentPos))

            return chunks
        },


        isTextIndent(index) {

            if (index === 0) return true;
            const previousChunk = this.chunks[index - 1];
            if (previousChunk.type === "wrap") {
                return true;
            }
            return false;

        },

        tagBackground(entity) {
            if (this.getPropertyValue && this.options.decoration && this.options.decoration.entities) {
                let e = this.getPropertyValue(this.options.decoration.entities)
                let tag = find(e, d => d.tag == entity.tag)
                return (tag) ? tag.color || "#777777" : "#777777"
            }
            return "#777777"
        },

        markBackground(entity) {
            if (this.getPropertyValue && this.options.decoration && this.options.decoration.entities) {
                let e = this.getPropertyValue(this.options.decoration.entities)
                let tag = find(e, d => d.tag == entity.tag)
                return (tag) ? tag.color + "40" || "#77777740" : "#77777740"
            }
            return "#77777740"
        },

        note(entity) {
            return (entity.note) ? entity.note : ""
        },

        setFocus(entity, value) {
            if (value === true) {
                this.focused = entity.id
            } else {
                this.focused = null
            }
        },

        isEdited(entity) {
            if (!this.edited) return false
            return findIndex(this.data.entities, e => e.id == entity.id) >= 0
        },

        border(entity) {
            let highlight = (this.options && this.options.decoration) ? this.getPropertyValue(this.options.decoration.highlight) : false
            if (entity.id == this.focused && highlight) {
                return `2px solid ${this.tagBackground(entity)}`
            } else {
                return `2px solid #ffffff`
            }
        },


        changeMenuModel(data) {
            if (this.needEdit) {
                this.$nextTick(() => {
                    this.edited = JSON.parse(JSON.stringify(this.needEdit))
                    this.needEdit = null
                    this.menu = true
                })

            } else {
                this.edited = null
            }

        },

        updateMark() {
            let index = findIndex(this.data.entities, e => e.id == this.edited.id)
            this.edited.updatedAt = this.edited.$date
            delete this.edited.newItem
            delete this.edited.$date
            this.data.entities.splice(index, 1, extend({}, this.edited))
            this.edited = null
            this.menu = false
        },

        cancelMark() {

            let index = findIndex(this.data.entities, e => e.id == this.edited.id)

            this.data.entities[index].menu = false
            this.data.entities.splice(index, 1, extend({}, this.data.entities[index]))
            this.edited = null
            this.menu = false
        },

        removeMark() {
            let index = findIndex(this.data.entities, e => e.id == this.edited.id)
            this.data.entities.splice(index, 1)
            this.edited = null
            this.menu = false
        },

        startEdit(event) {

            let entityId = event.target.classList.value.split(" ").filter(c => c.startsWith("entity-"))[0]
            entityId = (entityId) ? entityId.split("-")[1] : null
            if (!entityId) return


            let rects = event.target.getClientRects()
            let x = Infinity
            let y = -Infinity
            for (const rect of rects) {
                x = Math.min(x, rect.left)
                y = Math.max(y, rect.bottom)
            }

            y += 8

            let f = find(this.data.entities, d => d.id == entityId)
            if (f) {

                this.setFocus(f, true)

                this.edited = extend({}, f)
                this.edited.position = { x, y }
                this.edited.author = {
                    name: window.user.name,
                    role: window.user.role,
                    photo: window.user.photo
                }
                this.edited.$date = new Date()
                this.edited.updatedAt = moment(new Date(this.edited.$date)).format("DD MMM., YYYY HH:mm")
                this.needEdit = JSON.parse(JSON.stringify(this.edited))
                this.menu = true
            
            }
        },

        changeTag(data) {
            this.edited.tag = data
        },

        changeNote(data) {
            this.edited.note = data
        },

        containsMarks(mark, sourceCollection) {
            return sourceCollection.filter(s =>
                ((s.start > mark.start) && (s.start < mark.end)) ||
                ((s.end > mark.start) && (s.end < mark.end))
            ).length > 0
        },

        selectWords( {start, end} ) {

            const reverseString = str => str.split("").reverse().join("")

            let str = this.data.text.substring(start, end)

            let startOffset = str.indexOf(str.trim())
            let endOffset = reverseString(str).indexOf(reverseString(str).trim()) 

            start += startOffset
            end -= endOffset + 1
            
            const wordRegex = /[ \n\t]/

            while (start >= 0 && !wordRegex.test(this.data.text[start])) {
                start--
            }
            
            
            while (end < this.data.text.length && !wordRegex.test(this.data.text[end])) {
                end++
            }
          
            
            return { start, end }

        },

        getNodeStart(node){ 
            return (node.getAttribute) ? Number.parseInt(node.getAttribute("start")) : null
        },

        onMouseUp(event) {

            const target = event.target;
            if (
                target.classList.contains("text-for-annotation") ||
                target.classList.contains("text-annotation-container")
            ) {

                const selection = window.getSelection();
                if (selection !== null && selection.toString().length) {
                    
                    let focusNode = selection.focusNode
                    let anchorNode = selection.anchorNode
                    
                    let range = selection.getRangeAt(0)
                    let nodeContainer = range.commonAncestorContainer
                    let nodes = (nodeContainer.childNodes.length == 0) 
                        ? [nodeContainer.parentNode]
                        : Array.from(nodeContainer.children).filter( n => n.classList.contains("text-for-annotation"))

                    let i = findIndex(nodes, n => n == range.startContainer.parentNode)
                    let j = findIndex(nodes, n => n == range.endContainer.parentNode)
                   
                    nodes = nodes.slice(i,j+1)

                    let entityRanges = []
                    
                    if(nodes.length == 1){
                        let offset = nodes[0].innerHTML.indexOf(nodes[0].innerText) 
                        entityRanges.push({
                            start: range.startOffset - offset + this.getNodeStart(nodes[0]),
                            end: range.endOffset - offset + this.getNodeStart(nodes[0]),
                            text: this.data.text.substring(
                                range.startOffset-offset+this.getNodeStart(nodes[0]),
                                range.endOffset-offset+this.getNodeStart(nodes[0])
                            )
                        
                        })

                    }

                    if(nodes.length > 1){
                        nodes.forEach((n, index) => {
                            if(index == 0){
                                let offset = n.innerHTML.indexOf(n.innerText) 
                                let length = n.innerText.substring(range.startOffset-offset).length
                                
                                entityRanges.push({
                                    start: range.startOffset - offset + this.getNodeStart(n),
                                    end: range.startOffset-offset+this.getNodeStart(n) + length,
                                    text: this.data.text.substring(
                                        range.startOffset-offset+this.getNodeStart(n),
                                        range.startOffset-offset+this.getNodeStart(n)+length
                                    )
                                })

                            }

                            if(index == nodes.length-1){
                                
                                let offset = n.innerHTML.indexOf(n.innerText) 
                                let length = n.innerText.substring(0, range.endOffset-offset).length
                                
                                entityRanges.push({
                                    start: this.getNodeStart(n),
                                    end: range.endOffset - offset + this.getNodeStart(n),
                                    text: this.data.text.substring(
                                        this.getNodeStart(n),
                                        range.endOffset-offset+this.getNodeStart(n)
                                    )   
                                })
                            }

                            if(index < nodes.length-1 && index > 0){
                                
                                let length = n.innerText.length
                                entityRanges.push({
                                    start: this.getNodeStart(n),
                                    end: this.getNodeStart(n) + length,
                                    text: this.data.text.substring(
                                        this.getNodeStart(n),
                                        this.getNodeStart(n) + length
                                    )
                                })
                            }

                        })
                    }


                    let insertedEntities = []

                    entityRanges.forEach( r => {
                        
                        let start = r.start
                        let end = r.end
                       
                        let wordRange = this.selectWords({ start, end })
                        
                        let tag = find(this.options.decoration.entities, e => e.default)
                        tag = (tag) ? tag.tag : "Note"

                        const newEntity = {

                            id: genId(),
                            tag,
                            author: {
                                name: window.user.name,
                                role: window.user.role,
                                photo: window.user.photo
                            },

                            updatedAt: new Date(),
                            start: wordRange.start,
                            end: wordRange.end,
                            text: this.data.text.substring(wordRange.start, wordRange.end),
                            newItem: true

                        }
                        insertedEntities.push(newEntity)
                    })

                    this.data.entities = this.data.entities.concat(insertedEntities)

                    selection.removeAllRanges()
           
                }

            }
        }






    }
}
</script>