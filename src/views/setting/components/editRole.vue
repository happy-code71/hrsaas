<template>
    <div>
        <el-dialog :title="title" :visible.sync="dialog.dialogShow">
            <el-form :model="form" :rules="rules" ref="roleFrom">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="restForm('roleFrom')">取 消</el-button>
                <el-button type="primary" @click="submitForm('roleFrom')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { addRole, roleDetail, updaeRole } from "@/api/setting"


export default ({
    data() {
        return {
            form: {
                name: '',
                description: '',
            },
            formLabelWidth: '80px',
            rules: {
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
            }
        }
    },
    props: ['dialog', 'setDialogShow', 'getRole'],
    computed: {
        title() {
            if (this.dialog.actionType === 'add') {
                return '新增角色'
            } else if (this.dialog.actionType === 'edit') {
                return '编辑角色'
            }
        }
    },
    methods: {
        submitForm(fromName) {
            this.$refs[fromName].validate(async (valid) => {
                if (valid) {
                    this.setDialogShow({})
                    this.dialog.actionType === 'add' ? await addRole(this.form) : await updaeRole(this.form)
                    // 重新请求数据
                    this.getRole()
                    // 清除数据
                    let obj = {
                        name: '',
                        description: '',
                    }
                    this.form = obj
                    this.$message({
                        message: this.dialog.actionType === 'add' ? '添加成功' : '编辑成功',
                        type: 'success'
                    });
                } else {
                    return false
                }
            })
        },
        restForm(fromName) {
            this.setDialogShow({})
        }

    },
    watch: {
        dialog: {
            async handler(newValue) {
                if (newValue.actionType === 'edit') {
                    let rel = await roleDetail(newValue.roleId)
                    let companyId = this.$store.getters.companyId
                    this.form = { ...rel, companyId }
                } else if (newValue.actionType === 'add') {
                    // 清除数据
                    this.form = {
                        name: '',
                        description: '',
                    }
                }
            },
            immediate: true,
            deep: true
        }
    }
})
</script>

<style scoped>
</style>