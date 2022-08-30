<template>
    <div class="dashboard-container">
        <div class="app-container">
            <div class="departments">
                <el-card class="box-card" v-loading="loading">
                    <!-- 顶级tree -->
                    <treeToolsVue :treeData="toTree">
                        <template v-slot:action="{ data }">
                            <el-row type="flex" justify="space-between">
                                <el-col>{{ data.manager }}</el-col>
                                <el-col :offset="2">
                                    <el-dropdown>
                                        <span class="el-dropdown-link">
                                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <!-- 顶级数 -->
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="selectMenu({ ...data }, 'add', true)">
                                                添加子部门
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-col>
                            </el-row>
                        </template>
                    </treeToolsVue>
                    <!-- 子孙tree -->
                    <treeToolsVue :treeData="treeData">
                        <template v-slot:action="{ data }">
                            <el-row type="flex" justify="space-between">
                                <el-col>{{ data.manager }}</el-col>
                                <el-col :offset="2">

                                    <el-dropdown>
                                        <span class="el-dropdown-link">
                                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <!-- 子数 -->
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="selectMenu({ ...data }, 'add', false)">
                                                添加子部门
                                            </el-dropdown-item>
                                            <el-dropdown-item @click.native="selectMenu({ ...data }, 'edit', false)">
                                                编辑部门
                                            </el-dropdown-item>
                                            <el-dropdown-item @click.native="deleteDepartment(data.id)">
                                                删除部门
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-col>
                            </el-row>
                        </template>
                    </treeToolsVue>
                </el-card>
                <addDepartmentFromVue v-show="dialogFormVisible" :dialogFormVisible="dialogFormVisible"
                    :setDialogFormVisible="setDialogFormVisible" :treeNode="treeNode" :setIsOk="setIsOk" />
            </div>
        </div>
    </div>
</template>

<script>
import { getDepartments, getDepartmentDetail, deleteDepartment } from '@/api/departments';
import treeToolsVue from './components/tree-tools.vue';
import addDepartmentFromVue from './components/addDepartmentFrom.vue';
import { tranListToTreeData } from '@/utils';

export default {
    data() {
        return {
            loading: false,
            // 数节点数据
            toTree: [],
            treeData: [],

            // 是否开启新增部门组件
            dialogFormVisible: false,
            // 当前的父级部门数据
            treeNode: {},
            // 是否操作成功
            isOK: false,
        };
    },
    async created() {
        this.getDepartments()
    },
    computed: {

    },
    components: {
        treeToolsVue,
        addDepartmentFromVue
    },
    methods: {
        // 点击子菜单时
        async selectMenu(data, actionType, isTopTree) {
            // 获取部门详情
            if (actionType === 'edit') {
                this.dialogFormVisible = !this.dialogFormVisible
                let rel = await getDepartmentDetail(data.id)
                let obj = {
                    data: rel,
                    actionType,
                    isTopTree
                }
                this.treeNode = obj
            } else {
                let obj = {
                    data,
                    actionType,
                    isTopTree
                }
                this.treeNode = obj
                this.dialogFormVisible = !this.dialogFormVisible
            }


        },
        handleNodeClick(data) {
            // this.treeNode = data
        },
        setDialogFormVisible(boolean) {
            this.dialogFormVisible = boolean
        },
        setIsOk(boolean) {
            if (boolean) {
                this.isOK = true
                // 重新请求数据
                this.getDepartments()
                this.isOK = false
            }
        },
        // 请求数据
        async getDepartments() {
            this.loading = true
            let rel = await getDepartments()
            // 过滤数据
            // 优化一下数据
            console.log(rel)
            let toTreeArr = rel.depts.filter(item => parseInt(item.pid) === -1)
            // 这里兼容一下两个接口
            if (!toTreeArr.length) {
                let obj = {
                    code: "1",
                    id: "604e115c7bfcfa45d019d3e9",
                    introduce: "程序员的摇篮",
                    manager: "负责人",
                    name: "传智教育",
                    pid: "-1",
                }
                toTreeArr[0] = obj
            }
            else {
                toTreeArr[0]['manager'] = '负责人'
            }
            this.toTree = [...toTreeArr]
            this.treeData = tranListToTreeData(rel.depts, '')
            this.loading = false
        },
        // 删除部门
        deleteDepartment(id) {
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteDepartment(id)
                // 重新请求数据
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getDepartments()
            }).catch(() => {
            });
        }
    }
}
</script>

<style lang="scss">
.departments {
    width: 100%;

    .box-card {
        width: 100%;
        padding: 20px 100px;
        box-sizing: border-box;
        font-size: 14px;

        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
    }
}

.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 480px;
}
</style>