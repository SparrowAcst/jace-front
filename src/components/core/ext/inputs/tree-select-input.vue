<template>
    <div 
        v-if="options && options.data"
        :class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
        :style="(options.decoration) ? getPropertyValue(options.decoration.style) : 'width: 100%'" 
    >
        <div 
            :class="(selectMode) ? 'elevation-4 d-flex align-start' : 'd-flex align-start'" 
            :style="(selectMode) ? 'position:absolute; background: white; padding:8px; border:1px solid #9e9e9e; border-radius: 4px; z-index:10000;width:100%; margin-left: -12px;' : ''"
        >
        
            <div 
                v-if = "!getPropertyValue(options.data.readonly)"
                class="d-flex flex-column pr-1"
            >
                <v-btn 
                    @click.stop="changeMode()" 
                    transition="slide-x-transition" 
                    x-small
                    fab
                    outlined
                    :class="(needSave) ? 'error white--text mb-3' : 'primary--text mb-3'"
                    class="mb-3"
                >
                    <v-icon>
                        {{ (selectMode) ? 'mdi-keyboard-caps' : 'mdi-menu'}}
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                
                <v-btn 
                    v-if="selectMode && getPropertyValue(options.data.editable) == true" 
                    @click.stop="saveTree" 
                    transition="slide-x-transition" 
                    x-small
                    :disabled = "!needSave"
                    :class = "(needSave) ? 'error white--text mb-3' : 'primary--text mb-3'"
                    fab
                    outlined
                >
                    <v-icon>mdi-content-save-outline</v-icon>
                </v-btn>
            </div>

            <div class="flex" style="border-left:8px solid #cfd8dc;">

                <v-text-field
                  v-if = "getPropertyValue(options.data.searchable) == true"
                  v-model="search"
                  label="Search"
                  flat
                  dense
                  outlined
                  hide-details
                  clearable
                  clear-icon="mdi-close"
                  class="px-2 pb-2"

                ></v-text-field>
                <div>
                    
                    <pre>
                        {{selection}}
                    </pre>
                    <pre>
                        {{getPropertyValue(this.options.data.value)}}
                    </pre>
                    
                        
                </div>    
                <v-treeview
                    v-model = "selection" 
                    :items="(selectMode) ? tree : selectionTree" 
                    item-disabled = "disabled" 
                    :selection-type="selectionType" 
                    :selectable="selectMode" 
                    selected-color="primary" 
                    open-all
                    :open.sync = "openedItems"
                    :hoverable = "selectMode"
                    :search="search"
                    :filter="filter" 
                    @input="changeSelection"
                    class="flex"
                    
                >

                    <template v-slot:label="{ item }">
                        
                        <div 
                            
                            class="d-flex align-center" 
                            style="min-height: 20px;" 
                            @mouseenter="setActive(item,true)" 
                            @mouseleave="setActive(item,false)"
                        >
                            
                            <div v-if="!selectMode || !getPropertyValue(options.data.editable)">
                                <v-icon 
                                    v-if="!item.children"
                                    mdi
                                >
                                    {{ 
                                        ( getPropertyValue(options.decoration) && getPropertyValue(options.decoration.leafIcon) ) 
                                        ? getPropertyValue(options.decoration.leafIcon) 
                                        : 'mdi-circle-small' 
                                    }}
                                </v-icon>
                                {{item.title}}
                            </div>
                            
                            <div v-if="selectMode && getPropertyValue(options.data.editable)" class="flex xs10">
                                
                                <v-edit-dialog 
                                    class="flex xs8" 
                                    large 
                                    @open= "(() => {startEditItem(item)})"
                                    @save= "(() => {saveItem(item)})" 
                                    @cancel="(() => {cancel(item)})"
                                    @close = "(() => {close(item)})"
                                >
                                    <div :class="(item.title == (getPropertyValue(options.data.newItemName) || 'new item')) ? 'error--text' : ''">
                                        {{item.title}}
                                    </div>
                                    
                                    <template v-slot:input>
                                    
                                        <v-text-field 
                                            v-model="item.title" 
                                            label="Edit" 
                                            outlined 
                                            dense
                                            :rules = "[( value => shouldNoDublicates(item, value))]" 
                                            class="mt-2"
                                        ></v-text-field>
                                    
                                    </template>
                                
                                </v-edit-dialog>
                            </div>
                                
                            <v-spacer></v-spacer>
                            
                            <div v-if="selectMode  && getPropertyValue(options.data.editable)" class="flex d-flex justify-end">
                                <v-btn 
                                    class="flex" 
                                    v-show="item.active" 
                                    icon 
                                    @click.stop="downNode(item)" 
                                    x-small
                                    color="primary"
                                    :disabled="disabledUp(item)"
                                >
                                    <v-icon>mdi-arrow-up</v-icon>
                                </v-btn>
                                <v-btn 
                                    class="flex" 
                                    v-show="item.active" 
                                    icon 
                                    @click.stop="upNode(item)" 
                                    x-small
                                    color="primary"
                                    :disabled="disabledDown(item)"
                                >
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                                
                                <v-btn 
                                    class="flex" 
                                    v-show="item.active" 
                                    icon 
                                    @click.stop="addSibling(item)" 
                                    x-small
                                    color="primary"
                                    :disabled="shouldNoDublicates(item, getPropertyValue(options.data.newItemName) || 'new item' ) != true"
                                >
                                    <v-icon>mdi-table-row-plus-after</v-icon>
                                </v-btn>
                                
                                <v-btn 
                                    class="flex" 
                                    v-show="item.active" 
                                    icon @click.stop="addChild(item)" 
                                    x-small
                                    color="primary"
                                    :disabled="shouldNoChildDublicates(item, getPropertyValue(options.data.newItemName) || 'new item' ) != true"
                                
                                >
                                    <v-icon>mdi-table-column-plus-after</v-icon>
                                </v-btn>
                                
                            </div>
                        </div>
                    </template>
                </v-treeview>
            </div>
        </div>
    </div>

</template>



<script>
import { sortBy, uniqBy, find, findIndex, remove, extend, last, isArray } from "lodash"
import {v4} from "uuid"
 
export default {

    props: ["options", "getPropertyValue"],

    data: () => ({
        needSave: false,
        cancelation: true,
        selection: [],
        openedItems:[],
        selectionType: "independent",
        search: null,

        selectMode: false,
        tree: [],
        selectionTree:[],
        selectionType: 'independent', //'leaf',
    }),
    
    methods: {

        ////////////////////////////// tag controller ///////////////////////////////////////

        findNode(tree, nodeId) {
            let res
            for(const node of (tree || [])){
                if(!res) {
                    if(node.id == nodeId) {
                        res = node
                    } else {
                        res = this.findNode((node.children || []), nodeId)
                    }
                }    
            }
            return res
        },

        flat2tree(flat, rootId, editable) {


            let res

            let root = find(flat, f => f.id == rootId)
            
            if (!root) {
                res = sortBy(flat.filter(d => d.path.length == 1), d => d.index)
            } else {
                res = sortBy(flat.filter(d => {
                    return d.name.startsWith(`${root.name}/`) && d.path.length == root.path.length+1
                }), d => d.index)
            }

            res = res.map(d => _.extend({}, d))

            res.forEach(node => {
                node.children = this.flat2tree(flat, node.id)
                if (node.children.length == 0) {
                    delete node.children

                } else {
                    node.children = sortBy(node.children, d => d.index)
                    // if(this.getPropertyValue(this.options.data.leafonly)){
                    //     // node.disabled = true    
                    // }
                     
                }
            })

            return res

        },

        filterTree(flat, selection) {

            let leafs = flat.filter(d => selection.includes(d.id))
            let nodes = []
            leafs.forEach(l => {
                for (let i = 0; i < l.path.length; i++) {
                    let name = l.path.slice(0, i + 1).join("/")
                    let f = _.find(flat, f => {
                        return f.name == name
                    })
                    nodes.push(_.extend({}, f))
                }
            })
            return this.flat2tree(uniqBy(nodes, d => d.id))
        },

        getParent(flat, nodeId) {
            let node = find(flat, f => f.id == nodeId)
            if (!node) return
            let path = node.name.split("/")    
            let name = path.slice(0, path.length - 1).join("/")
            return find(flat, f => f.name == name)
        },

        getChilds(flat, nodeId) {
            let node = _.find(flat, f => f.id == nodeId)
            if (!node) return []
            return sortBy(
                flat
                    .filter(f => f.name.startsWith(`${node.name}/`) && f.name.split("/").length == node.name.split("/").length + 1)
                    .filter(d => d), 
                d => d.index
            )
        },

        getSiblings(flat, nodeId) {

            let parent = this.getParent(flat, nodeId)
            if (!parent) return sortBy(flat.filter(d => d.name.split("/").length == 1), d => d.index)

            let childs = this.getChilds(flat, parent.id)
            if (!childs) return []
            return sortBy(childs.filter(d => d), c => c.index)

        },

        getTree(flat, nodeId) {
            let res = flat.filter(f => f.id == nodeId).concat(this.getChilds(flat, nodeId))
            let subTree = []
            res.forEach(d => {
                subTree = subTree.concat(this.getChilds(flat, d.id))
            })

            return uniqBy(res.concat(subTree), d => d.id)

        },


        addNode(flat, node) {

            node.index = Infinity
            flat.push(node)
            let list = this.getSiblings(flat, node.id)
            list.forEach((l, index) => {
                l.index = index
            })

        },

        moveupNode(flat, node) {

            let list = this.getSiblings(flat, node.id)
            let index = findIndex(list, f => f.id == node.id)
            if (index > 0) {
                [list[index - 1], list[index]] = [list[index], list[index - 1]]
            }

            list.forEach((l, index) => {
                l.index = index
            })
        },


        movedownNode(flat, node) {

            let list = this.getSiblings(flat, node.id)
            let index = findIndex(list, f => f.id == node.id)
            if (index < list.length - 1) {
                [list[index + 1], list[index]] = [list[index], list[index + 1]]
            }
            list.forEach((l, index) => {
                l.index = index
            })
        },

        deleteNode(flat, nodeId) {

            let list = this.getTree(flat, nodeId).map(d => d.id)
            remove(flat, f => list.includes(f.id))

        },

        rebaseTree(flat, node, newName){

            let list = this.getTree(flat, node.id)
            let replaced = node.name
            list.forEach( item => {

                item.name = item.name.replace(replaced, newName)
            })

        },

        normalizeItems(items){
          
          if(items && isArray(items)){

            let previewData = items.map( d => extend({}, d))
            previewData.forEach( d => {
              d.path = d.name.split("/")
              d.title = last(d.path)
              d.active = false
            })
            
            return previewData
          }
          
          return []
        },

        changeSelection(data){
            
            if(this.selectMode){
                // let resp = this.getPropertyValue(this.options.data.value)
                // resp = data
                // this.selectionTree = this.filterTree(this.normalizeItems(this.getPropertyValue(this.options.data.items)), data)
            }
            // console.log("changeSelection", data.map(d => this.findNode(this.tree, d)))
            this.$emit("change", this, data)    
        
        },

        /////////////////////////////////////////////////////////////////////////////////////

        disabledUp(item){
        
            return item.index == 0
        
        },    

        disabledDown(item){
        
            let data = this.normalizeItems(this.getPropertyValue(this.options.data.items))
            let res = this.getSiblings(data, item.id).length
            if( res == 0 ){
                res = data.filter(d => d.path.length == 1).length
            }
            return item.index == res-1
        },

        /////////////////////////////////////////////////////////////////////////////////////


        upNode(item){

            this.needSave = true


            let sourceData = this.getPropertyValue(this.options.data.items)
            let data = this.normalizeItems(sourceData)
            this.movedownNode(data, item)
            data.forEach( d => {
                let f = find(sourceData, s => s.id == d.id)
                if(f){
                    f.index = d.index
                }
            })
            this.tree = this.flat2tree(data)
        },

        downNode(item){

            this.needSave = true


            let sourceData = this.getPropertyValue(this.options.data.items)
            let data = this.normalizeItems(sourceData)
            this.moveupNode(data, item)
            data.forEach( d => {
                let f = find(sourceData, s => s.id == d.id)
                if(f){
                    f.index = d.index
                }
            })
            this.tree = this.flat2tree(data)
        },


        addChild(item){
            
            this.needSave = true


            let sourceData = this.getPropertyValue(this.options.data.items)
            let parentNode = find(sourceData, s => s.id == item.id)
            let newItem = {
                id: v4(),//this.randomName(),
                name:`${item.name}/${this.getPropertyValue(this.options.data.newItemName) || 'new item'}`,
                index: Infinity
            }
            sourceData.push(newItem)
            
            let data = this.normalizeItems(sourceData)
            
            this.tree = this.flat2tree(data)  
            this.openedItems.push(item.id)
        },

        addSibling(item){

            this.needSave = true


            let sourceData = this.getPropertyValue(this.options.data.items)
            let name = (item.path.length == 1) ? (this.getPropertyValue(this.options.data.newItemName) || 'new item') : `${item.path.slice(0, item.path.length-1).join("/")}/${this.getPropertyValue(this.options.data.newItemName) || 'new item'}`

            let newItem = {
                id: v4(), //this.randomName(),
                name,
                index: item.index + 0.0001
            }

            sourceData.push(newItem)
            
            let data = this.normalizeItems(sourceData)
            
            this.tree = this.flat2tree(data)  
        },

        //////////////////////////////////////////////////////////////////////////////////////

        siblingName(item, value){
            return `${path.slice(0, path.length-1).join("/")}/${value}`
        },

        childName(item, value){
            return `${item.name}/${value}`
        },
        

        shouldNoDublicates(item, value){
        
                if(item.title == (this.getPropertyValue(this.options.data.newItemName) || 'new item')) return 'Enter valid name'
                let sourceData = this.getPropertyValue(this.options.data.items)
                let path = item.name.split("/")
                let checkedValue = (path.length == 1) ? value : `${path.slice(0, path.length-1).join("/")}/${value}`
                let doublicates = this.getSiblings(sourceData, item.id).filter( d => d.name == checkedValue).filter(d => d.id != item.id)
                return (doublicates.length == 0) ? true : "Already exists"
        
        },

        shouldNoChildDublicates(item, value){
        
                if(item.title == (this.getPropertyValue(this.options.data.newItemName) || 'new item')) return 'Enter valid name'
                let sourceData = this.getPropertyValue(this.options.data.items)
                let path = item.name.split("/")
                let checkedValue = `${item.name}/${value}`
                let doublicates = this.getChilds(sourceData, item.id).filter( d => d.name == checkedValue).filter(d => d.id != item.id)
                return (doublicates.length == 0) ? true : "Already exists"
        
        },

        //////////////////////////////////////////////////////////////////////////////////////

        close(item){
            if(this.cancelation){
                this.cancel(item)
            }
            this.cancelation = true
        },

        cancel(item){
        
            let sourceData = this.getPropertyValue(this.options.data.items)
            let f = find(sourceData, f => f.id == item.id)
            f.name = this.oldName
            let data = this.normalizeItems(sourceData)
            this.tree = this.flat2tree(data)
            this.cancelation = false                        
            
        },

        changeMode(){
            
            this.selectMode = !this.selectMode
            
            if(!this.selectMode){
                let sourceData = this.getPropertyValue(this.options.data.items)
                let data = this.normalizeItems(sourceData)
                this.selectionTree = this.filterTree(data, this.getPropertyValue(this.options.data.value) || [])
            } else {
                setTimeout(() => {
                    this.selection = this.getPropertyValue(this.options.data.value)                    
                }, 10)
            } 

            // console.log(this.selection)
            
        },

        saveTree(){
            this.needSave = false
            this.$emit("command", this, {command:"save-tree"})
        },

        startEditItem(item){
            this.oldName = item.name
        },

        saveItem(item){

            this.needSave = true

            let sourceData = this.getPropertyValue(this.options.data.items)
            

            if(this.shouldNoDublicates(item, item.title) != true) {
                setTimeout(() => {
                    let f = find(sourceData, f => f.id == item.id)
                    f.name = this.oldName
                    let data = this.normalizeItems(sourceData)
                    this.tree = this.flat2tree(data)                        
                }, 20)
                return
            }

            if( item.title ) {
                let newName = (item.path.length == 1) ? item.title : `${item.path.slice(0, item.path.length-1).join("/")}/${item.title}`
                let f = find(sourceData, f => f.id == item.id)
                this.rebaseTree(sourceData, f, newName)
                // f.name = newName
            } else {
                this.deleteNode(sourceData, item.id)
            }    

            let data = this.normalizeItems(sourceData)
            this.tree = this.flat2tree(data)
            this.cancelation = false
            // this.selectionTree = this.filterTree(data, this.getPropertyValue(this.options.data.value) || [])  
        },

        setActive: (item, value) => {
            item.active = value
        }


    },

    computed: {
        filter () {
          return (item, search, textKey) => item.title.toUpperCase().indexOf(search.toUpperCase()) > -1
        },
    },    

    created(){

      let items =  this.getPropertyValue(this.options.data.items)
      this.selectionType =  (this.getPropertyValue(this.options.data.leafonly)) ? 'leaf' : 'independent'
      
      if( items && isArray(items)){

        let data = this.normalizeItems(items)
      
        this.tree = this.flat2tree(data)

        let selection = this.getPropertyValue(this.options.data.value)
      
        if(!selection){
      
            this.selectionTree = []    
      
        } else {
            this.selection = selection
            this.selectionTree = this.filterTree(data, selection)
      
        }    
         
      } else {
        
        this.tree = []
        this.selectionTree = []
      
      }

  }
}

</script>
<style>
.v-treeview-node__root {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-height: auto;
    /* height: 24px !important; */
    padding-left: 8px;
    padding-right: 8px;
    position: relative;
    padding: 3px 0;
}

.v-icon.v-icon {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-font-feature-settings: "liga";
    font-feature-settings: "liga";
    font-size: 20px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    letter-spacing: normal;
    line-height: 1;
    position: relative;
    text-indent: 0;
    -webkit-transition: .3s cubic-bezier(.25, .8, .5, 1), visibility 0s;
    transition: .3s cubic-bezier(.25, .8, .5, 1), visibility 0s;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.v-treeview-node__label {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: inherit;
    line-height: 0.9;
    /*color: rgba(0, 0, 0, .6);*/
}

.v-application--is-ltr .v-treeview-node__prepend {
    margin-right: 0;
    min-width: 0;
}



</style>