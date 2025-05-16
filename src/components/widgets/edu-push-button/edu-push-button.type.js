export default {
    name: "edu-push-button-widget",
    icon: "mdi-card-outline",

    getInitialConfig() {

        return {
            type: "edu-push-button-widget",
            name: "noname",
            icon: "mdi-card-outline",
            options: {
                widget: {
                    visible: true
                }

            },

            data: {
                embedded: {
                    "data": {
                        "event": "push"
                    },
                    "decoration": {
                        "title": "Button",
                        "outlined": true,
                        "text": false,
                        "color": "primary",
                        "classes": "mx-1 subtitle-2"
                    }
                }
            }
        }
    }
}    