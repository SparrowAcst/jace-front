<template>
  <v-treeview class="dj-tree pa-2 body-1" :items="tree" open-on-click :open="open" transition item-text="" dense>
    <template slot="prepend" slot-scope="{ item }">
      <div v-if="item.snippet" class="body-1 font-weight-light primary--text" @click="insert(item.snippet)">
        {{item.title}}
      </div>
      <div v-else class="body-1 font-weight-light secondary--text">
        {{item.title}}
      </div>
    </template>
  </v-treeview>
</template>
<script>
import tree from "./snippets.js"

export default {

  props: ["editor"],

  methods: {
    insert(snippet) {
      if (!this.editor) return
      this.editor.insert(snippet)
      this.$emit("select")
    }
  },

  data: () => ({
    open: [],
    active: [],
    tree
  })
}

</script>
<style>
.dj-tree .v-treeview-node__root {
  display: flex;
  align-items: center;
  height: auto !important;
}

.dj-tree .v-treeview-node__content {
  display: flex;
  flex-grow: 1;
  align-items: center;
  flex-shrink: inherit !important;
}

table.v-table tbody td,
table.v-table tbody th {
  height: 2em;
}

.v-treeview--dense .v-treeview-node__root {
  min-height: 1.3em !important;
}

</style>
