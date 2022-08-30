<template>
    <div class="detail-employee">
        <div class="dashboard-container">
            <div class="app-container">
                <el-card>
                    <el-tabs>
                        <el-tab-pane label="登录账户设置">
                            <!-- 放置表单 -->
                            <el-form :model="userInfo" ref="userForm" :rules="rules" label-width="120px"
                                style="margin-left: 120px; margin-top:30px">
                                <el-form-item label="姓名:" prop="username">
                                    <el-input style="width:300px" v-model="userInfo.username" />
                                </el-form-item>
                                <el-form-item label="密码:" prop="password2">
                                    <el-input style="width:300px" v-model="userInfo.password2" type="password" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="saveUserDetail">更新</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="个人详情">
                            <component :is="userComponent" />
                        </el-tab-pane>
                        <el-tab-pane label="岗位信息">
                            <jobInfo />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { saveUserDetailById } from "@/api/employees"
import { getUserDetailById } from "@/api/user"
import jobInfo from "./job-info.vue"
import userInfo from "./user-info.vue"

export default ({
    data() {
        return {
            userComponent: 'userInfo',
            userId: this.$route.params.id,
            userInfo: {
                username: '',
                password2: ''
            },
            rules: {
                username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getUserDetailById()
    },
    methods: {
        async getUserDetailById() {
            let rel = await getUserDetailById(this.userId)
            this.userInfo = { ...this.userInfo, ...rel }
        },
        async saveUserDetail() {
            try {
                await this.$refs['userForm'].validate()
                await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
                this.getUserDetailById()
                this.$message.success('保存成功')
            } catch (error) {
            }
        }
    },
    components: {
        userInfo,
        jobInfo
    }
})
</script>

<style scoped>
</style>