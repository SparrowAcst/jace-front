
import { first, last, isArray, isObject } from "lodash"

function isSpecificValue(val) {
    return (
        val instanceof Buffer
        || val instanceof Date
        || val instanceof RegExp
    ) ? true : false;
}

function cloneSpecificValue(val) {
    if (val instanceof Buffer) {
        var x = Buffer.alloc
            ? Buffer.alloc(val.length)
            : new Buffer(val.length);
        val.copy(x);
        return x;
    } else if (val instanceof Date) {
        return new Date(val.getTime());
    } else if (val instanceof RegExp) {
        return new RegExp(val);
    } else {
        throw new Error('Unexpected situation');
    }
}

/**
 * Recursive cloning array.
 */

function deepCloneArray(arr) {
    var clone = [];
    arr.forEach(function (item, index) {
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            } else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            } else {
                clone[index] = deepExtend({}, item);
            }
        } else {
            clone[index] = item;
        }
    });
    return clone;
}

function safeGetProperty(object, property) {
    return property === '__proto__' ? undefined : object[property];
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
const deepExtend =  function (/*obj_1, [obj_2], [obj_N]*/) {
    if (arguments.length < 1 || typeof arguments[0] !== 'object') {
        return false;
    }

    if (arguments.length < 2) {
        return arguments[0];
    }

    var target = arguments[0];

    // convert arguments to array and cut off target object
    var args = Array.prototype.slice.call(arguments, 1);

    var val, src, clone;

    args.forEach(function (obj) {
        // skip argument if isn't an object, is null, or is an array
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return;
        }

        Object.keys(obj).forEach(function (key) {
            src = safeGetProperty(target, key); // source value
            val = safeGetProperty(obj, key); // new value

            // recursion prevention
            if (val === target) {
                return;

            /**
             * if new value isn't object then just overwrite by new value
             * instead of extending.
             */
            } else if (typeof val !== 'object' || val === null) {
                target[key] = val;
                return;

            // just clone arrays (and recursive clone objects inside)
            } else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);
                return;

            // custom cloning and overwrite for specific objects
            } else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);
                return;

            // overwrite by new value if source isn't object or array
            } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
                target[key] = deepExtend({}, val);
                return;

            // source value and new value is objects both, extending...
            } else {
                target[key] = deepExtend(src, val);
                return;
            }
        });
    });

    return target;
};




class UndoRedo {

        constructor(callbacks) {
            this.stack = []
            this.currentIndex = -1
            this.callbacks = callbacks || {}
        }

        async push(data) {
            
            this.stack.push( deepExtend( {}, { $$data:data }) )
            this.currentIndex++
            if (this.callbacks.push) await this.callbacks.push()
        
        }

        hasUndo(){
            return this.currentIndex > 0
        }

        hasRedo(){
            return this.currentIndex < this.stack.length - 1   
        }

        async undo() {
            if (this.hasUndo()) {
                this.currentIndex--
                if (this.callbacks.undo) await this.callbacks.undo()
                return this.stack[this.currentIndex].$$data


            } else {
                return first(this.stack).$$data
            }
        }

        async redo() {
            if (this.hasRedo()) {
                    this.currentIndex++
                    if (this.callbacks.redo) await this.callbacks.redo()
                    return this.stack[this.currentIndex].$$data
                } else {
                    return last(this.stack).$$data
                }
        }

        get() {
            return this.stack[this.currentIndex].$$data
        }

        async clear(){
            this.stack = []
            this.currentIndex = -1
            if (this.callbacks.redo) await this.callbacks.redo()
        }

        async save(){
            if (this.callbacks.save) await this.callbacks.save()
        }
}

export default UndoRedo