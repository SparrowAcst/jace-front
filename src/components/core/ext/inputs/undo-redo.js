class UndoRedo {

        constructor() {
            this.stack = []
            this.currentIndex = -1
        }

        push(data) {
            
            if( currentIndex < this.stack.length-1){
                this.stack = this.stack.slice(0, this.currentIndex)
            }

            this.stack.push(data)
            this.currentIndex++
        
        }

        hasUndo(){
            return this.currentIndex > 0
        }

        hasRedo(){
            return this.currentIndex < this.stack.length - 1   
        }

        undo() {
            if (this.hasUndo) {
                this.currentIndex--
                return this.stack[this.currentIndex]
            } else {
                return this.stack[this.currentIndex]
            }
        }

        redo() {
            if (this.hasRedo) {
                    this.currentIndex++
                    return this.stack[this.currentIndex]
                } else {
                    return this.stack[this.stack.len]
                }
        }

        get() {
            return this.stack[this.currentIndex]
        }
}

export default UndoRedo