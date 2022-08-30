<template>
    <div>
        <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
            <el-row>
                <el-checkbox-group v-model="roleIds">
                    <el-checkbox :label="item.id" v-for="item in roleList" :key="item.key">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-row>
            <el-row slot="footer" type="flex" justify="center">
                <el-button type="primary" @click="btnOk">确定</el-button>
                <el-button @click="btnCancel">取消</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { assignRoles } from "@/api/employees";
import { getRole } from "@/api/setting"
import { getUserDetailById } from '@/api/user';

export default ({
    data() {
        return {
            // 角色列表
            roleList: [],
            // 当前选中的角色列表
            roleIds: []
        }
    },
    props: {
        showRoleDialog: {
            type: Boolean,
            default: false
        },
        userId: {
            type: String,
            default: false
        }
    },
    created() {
        this.getRole()
    },
    components: {

    },
    methods: {
        async getRole() {
            let { rows } = await getRole({ page: 1, pagesize: 20 })
            this.roleList = rows
        },
        async getUserDetailById(id) {
            let { roleIds } = await getUserDetailById(id)
            this.roleIds = roleIds
        },
        async btnOk() {
            this.$emit('update:showRoleDialog', false)
            await assignRoles({ id: this.userId, roleIds: this.roleIds })
            this.roleIds = []
        },
        btnCancel() {
            this.$emit('update:showRoleDialog', false)
            this.roleIds = []
        }
    },
})
</script>

<style scoped>
</style>