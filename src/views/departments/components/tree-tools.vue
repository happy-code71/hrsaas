<template>
    <el-tree :data="treeData" :props="defaultProps" class="tree" node-key="id" default-expand-all>
        <div class="custom-tree-node" slot-scope="{ data }">
            <el-row type="flex" justify="space-between" style="width: 100%; line-height: 50px;">
                <el-col :span="20">
                    {{ data.name }}
                </el-col>
                <el-col :span="4">
                    <!-- 右侧操作插槽 -->
                    <slot name="action" :data="data">

                    </slot>

                </el-col>
            </el-row>
        </div>
    </el-tree>
</template>
<script>
export default ({
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
        }
    },
    props: ['treeData'],
    created() {
    },
    methods: {
    }
})
</script>

<style scoped>
</style>