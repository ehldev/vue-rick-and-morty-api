Vue.component('character', {
    template: '#character-template',
    props: ['character'],
    data() {
        return {
            more: false
        }
    },
    methods: {
        toggleMoreInfo() {
            this.more = !this.more
        }
    }
})

const vm = new Vue({
    el: '#app',
    created() {
        this.getCharacters()
        this.infiniteScroll()
    },
    data: {
        characters: [],
        currentPage: 1,
        pages: 0,
        loading: false,
        message: ''
    },
    methods: {
        apiAxios() {
            return axios.get(`https://rickandmortyapi.com/api/character/?page=${this.currentPage}`)
        },
        getCharacters() {
            this.loading = true
            this.apiAxios()
                .then(response => {
                    this.characters = response.data.results
                    this.loading = false
                    // Asignamos el valor total de páginas de la Api a una propiedad local
                    // para una futura evaluación infiniteScroll()
                    this.pages = response.data.info.pages
                })
                .catch(error => {
                    this.message = error.message
                    this.loading = false
                })
        },
        infiniteScroll() {
            window.onscroll = () => {
                this.loading = true

                // True || False
                let bottomOfWindow =
                    document.documentElement.scrollTop + window.innerHeight ===
                    document.documentElement.offsetHeight;

                if (bottomOfWindow) {
                    // Preguntamos si la página actual es menor al total de páginas la Api
                    if (this.currentPage < this.pages) {
                        // Si es así, aumentamos la página actual en 1
                        // importante asignarle el signo < ya que si es igual o mayor, entonces 
                        // se le sumará 1 y la api devolverá un error
                        this.currentPage = this.currentPage + 1;
                        // Y hacemos el pedido de los nuevos datos
                        this.apiAxios()
                            .then(response => {
                                let newData = response.data.results
                                newData.forEach(character => {
                                    this.characters.push(character)
                                })
                                this.loading = false
                            })
                            .catch(error => {
                                this.message = error.message
                                this.loading = false
                            })
                    } else {
                        this.loading = false
                        this.message = 'Ya no hay más personajes para mostrar, bitch!'
                    }
                }
            }
        }
    },
})