<template>
    <div class="dashboard-container">
        <div class="app-container">
            <div class="setting">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" @tab-click="handleClick" @cell-click="handleClick">
                        <el-tab-pane label="角色管理" name="role">
                            <!-- 角色管理 -->
                            <el-button type="primary" class="add-role" size="small"
                                @click="setDialogShow({ type: 'add' })">
                                新增角色
                            </el-button>
                            <el-table :data="table.data" style="width: 100%" stripe border class="role-table">
                                <el-table-column type="index" width="100" label="序号" align="center">
                                </el-table-column>
                                <el-table-column prop="name" label="角色" width="180" align="center">
                                </el-table-column>
                                <el-table-column prop="description" label="描述" align="center">
                                </el-table-column>
                                <el-table-column prop="id" label="操作" width="300" align="center">
                                    <template slot-scope="{row}">
                                        <el-button type="success" size="small" @click="openRoleDialog(row.id)">分配权限
                                        </el-button>
                                        <el-button type="primary" size="small"
                                            @click="setDialogShow({ type: 'edit', id: row.id })">
                                            编辑</el-button>
                                        <el-button type="danger" size="small" @click="btnDelete(row.id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页 -->
                            <div class="pagination">
                                <el-pagination small layout="prev, pager, next" :total="table.total"
                                    @current-change="handleCurrentChange">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <!-- 公司信息 -->
                        <el-tab-pane label="公司信息" name="company">
                            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon
                                :closable="false">
                            </el-alert>
                            <el-form label-width="120px" disabled :model="company.info" style="margin-top:50px;">
                                <el-form-item label="公司名称">
                                    <el-col :span="13">
                                        <el-input v-model="company.info.name"></el-input>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="公司地址">
                                    <el-col :span="13">
                                        <el-input v-model="company.info.companyAddress"></el-input>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="公司邮箱">
                                    <el-col :span="13">
                                        <el-input v-model="company.info.mailbox"></el-input>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="备注">
                                    <el-col :span="13">
                                        <el-input type="textarea" disabled v-model="company.info.remarks" rows="3">
                                        </el-input>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    <!-- 弹层 -->
                    <EditRole :dialog="dialog" :setDialogShow="setDialogShow" :getRole="getRole"></EditRole>
                    <!-- 分配权限弹层 -->
                    <el-dialog title="分配权限" :visible="showRoleDialog" @close="btnCancel">
                        <el-row>
                            <el-tree ref="roleTree" :data="roleList" :props="defaultProps" default-expand-all
                                node-key="id" show-checkbox :check-strictly="true"
                                :default-checked-keys="currentRoleList">

                            </el-tree>
                        </el-row>
                        <el-row type="flex" justify="center" slot="footer">
                            <el-button type="primary" size="small" @click="btnOk">确定</el-button>
                            <el-button size="small" @click="btnCancel">取消</el-button>
                        </el-row>
                    </el-dialog>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { getRole, deleteRole, getCompanyInfo, roleDetail, assignPrem } from '@/api/setting'
import EditRole from './components/editRole.vue'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
    data() {
        return {
            activeName: 'role',
            // 表格数据
            table: {
                data: [],
                page: 1,
                pagesize: 10,
                total: 0
            },
            // 弹层
            dialog: {
                dialogShow: false,
                // 点击弹层的操作
                actionType: '',
                roleId: ''
            },
            // 公司
            company: {
                info: {}
            },
            // 分配权限 弹层
            showRoleDialog: false,
            // 权限列表
            roleList: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 当前角色有的权限
            currentRoleList: [],
            // 当前的分配角色的id
            rolerId: ''
        }
    },
    components: {
        EditRole
    },
    // 请求数据
    created() {
        this.getRole()
        this.getCompanyInfo()
    },
    methods: {
        // 删除
        btnDelete(id) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteRole(id)
                this.getRole()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        async getRole() {
            let rel = await getRole({ page: this.table.page, pagesize: this.table.pagesize })
            this.table.data = [...rel.rows]
            this.table.total = rel.total
        },
        // 弹层
        setDialogShow({ type, id }) {
            if (id) {
                this.dialog.roleId = id
            }
            if (type) {
                this.dialog.actionType = type
            }
            this.dialog.dialogShow = !this.dialog.dialogShow
        },
        // 分页
        handleCurrentChange(currentPage) {
            this.table.page = currentPage
            this.getRole()
        },
        // 获取公司信息
        async getCompanyInfo() {
            let rel = await getCompanyInfo(this.$store.getters.companyId)
            this.company.info = rel
        },
        async openRoleDialog(id) {
            this.rolerId = id
            let treeData = tranListToTreeData(await getPermissionList(), '0')
            this.roleList = treeData
            let { permIds } = await roleDetail(id)
            this.currentRoleList = permIds
            this.showRoleDialog = true
        },
        async btnOk() {
            let permIds = this.$refs.roleTree.getCheckedKeys()
            await assignPrem({ permIds, id: this.rolerId })
            this.$message.success('分配权限成功')
            this.showRoleDialog = false
        },
        btnCancel() {
            this.showRoleDialog = false
            this.currentRoleList = []
        }
    }
}
</script>

<style lang="scss">
.setting {
    width: 100%;
    height: 100%;

    .box-card {
        width: 100%;

        .role-table {
            margin-top: 20px;
        }

        .pagination {
            margin-top: 20px;

            .el-pagination {
                float: right;
                max-width: max-content;
            }
        }
    }
}
</style>