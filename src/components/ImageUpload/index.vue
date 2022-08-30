<template>
    <div>
        <el-upload :on-preview="preview" :file-list="file_list" list-type="picture-card" action="#" :limit="1"
            :on-change="change" :on-remove="remove" :class="{ disabled: fileComputed }" :before-upload="beforeUpload"
            :http-request="upload">
            <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 上传进队条 -->
        <el-progress v-if="showProgress" style="width: 200px;" :percentage="percentage" />
        <el-dialog :visible.sync="showDialog" title="图片预览">
            <el-image :src="imgUrl"></el-image>
        </el-dialog>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
const cos = new COS({
    // 同学们拷贝自己的秘钥和key 只有用自己的key和自己的秘钥才能上传到自己的存储桶里面
    SecretId: 'AKIDPecLnysWtzpOhjUyC9pEM3TcU6RVHn1z', // 身份识别 ID
    SecretKey: 'iALFrCH5crra2D8m9G6h02nJYWDepkNj' // 身份密钥
})

export default ({
    data() {
        return {
            // 图片列表
            file_list: [],
            showDialog: false,
            // 预览时的图片地址
            imgUrl: '',
            // 上传进度条
            percentage: 0,
            // 是否显示进度条
            showProgress: false,
            // 保存当前上传的图片id
            currentId: ''
        }
    },
    components: {

    },
    computed: {
        fileComputed() {
            return this.file_list.length === 1
        }

    },
    methods: {
        // 点击图片时
        preview(file) {
            console.log(file)
            this.imgUrl = file.url
            this.showDialog = true
        },
        // 删除
        remove(file, fileList) {
            this.file_list = this.file_list.filter(item => item.uid !== file.uid)
        },
        change(file, fileList) {
            // some ： 有一个满足条件就返回true 
            // every ： 所有满足条件就返回true 
            this.file_list = fileList.map(item => item)
        },
        beforeUpload(file) {
            // 在上传之前判断类型和大小
            const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
            if (!types.some(item => item === file.type)) {
                this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
                return false
            }
            let maxSize = 5 * 1024 * 1024
            if (file.size > maxSize) {
                this.$message.error('上传图片只能小于5M')
                return false
            }
            this.showProgress = true
            this.percentage = 0
            this.currentId = file.uid
            return true
        },
        // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
        upload(params) {
            // 当有文件的时候才去上传
            if (params.file) {
                cos.putObject({
                    Bucket: 'aijiejie-1307158471',/* 填入您自己的存储桶，必须字段 */
                    Region: "ap-guangzhou", /* 存储桶所在地域，例如ap-beijing，必须字段 */
                    Key: params.file.name,/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                    StorageClass: 'STANDARD',
                    Body: params.file,
                    onProgress: (progressData) => {
                        this.percentage = progressData.percent * 100
                    }
                }, (err, data) => {
                    if (!err && data.statusCode === 200) {
                        // this.file_list = this.file_list.map(item => {
                        //     // 去找谁的uid等于刚刚记录下来的id
                        //     if (item.uid === this.currentId) {
                        //         // 将成功的地址赋值给原来的url属性
                        //         return { url: 'http://' + data.Location, upload: true }
                        //         // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                        //         // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                        //     }
                        //     return item
                        // })
                        // this.file_list = this.file_list.map(item => {
                        //     if (item.uid === this.currentId) {
                        //        
                        //         return { url: 'https://' + data.Location, upload: true }
                        //     }
                        //     return item
                        // })
                        // this.file_list 的地址发生变化 图片会跳来跳去的
                        // 设置upload: true  说明图片已经上传成功，当图片还没有上传成功的时候提示用户 
                        this.file_list[0] = { url: 'https://' + data.Location, upload: true, uid: this.currentId }
                        setTimeout(() => {
                            this.showProgress = false
                            this.percentage = 0
                        }, 1000)
                        // debugger
                    }
                })
            }

        }
    },
})
</script>

<style  >
.disabled .el-upload--picture-card {
    display: none;
}
</style>