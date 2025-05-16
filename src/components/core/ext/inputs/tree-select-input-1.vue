<template>
    <div style="width: 100%">
        <div>
            
            <div class="d-flex justify-end">
                <v-btn icon @click.stop="open = !open" transition="slide-x-transition">
                    <v-icon>{{ (open) ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
                </v-btn>
            </div>
            
            <v-treeview 
                  v-model="selection" 
                  :items="items" 
                  item-disabled="disabled" 
                  :selection-type="selectionType" 
                  :selectable = "open" 
                  selected-color="primary" 
                  open-all hoverable 
                  return-object
                >
                    <template v-slot:prepend="{ item }">
                        <v-icon v-if="item.disabled" style="margin-left: -1.4em; background: white;" class="primary--text">
                            mdi-plus
                        </v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                        <!-- <span style="color:red">{{item.name}}</span> -->
                        <v-edit-dialog :return-value.sync="item.name" large @save="save" @cancel="cancel">
                            <div :class="(item.disabled) ? 'primary--text' : ''">{{item.name}}</div>
                            <template v-slot:input>
                                <v-text-field v-model="item.name" label="Edit" outlined dense class="mt-2"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
            </v-treeview>
          
        </div>
    </div>
    <!-- <treeselect v-model="value" :multiple="true" :options="tree">
        <v-chip slot="value-label" slot-scope="{ node }"
          close
          small
        >
          {{node.label}}
      </v-chip>
      
      <v-chip slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName"
        x-small
      >
          {{ node.isBranch ? 'Branch' : 'Leaf' }}: {{ node.label }}
      </v-chip>

    </treeselect> -->
</template>
<script>
// import treeselect from "@riophae/vue-treeselect"
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    props: ["options", "getPropertyValue"],
    // components: { treeselect },
    data: () => ({
        open: false,
        selectionType: 'leaf',
        selection: [],
        items: [{
                id: 1,
                name: 'Root',
                children: [
                    { id: 2, name: 'Child #1' },
                    { id: 3, name: 'Child #2' },

                    {
                        id: 4,
                        name: 'Child #3',
                        children: [
                            { id: 5, name: 'Grandchild #1' },
                            { id: 6, name: 'Grandchild #2' },
                            { id: 66, name: 'new item', disabled: true },

                        ],
                    },
                    { id: 33, name: 'new item', disabled: true },

                ],
            },
            {
                id: 22,
                name: "new item",
                disabled: true
            },
        ],
    }),
    methods: {

        open: () => {
            console.log("open")
        },

        close: () => {
            console.log("close")
        },

        cancel: () => {
            console.log("cancel")
        },
        save: () => {
            console.log("save")
        },


    },
    // data() {
    //   return {
    //     // define the default value
    //     value: null,
    //     // define options
    //     tree: [ {
    //       id: 'a',
    //       label: 'a',
    //       children: [ {
    //         id: 'aa',
    //         label: 'aa',
    //       }, {
    //         id: 'ab',
    //         label: 'ab',
    //       } ],
    //     }, {
    //       id: 'b',
    //       label: 'b',
    //     }, {
    //       id: 'c',
    //       label: 'c',
    //     } ],
    //   }
    // },
    computed: {
        settings() {
            return (this.options && this.options.data) ? this.options.data : {}
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
    color: rgba(0, 0, 0, .6);
}
</style>