var $ =document.querySelector.bind(document);
var $$ =document.querySelectorAll.bind(document);
var heading = $('header h2')
var cdThumb = $('.cd-thumb')
var audio = $('#audio')
var progress = $('#progress')
var nextBtn = $('.btn-next')
var preBtn = $('.btn-prev')
var randomBtn = $('.btn-random')
var repeatBtn = $('.btn-repeat')
var cd = $('.cd');
var playBtn = $('.btn-toggle-play')
var player = $('.player')
var playlist = $('.playlist');
var PLAYER_STORAGE_KEY = 'pro';
var app = {
    currentIxdex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || { },
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Bên trên tầng lầu',
            singer: 'Tăng Duy Tân',
            path: '/music/BenTrenTangLau-TangDuyTan-7580542.mp3',
            image: '/img/bên trên tầng lầu.jfif'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'Da LaB',
            path: '/music/ChuyenDoiTa-EmceeLDaLAB-7120974.mp3',
            image: '/img/chuyện đôi ta.jfif'
        },
        {
            name: 'Có hẹn với thanh xuân',
            singer: 'Su Linh...',
            path: '/music/CoHenVoiThanhXuan-SuniHaLinhHoangDungGREYDDoanTheLanOrangeTlinh-7613769.mp3',
            image: '/img/có hẹn với thanh xuân.jfif'
        },
        {
            name: 'Hai mươi hai',
            singer: 'Amee',
            path: '/music/HaiMuoiHai22-HuaKimTuyenAMEE-7231237.mp3',
            image: '/img/22.jfif'
        },
        {
            name: 'Hãy trao cho anh',
            singer: 'Sơn tùng MPT',
            path: '/music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3',
            image: '/img/hãy trao cho a.jfif'
        },
        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê',
            path: '/music/ViMeAnhBatChiaTay-MiuLe-7503053.mp3',
            image: '/img/vì mẹ a bắt ct.jfif'
        },
        {
            name: 'Yêu đương khó quá thì ...',
            singer: 'Erick',
            path: '/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3',
            image: '/img/yêu đương khó quá.jfif'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIxdex ? 'active' : ''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
       playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIxdex]
            }
        })
    },

    handleEvents: function(){

        const _this = this;
        const cdWidth =cd.offsetWidth
        // Xu ly CD
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Phóng to/thu nhỏ audio
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' :0
            cd.style.opacity = newCdWidth/cdWidth
        }

        // Phát/ dừng nhạc
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play() 
            }
        }
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //Tua nhac 
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        } 
        // Next bai
        nextBtn.onclick = function(){
            if(this.isRandom){
                _this.randomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollActiveSong()
        }
        // Pre bai
        preBtn.onclick = function(){
            if(this.isRandom){
                _this.isRandom()
            }
            else{
                _this.preSong()
            }
            audio.play()
            _this.render()
        }
        //Random
        randomBtn.onclick = function(e){
            _this.isRandom  = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //Khi het bai
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }
        //Lap bai
        repeatBtn.onclick = function(e){
            _this.isRepeat  = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //Click vao bai
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIxdex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIxdex++
        if(this.currentIxdex >= this.songs.length){
            this.currentIxdex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function(){
        this.currentIxdex--
        if(this.currentIxdex < 0 ){
            this.currentIxdex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex == this.currentIxdex)
        this.currentIxdex = newIndex
        this.loadCurrentSong
    },
    scrollActiveSong: function(){
        setTimeout(() => {
            $('.song-active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
           
        }, 300)
    },
    start: function(){
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        
        this.render()
    }
}
app.start()