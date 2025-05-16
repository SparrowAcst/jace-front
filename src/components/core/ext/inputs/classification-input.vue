<template>
    <div 
        v-if="options && options.data" 
        :class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
        :style="(options.decoration) ? getPropertyValue(options.decoration.style) : 'width: 100%'"
    >
        <v-text-field v-if="getPropertyValue(options.data.searchable) == true" v-model="search" label="Search" flat dense outlined hide-details clearable clear-icon="mdi-close" class="px-2 pb-2"></v-text-field>
        <div
            :class="(options.decoration && options.decoration.tree) ? getPropertyValue(options.decoration.tree.classes) : ''" 
            :style="(options.decoration && options.decoration.tree) ? getPropertyValue(options.decoration.tree.style) : 'width: 100%'"
        >
            <v-treeview 
                v-model="selection" 
                :items="tree" 
                :selection-type="selectionType" 
                selectable 
                selected-color="primary" 
                :search="search" 
                :filter="filter" 
                @input="changeSelection" 
                class="flex"
            >
                <template v-slot:label="{ item }">
                    <div class="d-flex align-center" style="min-height: 20px;">
                        <div>
                            {{item.title}}
                        </div>
                    </div>
                </template>
            </v-treeview>
        </div>
    </div>
</template>
<script>
import { sortBy, uniqBy, find, findIndex, remove, extend, last, isArray } from "lodash"
import { v4 } from "uuid"

export default {

    props: ["options", "getPropertyValue"],

    data: () => ({
        selection: [],
        selectionType: "leaf",
        search: null,
        tree: [],
    }),

    methods: {

        ////////////////////////////// tag controller ///////////////////////////////////////

        findNode(tree, nodeId) {
            let res
            for (const node of (tree || [])) {
                if (!res) {
                    if (node.id == nodeId) {
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
                    return d.name.startsWith(`${root.name}/`) && d.path.length == root.path.length + 1
                }), d => d.index)
            }

            res = res.map(d => _.extend({}, d))

            res.forEach(node => {
                node.children = this.flat2tree(flat, node.id)
                if (node.children.length == 0) {
                    delete node.children

                } else {
                    node.children = sortBy(node.children, d => d.index)
                }
            })

            return res

        },


        normalizeItems(items) {

            if (items && isArray(items)) {

                let previewData = items.map(d => extend({}, d))
                previewData.forEach(d => {
                    d.path = d.name.split("/")
                    d.title = last(d.path)
                    d.active = false
                })

                return previewData
            }

            return []
        },

        changeSelection(data) {
            this.$emit("change", this, data)
        },
    },

    computed: {
        filter() {
            return (item, search, textKey) => item.title.toUpperCase().indexOf(search.toUpperCase()) > -1
        },
    },

    created() {

        let items = this.getPropertyValue(this.options.data.items)
        this.selectionType = (this.getPropertyValue(this.options.data.leafonly)) ? 'leaf' : 'independent'

        if (items && isArray(items)) {

            let data = this.normalizeItems(items)

            this.tree = this.flat2tree(data)
            this.selection = this.getPropertyValue(this.options.data.value) || []
        } else {
            this.tree = []
            this.selection = []

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