Vue.component('note', {
    props: ['note'],
    model: {
        prop: 'note',
    },
    data () {
        return {
            title: this.note.title,
            description: this.note.description,
            urgent: this.note.urgent,
            color: this.note.color ? this.note.color : 'bg-white',

            edit: false,
            options: ['Edit', 'Save'],
            colors: ['bg-danger', 'bg-warning', 'bg-info', 'bg-white'],
        }
    },
    template: `
    <div class="card m-2" :class="color">
        <div class="card-header d-flex justify-content-between">
            <h1>
                <span v-show="urgent">!!!</span>    
                <span ref="title">{{ title }}</span> 
                <span v-show="urgent">!!!</span>
            </h1>
        </div>
        <div class="card-body">
            <p ref="description">{{ description }}</p>
            <span v-show="edit">
                <div class="d-flex">
                    <div @click="changeColor(colors[0])" class="m-2 p-3 btn btn-danger border-dark"></div>
                    <div @click="changeColor(colors[1])" class="m-2 p-3 btn btn-warning border-dark"></div>
                    <div @click="changeColor(colors[2])" class="m-2 p-3 btn btn-info border-dark"></div>
                    <div @click="changeColor(colors[3])" class="m-2 p-3 btn btn-white border-dark"></div>
                </div>
            </span>
            <p v-show="edit"><input type="checkbox" v-model="urgent"> Is urgent</p>
            <div class="d-flex">
                <button class="btn btn-primary m-2" @click="toggleEdit">{{ options[+edit] }}</button>
                <button class="btn btn-success m-2" @click="deleteNote"><b>✓</b></button>
            </div>
        </div>
    </div>
    `,
    methods: {
        toggleEdit(event) {
            this.edit = !this.edit
            this.$refs.title.setAttribute('contenteditable', this.edit)
            this.$refs.description.setAttribute('contenteditable', this.edit)
            if (this.edit == false) {
                this.title = this.$refs.title.innerText
                this.description = this.$refs.description.innerText

                this.$emit('changed', {
                    id: this.note.id,
                    title: this.title,
                    description: this.description,
                    color: this.color,
                    urgent: this.urgent,
                })
            }
        },
        deleteNote(event) {
            this.$emit('delete-note', {id: this.note.id})
        },
        changeColor(color) {
            for (let color of this.colors) {
                this.$el.classList.remove(color)
            }
            this.$el.classList.add(color)
            this.color = color
        }
    },
})