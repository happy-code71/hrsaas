<template>
    <div>
        <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
    </div>
</template>

<script>
// import screenfull from "screenfull";
export default ({
    data() {
        return {
            isFullScreen: false
        }
    },
    methods: {
        changeScreen() {
            if (this.isFullScreen) {
                document.exitFullscreen()
                this.isFullScreen = false
            } else {
                document.documentElement.requestFullscreen()
                this.isFullScreen = true
            }
            // 原生全屏
            // document.documentElement.requestFullscreen()
            // 原生退出全屏
            // document.exitFullscreen()
        }
    },
    components: {

    }
})
</script>

<style scoped>
</style>