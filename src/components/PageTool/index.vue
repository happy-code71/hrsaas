<template>
    <el-card class="page-tool">
        <el-row type="flex" justify="space-between" align="middle">
            <!-- 左边描述 -->
            <el-col>
                <div class="desc" v-if="showDesc">
                    <slot name="desc"></slot>
                </div>
            </el-col>
            <!-- 右边操作 -->
            <el-col>
                <el-row type="flex" justify="end">
                    <div class="action">
                        <slot name="action"></slot>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default ({
    data() {
        return {
        }
    },
    props: {
        showDesc: {
            type: Boolean,
            default: false
        }
    },
    components: {

    }
})
</script>
<style lang="scss">
.page-tool {
    .desc {
        max-width: max-content;
        padding: 10px;
        border: 1px solid #91d5ff;
        background: #e6f7ff;
        border-radius: 3px;

        .el-icon-info {
            color: #409eff;
            margin-right: 5px;
        }
    }
}
</style>