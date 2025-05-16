<template>
    <div v-if="options && getPropertyValue" class="text-annotation-container" :class="(options.decoration && options.decoration.class) ? getPropertyValue(options.decoration.class) || '' : ''" :style="(options.decoration && options.decoration.style) ? getPropertyValue(options.decoration.style) || '' : ''" v-on:mouseup="onMouseUp"

    >
            
            <!-- OPTIONS
            <br/>
            {{options.decoration}}
            <br/>
            CLASS
            <br/>
            {{getPropertyValue(options.decoration.class)}}
            <br/>
             -->

        
        <template v-for="(item, index) in $chunks">

            <span class="text-for-annotation" v-if="item && item.type === 'text'" :key="index" :class="{ 'text-indent': isTextIndent(index)}" style="padding: 0px;" :start="item.start">
                {{item.content}}
            </span>
            <span v-if="item && item.type === 'whitespaces'"> {{item.content}} </span>
            <br v-if="item && item.type === 'wrap'"  :start="item.start" />
            <br v-if="item && item.type === 'wrap'"  :start="item.start" />
            
            <span v-if="item && item.type === 'annotation'" class="text-annotation mr-1" @mouseover="setFocus(item.id, true)" @mouseleave="setFocus(item.id, true)" @click="startEdit" :style="{ border: border(item), cursor: 'default'}" :start="item.start">
                <v-tooltip v-if="showTooltip" bottom color="#00000000" open-delay=500>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-if="item" v-bind="attrs" v-on="on" style="cursor: pointer" :class="'entity-'+item.id">
                            <span v-if="showTag" class="text-annotation__annotation font-weight-light px-2" :class="'entity-'+item.id" :style="{ backgroundColor: tagBackground(item), color: 'white', padding: '0.05em 0' }">
                                {{ tagName(item) }}
                            </span>
                            <span class="text-annotation__word">
                                <span class="px-2" :class="'entity-' + item.id + ' ' + highlightClass(item)" :style="{backgroundColor: markBackground(item), padding: '0.05em 0'}">
                                    {{ item.content }}
                                </span>
                            </span>
                            	
                        </span>
                    </template>
                    <div class="secondary--text pa-2 ma-1" style="background: #ffffff; border: 1px solid #bbbbbb;">
                        <div v-if="showTooltipTag" class="title" :style="{color: tagBackground(item)}">
                            {{item.tag}}
                        </div>
                        <!-- <div v-if="showDate" class="subtitle-2 text-right" style="margin-top:-0.5em;">
                            {{item.updatedAt}}
                        </div> -->
                        <div v-if="showAuthor" class="d-flex align-center" style="">
                            <v-avatar size=36 >
                                <img :src="item.author.photo" >
                            </v-avatar>
                            <div class="px-3" style="line-height:0.7">
                                <div class="subtitle-2">{{item.author.name}}</div>
                                <div class="caption" style="margin-top: -0.6em;">{{item.updatedAt}}</div>
                            </div>
                        </div>
                        <pre v-if="showComment" class="caption  pt-2" style="line-height: 1">{{comment(item)}}</pre>
                    </div>
                </v-tooltip>
                <span v-else :class="'entity-'+item.id" style="cursor: pointer">
                    <span v-if="showTag" class="text-annotation__annotation font-weight-bold px-2" :class="'entity-'+item.id" :style="{ backgroundColor: tagBackground(item), color: 'white', padding: '0.05em 0' }">
                        {{ tagName(item) }}
                    </span>
                    <span class="text-annotation__word">
                        <span class="px-2" :class="'entity-'+item.id + ' ' + highlightClass(item)" :style="{backgroundColor: markBackground(item), padding: '0.05em 0' }">
                            {{ item.content }}
                        </span>
                    </span>
                </span>
            </span>
        </template>
        <v-menu 
        	v-if="edited && !readonly" 
        	v-model="menu" 
        	:close-on-content-click="false" 
        	min-width=450
            max-width=450 
        	:position-x="edited.position.x" 
        	:position-y="edited.position.y" 
        	@input="changeMenuModel" 
        	z-index=5000
        >
            <div class="primary lighten-2 white--text pa-2 title">
                Edit tag
            </div>    
                    
            <div class="secondary--text px-1 pt-3" style="background: #ffffff">
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
                    <v-autocomplete class="mb-2" hide-details outlined dense :value="edited.tag" label="Tag" :items="(options.decoration && options.decoration.entities) ? getPropertyValue(options.decoration.entities).map( d => d.tag) || [] : []" @change="changeTag">
                    </v-autocomplete>
                    <v-textarea class="mb-2" rows=10 v-if="editable" hide-details outlined :value="textChanges" label="Text" @input="changeText"></v-textarea>
                    <v-textarea class="mb-2" hide-details outlined :value="edited.comment" label="Comment" @input="changeComment"></v-textarea>
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
import { find, findIndex, extend, first, last, sortBy, isUndefined } from "lodash"
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
        menu: false,
        textChanges:"",
        originalText:""
    }),


    computed:{
        
        showTooltip(){

            let tooltip = this.decoration.tooltip || {}
            let show =  !isUndefined(tooltip.show) ? tooltip.show : true
            return show
            
        },

        showTag(){

            let tag = this.decoration.tag || {}
            let show =  (!isUndefined(tag.show)) ? tag.show : true
            return show
            
        },

        
        showTooltipTag(){

            let tooltip = this.decoration.tooltip || {}
            let show =  !isUndefined(tooltip.tag) ? tooltip.tag : true
            return show
        
        },


        showDate(){

            let tooltip = this.decoration.tooltip || {}
            let show =  !isUndefined(tooltip.updatedAt) ? tooltip.updatedAt : true
            return show
            
        },

        showAuthor(){

            let tooltip = this.decoration.tooltip || {}
            let show =  !isUndefined(tooltip.author) ? tooltip.author : true
            return show
            
        },

        showComment(){

            let tooltip = this.decoration.tooltip || {}
            let show =  !isUndefined(tooltip.comment) ? tooltip.comment : true
            return show
            
        },


    },

    created(){
        
            if(!this.options) return

            this.text = (this.options && this.options.data) ? this.getPropertyValue(this.options.data.text) || "" : ""
            this.text = this.text.replace(/[ ]{2,}/g, " ")
            this.entities = (this.options && this.options.data) ? this.getPropertyValue(this.options.data.value) || [] : []
            this.readonly = (this.options && this.options.data) ? this.getPropertyValue(this.options.data.readonly) || false : false
            this.editable = (this.options && this.options.data) ? this.getPropertyValue(this.options.data.editable) || false : false
            
            this.decoration = {
                entities: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.entities) || [] 
                    : [],
                tag: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.tag) || {
                                                                              "show": true,
                                                                              "tagname": true
                                                                             } 
                    : {
                          "show": true,
                          "tagname": true
                      },
                tooltip: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.tooltip) || {
                                                                                  "show": true,
                                                                                  "tag": true,
                                                                                  "author": true,
                                                                                  "updatedAt": true,
                                                                                  "note": true
                                                                                 } 
                    : {
                      "show": true,
                      "tag": true,
                      "author": true,
                      "updatedAt": true,
                      "note": true
                     },

                highlight: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.highlight) || {
                                                                                      "show": true,
                                                                                      "class": "font-weight-bold"
                                                                                  }
                    : {
                          "show": true,
                          "class": "font-weight-bold"
                      },

                class: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.class) || "" 
                    : "",

                style: (this.options && this.options.decoration) 
                    ? this.getPropertyValue(this.options.decoration.style) || "" 
                    : "",                        
            }  
        
        
            if(this.chunks) this.chunks()        
    
    },

    methods: {

        chunks() {
            if (!this.options) return []
            
            let text = this.text || ""

            
            this.entities.forEach(e => {
                e.id = e.id || genId()
            })

            this.entities = sortBy(this.entities, d => d.start)

            this.$chunks = this.generateChunks({text, entities: this.entities})

            // console.log("$chunks", this.$chunks)

            return this.$chunks
        },

        // generate text chunks
        generateTextChunks(text, start) {
            
            let chunks = [];
            const snippets = text.split("\n")
            snippets.forEach((s, index) => {
            	    
                // chunks.push({
                //     type: (!!s.trim()) ? "text" : "whitespaces",
                //     content: s.trim(),
                //     start
                // })

                chunks.push({
                    type: "text",
                    content: s,
                    start
                })
	            
	            start += s.length
	            

                if (index < snippets.length - 1) {
                    
                
	                    chunks.push({
	                        type: "wrap",
	                        content: "\n",
	                        start
	                    })

	                start++
	                
                }

            })

            return chunks.map( c => {
                if(c.type == "text" && !c.content.trim()){
                    c.type = "whitespaces" 
                }
                return c
            })
        },


        generateChunks({ text, entities }) {
            let chunks = [];
            let currentPos = 0;

            let enabledEntities = entities.filter( e => !e.disabled)

            enabledEntities.forEach(e => {

                let part = text.substring(currentPos, e.start)
                chunks = chunks.concat(this.generateTextChunks(part, currentPos))
                currentPos += e.start+1


                part = text.substring(e.start, e.end)
                currentPos = e.end
                
                let chunk = {
                    id: e.id,
                    type: "annotation",
                    author: e.author,
                    tag: e.tag,
                    comment: e.comment,
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
            return false;

        },

        tagBackground(entity) {
                let tag = find(this.decoration.entities, d => d.tag == entity.tag)
                return (tag) ? tag.color || "#777777" : "#777777"
        },

        tagName(entity){

            let tag = this.decoration.tag || {}
            let name =  !isUndefined(tag.tagname) ? tag.tagname : true
            return (name == true) ? entity.tag : (name) ? name : entity.tag
            
        },



        markBackground(entity) {
                let tag = find(this.decoration.entities, d => d.tag == entity.tag)
                return (tag) ? tag.color + "40" || "#77777740" : "#77777740"
        },

        comment(entity) {
            return (entity.comment) ? entity.comment : ""
        },

        setFocus(entityId, value) {

            if(!entityId){
                this.focused = null
                return
            }

            if (value === true) {
                this.focused = entityId
            } else {
                this.focused = null
            }
        },

        isEdited(entity) {
            if (!this.edited) return false
            return findIndex(this.entities, e => e.id == entity.id) >= 0
        },

        border(entity) {

            let highlight = this.decoration.highlight || {}
            let show =  !isUndefined(highlight.show) ? highlight.show : true

            if (entity.id == this.focused && show) {
                return `2px solid ${this.tagBackground(entity)}`
            } else {
                return `2px solid #ffffff`
            }
        },

        highlightClass(entity){
            let highlight = this.decoration.highlight || {}
            let _class =  this.getPropertyValue(highlight.class) || ""
            let show =  !isUndefined(highlight.show) ? highlight.show : true

            if (entity.id == this.focused && show) {
                return _class
            } else {
                return ""
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

        // getTextFromTags(){
            
        //     let res = [
        //         this.text.substring(0, ( first( this.entities )) ? first( this.entities ).start+1 : 0 )
        //     ]
            
        //     console.log("-0-",JSON.stringify(this.text.substring(0, ( first( this.entities )) ? first( this.entities ).start : 0 ) ))
               
        //     res = res.filter( d => d)
            
        //     for(let i = 0; i <  this.entities.length; i++){
               
        //        let c = this.entities[i]
        //        let n = this.entities[i+1]
               
        //        res.push( c.text ) //this.text.substring(c.start, c.end) )
        //        console.log("-2-",c.start, c.end, JSON.stringify(c.text))
        //        if(n){
        //         res.push( this.text.substring(c.end, n.start) )
        //         console.log("-3-",c.end, n.start, JSON.stringify(this.text.substring(c.end, n.start) ))
                
        //        }
                  
        //     }

        //     let e = ( last( this.entities ) ) ? last( this.entities ).end : 0
        //     res.push( this.text.substring(e) )
        //     console.log("LAST", this.text.substring(e))
        //     return res.filter( d => d ).join("")

        // },

        getTextFromTags(){
            return this.$chunks.map( c => c.content).join("")

        },        

        updateMark() {

            // console.log("$chunks", this.$chunks)

            let index = findIndex(this.entities, e => e.id == this.edited.id)
            
            let chunk = find(this.$chunks, c => c.id == this.edited.id)
            
            if (chunk){
                chunk.content = this.textChanges.split("\n").join(" ")
            }

            this.text =  this.getTextFromTags()

            this.edited.updatedAt = this.edited.$date
            delete this.edited.newItem
            delete this.edited.$date
            this.entities.splice(index, 1, extend({}, this.edited))

            
            let currentPos = 0

            this.$chunks.forEach( c => {
                
                if(c.type == "annotation"){
                    let e = find( this.entities, e => e.id == c.id)
                    if(e){
                        e.start = currentPos
                        e.end = currentPos+c.content.length
                        e.text = this.text.substring(e.start, e.end)
                        e.content = c.content
                    }   
                } 
                currentPos = currentPos + c.content.length
            })


            // this.entities = this.entities.filter( e => e.text)

            if(this.textChanges.length > 0){
                this.setFocus(this.edited.id, true)
            } else {
                this.setFocus(null, true)
            }    
            
            this.edited = null
            this.menu = false
            this.$emit("change", this, { text: this.text, entities: this.entities } )
            this.chunks()
            
        },

        cancelMark() {

            let index = findIndex(this.entities, e => e.id == this.edited.id)

            this.entities[index].menu = false
            this.entities.splice(index, 1, extend({}, this.entities[index]))
            this.edited = null
            this.menu = false
        },

        removeMark() {
            let index = findIndex(this.entities, e => e.id == this.edited.id)
            this.entities.splice(index, 1)
            this.edited = null
            this.menu = false
            if(this.entities.length >0){
                this.setFocus(last(this.entities).id, true)    
            } else {
                this.setFocus(null, true)
            }
            
            this.$emit("change", this, { text: this.text, entities: this.entities } )
            this.chunks()
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

            let f = find(this.entities, d => d.id == entityId)
            if (f) {

            	this.setFocus(f.id, true)

                this.edited = extend({}, f)
                this.edited.position = { x, y }
                this.edited.author = {
                    name: window.user.name,
                    role: window.user.role,
                    photo: window.user.photo
                }
                
                this.textChanges = this.edited.text
                this.originalText = this.edited.text

                this.edited.$date = new Date()
                this.edited.updatedAt = moment(new Date(this.edited.$date)).format("DD MMM., YYYY HH:mm")
                this.needEdit = JSON.parse(JSON.stringify(this.edited))
                this.menu = true
            
            }
        },

        changeTag(data) {
            this.edited.tag = data
        },

        changeComment(data) {
            this.edited.comment = data
        },

        changeText(data) {
            this.textChanges = data
            // console.log(JSON.stringify(this.textChanges))
        },


        containsMarks(mark, sourceCollection) {
            return sourceCollection.filter(s =>
                ((s.start > mark.start) && (s.start < mark.end)) ||
                ((s.end > mark.start) && (s.end < mark.end))
            ).length > 0
        },

        selectWords( {start, end} ) {

        	const reverseString = str => str.split("").reverse().join("")

        	let str = this.text.substring(start, end)
            // console.log(">",JSON.stringify(str))
        	let startOffset = str.indexOf(str.trim())
        	let endOffset = reverseString(str).indexOf(reverseString(str).trim()) 

        	start += startOffset
        	end -= endOffset + 1
        	
            // console.log(">>",JSON.stringify(this.text.substring(start, end)))

            const wordRegex = /[ \n\t]/

            while (start >= 0 && !wordRegex.test(this.text[start])) {
                // console.log(start, JSON.stringify(this.text[start]), !wordRegex.test(this.text[start]))
                start--
            }
          	
            start++
            
            while (end < this.text.length && !wordRegex.test(this.text[end])) {
                // console.log(end, JSON.stringify(this.text[end]), !wordRegex.test(this.text[end]))
                end++
	        }
            
            // console.log(">>>",JSON.stringify(this.text.substring(start, end)))

            return { start, end }

    },

        getNodeStart(node){ 
        	return (node.getAttribute) ? Number.parseInt(node.getAttribute("start")) : null
        },

        getOffset(node){
            let offset = 0
            let searchString = node.innerHTML
            let symbol = node.innerText[0]
            while(searchString[offset] != symbol && offset < searchString.length) {
                offset++
            }    
            return offset    
        },

        onMouseUp(event) {

            if(this.readonly) return

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
                    	let offset = this.getOffset(nodes[0]) //.innerHTML.indexOf(nodes[0].innerText) 
                    	
                        entityRanges.push({
                    		start: range.startOffset - offset + this.getNodeStart(nodes[0]),
                    		end: range.endOffset - offset + this.getNodeStart(nodes[0]),
                    		text: this.text.substring(
                    			range.startOffset-offset+this.getNodeStart(nodes[0]),
                    			range.endOffset-offset+this.getNodeStart(nodes[0])
                    		)
                    	
                    	})

                        // console.log("<",JSON.stringify(this.text.substring(
                        //         range.startOffset-offset+this.getNodeStart(nodes[0]),
                        //         range.endOffset-offset+this.getNodeStart(nodes[0])
                        //     )))
                    }

                    if(nodes.length > 1){
                    	nodes.forEach((n, index) => {
                    		if(index == 0){
                    			let offset = this.getOffset(nodes[0]) 
		                    	let length = n.innerText.substring(range.startOffset-offset).length
		                		
		                    	entityRanges.push({
		                    		start: range.startOffset - offset + this.getNodeStart(n),
		                    		end: range.startOffset-offset+this.getNodeStart(n) + length,
		                    		text: this.text.substring(
		                    			range.startOffset-offset+this.getNodeStart(n),
		                    			range.startOffset-offset+this.getNodeStart(n)+length
		                    		)
		                    	})

		                    }

		                    if(index == nodes.length-1){
                    			
                    			let offset = this.getOffset(nodes[0]) 
		                    	let length = n.innerText.substring(0, range.endOffset-offset).length
		                    	
								entityRanges.push({
		                    		start: this.getNodeStart(n),
		                    		end: range.endOffset - offset + this.getNodeStart(n),
		                    		text: this.text.substring(
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
		                    		text: this.text.substring(
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

                        // console.log("<<", start, end, JSON.stringify(this.text.substring(start, end)))
	                   
	                    let wordRange = this.selectWords({ start, end })
	                    
	                    let tag = find(this.decoration.entities, e => e.default)
                        tag = (tag) ? tag.tag : "comment"

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
                            text: this.text.substring(wordRange.start, wordRange.end).trim(),
                            newItem: true

                        }
                        insertedEntities.push(newEntity)
                    })

                    this.entities = this.entities.concat(insertedEntities)
                    
                    this.$emit("change", this, {text: this.text, entities: this.entities})
                    selection.removeAllRanges()
                    this.chunks()
                    setTimeout(() => {
                        this.setFocus(last(this.entities).id, true)
                        setTimeout(() => {
                            this.$forceUpdate()
                        }, 20)
                    }, 
                    20)
                     
                }

            }
        }

    }
}
</script>