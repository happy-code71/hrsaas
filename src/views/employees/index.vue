<template>
    <div class="dashboard-container">
        <div class="app-container">
            <div class="employees">
                <PageTool :showDesc="true">
                    <template v-slot:desc>
                        <i class="el-icon-info" />
                        <span>共{{ pagination.total }}条记录</span>
                    </template>
                    <template v-slot:action>
                        <el-button type="danger" size="small" @click="exportData">普通excel导出</el-button>
                        <el-button type="info" size="small">复杂表头excel导出</el-button>
                        <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
                        <el-button type="primary" size="small" @click="dialog.isShowDialog = true"
                            v-if="isHasPermission('add-user')">新增员工</el-button>
                    </template>
                </PageTool>
                <el-card>
                    <!-- 表格 -->
                    <el-table :data="table.list" style="width: 100%" stripe border v-loading="loading">
                        <el-table-column type="index" label="序号" width="80" align="center">
                        </el-table-column>
                        <el-table-column prop="username" label="姓名" width="100" align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="date" label="头像" width="120" align="center">
                            <template slot-scope="{row}">
                                <img size="medium" :src="row.staffPhoto"
                                    v-imgerr:imgSrc="require('@/assets/user/qq.jpg')"
                                    @click="showQrCode(row.staffPhoto)"
                                    style="border-radius: 50%; width: 70px; height: 70px; padding: 10px" />

                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号" align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="workNumber" label="工号" align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="formOfEmployment" label="聘用形式" align="center" sortable
                            :formatter="formatEmployment">
                        </el-table-column>
                        <el-table-column prop="departmentName" label="部门" align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="timeOfEntry" label="入职时间" align="center" sortable>
                            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
                        </el-table-column>
                        <el-table-column prop="enableState" label="状态" align="center" sortable>
                            <template slot-scope="{row}">
                                <el-switch :value="row.enableState === 1">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" sortable fixed="right" width="250">
                            <template slot-scope="{row}">
                                <el-row type="flex" justify="space-between">
                                    <el-link type="primary" :underline="false"
                                        @click="$router.push(`/employees/detail/${row.id}`)">查看</el-link>
                                    <el-link type="primary" :underline="false">转正</el-link>
                                    <el-link type="primary" :underline="false">调岗</el-link>
                                    <el-link type="primary" :underline="false">离职</el-link>
                                    <el-link type="primary" :underline="false" @click="showRole(row.id)">角色</el-link>
                                    <el-link type="primary" :underline="false" @click="deleteEmployee(row.id)">删除
                                    </el-link>
                                </el-row>

                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-row type="flex" justify="end">
                        <el-pagination small layout="total,prev, pager, next" :total="pagination.total"
                            @current-change="currentChange">
                        </el-pagination>
                    </el-row>
                </el-card>
                <!-- 弹层 -->
                <addEmployee :showDialog.sync="dialog.isShowDialog" />
                <!--二维码弹层 -->
                <el-dialog title="二维码" :visible.sync="showQrCodeDialog">
                    <el-row type="flex" justify="center">
                        <canvas ref="myCanvas">
                        </canvas>
                    </el-row>
                </el-dialog>
            </div>
            <!-- 角色弹层 -->
            <roleDialog ref="roleDialog" :userId="userId" :showRoleDialog.sync="showRoleDialog" />
        </div>
    </div>
</template>

<script>
import { deleteEmployee, getUserList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters';

import QrCode from 'qrcode'
import roleDialog from './components/role-dialog.vue';

export default {
    data() {
        return {

            loading: false,
            table: {
                list: [],
            },
            // 分页
            pagination: {
                page: 1,
                size: 10,
                total: 0
            },
            // 弹层
            dialog: {
                isShowDialog: false
            },
            // 二维码弹层
            showQrCodeDialog: false,
            // 角色弹层
            showRoleDialog: false,
            userId: ''
        }
    },
    components: {
        addEmployee,
        roleDialog
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            this.loading = true
            let rel = await getUserList({ page: this.pagination.page, size: this.pagination.size })
            this.table.list = rel.rows
            this.pagination.total = rel.total
            this.loading = false
        },
        // 过滤表格中的 聘用形式
        formatEmployment(row, column) {
            let obj = EmployeeEnum.hireType.find(item => row.formOfEmployment === item.id)
            return obj ? obj.value : '未知'
        },
        // 分页
        currentChange(page) {
            this.pagination.page = page
            this.getUserList()
        },
        changeShowDialog() {
            this.dialog.isShowDialog = !this.dialog.isShowDialog
        },
        async deleteEmployee(id) {
            try {
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await deleteEmployee(id)
                this.getUserList()
            } catch (error) {

            }

        },
        // 导出excel 
        async exportData() {
            const headers = {
                '姓名': 'username',
                '手机号': 'mobile',
                '入职日期': 'timeOfEntry',
                '聘用形式': 'formOfEmployment',
                '转正日期': 'correctionTime',
                '工号': 'workNumber',
                '部门': 'departmentName'
            }
            let { rows } = await getUserList({ page: this.pagination.page, size: this.pagination.size })
            let data = format(rows)
            // 懒加载引入模块
            import('@/vendor/Export2Excel').then(
                excel => {
                    excel.export_json_to_excel({
                        // 表头
                        header: Object.keys(headers),
                        // 数据
                        data,
                        // 文件名
                        filename: '员工导出模板',
                        // bookType: 'txt'
                        // 复杂表头
                        multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']],
                        // 合并单元格
                        merges: ['A1:A2', 'B1:F1', 'G1:G2']
                    })
                })
            function format(rows) {
                let info = rows.map(item => {
                    let arrItme = []
                    Object.keys(headers).forEach(key => {
                        // 格式化一下日期和聘用形式
                        if (headers[key] === 'correctionTime' || headers[key] === 'timeOfEntry') {
                            arrItme.push(formatDate(item[headers[key]]))
                        }
                        else if (headers[key] === 'formOfEmployment') {
                            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
                            arrItme.push(en ? en.value : '未知')

                        }
                        else {
                            arrItme.push(item[headers[key]])
                        }
                    })
                    return arrItme
                })
                return info
            }
        },
        showQrCode(url) {
            if (url) {
                // 在js 中弹层是异步执行的，会等同步代码执行完成才会执行
                // 那么this.showQrCodeDialog = true 不会先执行，最起码是在QrCode.toCanvas(this.$refs.myCanvas, url) 执行之后在执行的，此时还没有this.$refs.myCanvas 这个dom 
                this.showQrCodeDialog = true
                this.$nextTick(() => {
                    QrCode.toCanvas(this.$refs.myCanvas, url)
                })
            } else {
                this.$message.warning('该用户还没有上传头像哦！！！！')
            }
        },
        async showRole(id) {
            this.userId = id
            await this.$refs.roleDialog.getUserDetailById(id)
            this.showRoleDialog = true
        }
    },
}
</script>

<style lang="scss">
.employees {
    .page-tool {
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .el-pagination {
        margin-top: 20px;
    }
}
</style>