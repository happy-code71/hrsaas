<template>
    <el-dialog :title="setTitle" :visible="dialogFormVisible" center :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="部门名称" label-width="120px" prop="name">
                <el-input v-model="form.name" autocomplete="off" placeholder="1-50个字符"></el-input>
            </el-form-item>
            <el-form-item label="部门编码" label-width="120px" prop="code">
                <el-input v-model="form.code" autocomplete="off" placeholder="1-50个字符"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人" label-width="120px" prop="manager">
                <el-select v-model="form.manager" placeholder="请选择负责人" @click.native="clickSelect">
                    <el-option :label="item.username" :value="item.username" v-for="item in employeeSimple"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" label-width="120px" prop="introduce">
                <el-input type="textarea" v-model="form.introduce" placeholder="1-300个字符"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getEmployeeSimple, addDepartment, getDepartments, editDepartmentDetail } from "@/api/departments";
import { Message } from 'element-ui';
export default ({
    data() {
        return {
            form: {
                name: '',
                code: '',
                introduce: '',
                manager: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
                    { validator: this.checkNameRepeat, trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入部门编码', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
                    { validator: this.checkCodeRepeat, trigger: 'blur' }
                ],
                manager: [
                    { required: true, message: '请选择负责人', trigger: 'change' }
                ],
                introduce: [
                    { required: true, message: '请输入部门介绍', trigger: 'blur' },
                    { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
                ],
            },
            // 部门负责人
            employeeSimple: [],
        }
    },
    computed: {
        setTitle() {
            return this.treeNode.actionType === 'add' ? '新增部门' : '编辑部门'
        }
    },
    props: ['dialogFormVisible', 'setDialogFormVisible', 'treeNode', 'setIsOk'],
    methods: {
        // 校验同级下是否有重名的部门名称
        async checkNameRepeat(rule, value, callback) {
            let rel = await getDepartments()
            let isHas = false
            console.log(rel)
            // 一级部门
            if (this.treeNode.isTopTree) {
                rel.depts.forEach(item => {
                    if (item.pid === '') {
                        if (item.name === value.trim()) {
                            isHas = true
                        }
                    }
                });
            }
            // 子部门
            else {
                rel.depts.forEach(item => {
                    if (item.pid === this.treeNode.data.id) {
                        if (item.name === value.trim()) {
                            // 如果是编辑时，且数据没有发生改变当不需理会 
                            if (this.treeNode.actionType === 'edit' && value.trim() === this.treeNode.data.name) {
                                isHas = false
                            } else {
                                isHas = true
                            }
                        }
                    }
                });
            }
            isHas ? callback(new Error(`当前同级下已经有 ${value} 这个部门了`)) : callback()
        },
        // 校验全树下是否有重名的部门编码名称
        async checkCodeRepeat(rule, value, callback) {
            let rel = await getDepartments()
            let isHas = false
            rel.depts.forEach(item => {
                if (item.code === value.trim()) {
                    if (this.treeNode.actionType === 'edit' && value.trim() === this.treeNode.data.code) {
                        isHas = false
                    } else {
                        isHas = true
                    }
                }
            });
            isHas ? callback(new Error(`当前已经有 ${value} 这个部门编码了`)) : callback()
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 是否添加的是一级部门
                    let pid = this.treeNode.isTopTree ? '' : this.treeNode.data.id
                    let rel = this.treeNode.actionType === 'edit' ? await editDepartmentDetail(this.form) : await addDepartment({ ...this.form, pid })
                    Message({
                        message: "添加成功",
                        type: 'success',
                        center: true
                    })
                    this.setIsOk(true)
                    this.setDialogFormVisible(false)
                    this.resetForm('ruleForm')
                    this.employeeSimple = []
                } else {

                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.setDialogFormVisible(false)
            this.employeeSimple = []
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.setDialogFormVisible(false)
                    this.resetForm('ruleForm')
                    this.employeeSimple = []
                    done();
                })
                .catch(_ => { });
        },
        async clickSelect() {
            if (!this.employeeSimple.length) {
                let rel = await getEmployeeSimple()
                this.employeeSimple = [...rel]
            }
        }
    },
    watch: {
        treeNode: {
            handler(newValue, oldValue) {
                if (newValue.actionType === 'edit') {
                    this.form = newValue.data
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