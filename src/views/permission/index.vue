<template>
    <div class="dashboard-container">
        <div class="app-container">
            <PageTool>
                <el-button slot="action" type="primary" size="small" @click="addRole(1, '0')">添加权限</el-button>
            </PageTool>
            <el-table border :data="roleList" row-key="id">
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="标识" align="center" prop="code"></el-table-column>
                <el-table-column label="描述" align="center" prop="description"></el-table-column>
                <el-table-column label="操作" align="center" prop="enVisible">
                    <template slot-scope="{row}">
                        <el-button type="text" v-if="row.type === 1" @click="addRole(2, row.id)">添加</el-button>
                        <el-button type="text" @click="editRole(row.id)">编辑</el-button>
                        <el-button type="text" @click="delPermission(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 新增或编辑弹层 -->
            <el-dialog title="新增权限" :visible="showDialog" @close="btnCancel">
                <!-- 表单 -->
                <el-form :model="formData" ref="roleFrom" label-width="120px" :rules="rules">
                    <el-form-item label="权限名称" prop="name">
                        <el-input v-model="formData.name" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="权限标识" prop="code">
                        <el-input v-model="formData.code" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="权限描述">
                        <el-input v-model="formData.description" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="开启">
                        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
                    </el-form-item>
                </el-form>
                <el-row slot="footer" type="flex" justify="center">
                    <el-col :span="6">
                        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
                        <el-button size="small" @click="btnCancel">取消</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { addPermission, getPermissionList, updatePermission, getPermissionDetail, delPermission } from '@/api/permisson'
import PageTool from '@/components/PageTool'
import { tranListToTreeData } from '@/utils'


export default {
    data() {
        return {
            // 列表数据
            roleList: [],
            // 默认不显示弹层
            showDialog: false,
            formData: {
                name: '', // 名称
                code: '', // 标识
                description: '', // 描述
                type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
                pid: '', // 因为做的是树 需要知道添加到哪个节点下了
                enVisible: '0' // 开启
            },
            rules: {
                name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
                code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
            },
        }
    },
    components: {
        PageTool
    },
    created() {
        this.getPermissionList()
    },
    methods: {
        async getPermissionList() {
            let rel = await getPermissionList({ page: 1, pageSize: 100 })
            this.roleList = tranListToTreeData(rel, '0')
        },
        addRole(type, pid) {
            this.showDialog = true
            // 区分添加页面权限和按钮权限,页面权限type ： 1，按钮权限type ：2
            this.formData.type = type
            // 页面访问权限必须设置pid 才会显示到列表中
            this.formData.pid = pid

        },
        editRole(id) {
            this.formData.id = id
            // 获取权限详情
            getPermissionDetail(id).then((rel) => {
                this.formData = rel
                this.showDialog = true
            })
        },
        async btnOk() {
            this.$refs.roleFrom.validate().then((result) => {

                // 有id 就是编辑
                if (this.formData.id) {
                    return updatePermission(this.formData)
                }
                return addPermission(this.formData)
            }).then(() => {
                // showDialog = false 关闭弹层，会默认调用关闭弹层的close 方法
                this.showDialog = false
                this.getPermissionList()
            })
        },
        btnCancel() {
            this.formData = {
                name: '', // 名称
                code: '', // 标识
                description: '', // 描述
                type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
                pid: '', // 因为做的是树 需要知道添加到哪个节点下了
                enVisible: '0' // 开启
            }
            this.$refs.roleFrom.resetFields()
            this.showDialog = false
        },
        delPermission(id) {
            this.$confirm('确定要删除吗').then(() => {
                return delPermission(id)
            }).then(() => {
                this.$message.success('删除成功')
                this.getPermissionList()
            })
        }
    }
}
</script>

<style>
</style>