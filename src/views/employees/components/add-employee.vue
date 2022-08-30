<template>
    <!-- 弹层 -->
    <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
        <el-form label-width="120px" :model="formData" :rules="rules" ref="add_employee">
            <el-form-item label="姓名" prop="username">
                <el-col :span="15">
                    <el-input placeholder="请输入姓名" v-model="formData.username"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-col :span="15">
                    <el-input placeholder="请输入手机号" v-model="formData.mobile"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="入职时间" prop="timeOfEntry">
                <el-col :span="15">
                    <el-date-picker type="date" placeholder="请选择入职时间" v-model="formData.timeOfEntry">
                    </el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
            </el-form-item>
            <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-col :span="15">
                    <el-select v-model="formData.formOfEmployment" placeholder="请选择">
                        <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value"
                            :value="item.id" />
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="工号" prop="workNumber">
                <el-col :span="15">
                    <el-input placeholder="请输入工号" v-model="formData.workNumber"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="部门" prop="departmentName">
                <el-col :span="15">
                    <el-input placeholder="请选择部门" v-model="formData.departmentName" @focus="getDepartments"></el-input>
                    <el-tree v-if="isShowTree" v-loading="loading" :data="treeData" default-expand-all=""
                        :props="{ label: 'name' }" @node-click="selectNode" />
                </el-col>
            </el-form-item>
            <el-form-item label="转正时间" prop="correctionTime">
                <el-col :span="15">
                    <el-date-picker type="date" placeholder="请选择转正时间" v-model="formData.correctionTime">
                    </el-date-picker>
                </el-col>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-row type="flex" justify="center">
                <el-col :span="6">
                    <el-button size="small" @click="btnCancel">取消</el-button>
                    <el-button type="primary" size="small" @click="btnOk">确定</el-button>
                </el-col>
            </el-row>
        </template>
    </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import treeTools from "@/views/departments/components/tree-tools.vue";
import EmployeeEnum from '@/api/constant/employees'
import { addEmployees } from '@/api/employees';

export default {
    data() {
        return {
            EmployeeEnum,
            formData: {
                username: "",
                mobile: "",
                formOfEmployment: "",
                workNumber: "",
                departmentName: "",
                timeOfEntry: "",
                correctionTime: "",
            },
            rules: {
                username: [
                    { required: true, message: "用户姓名不能为空", trigger: "blur" },
                    { min: 1, max: 4, message: "用户姓名为1-4位" },
                ],
                mobile: [
                    { required: true, message: "手机号不能为空", trigger: "blur" },
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: "手机号格式不正确",
                        trigger: "blur",
                    },
                ],
                timeOfEntry: [
                    { required: true, message: "入职时间不能为空", trigger: "blur" },
                ],
                formOfEmployment: [
                    { required: true, message: "请选择聘用形式", trigger: "blur" },
                ],
                workNumber: [
                    { required: true, message: "请输入工号", trigger: "blur" },
                ],
                departmentName: [
                    { required: true, message: "请选择部门", trigger: "change" },
                ],
                correctionTime: [
                    { required: true, message: "请选择转正时间", trigger: "blur" },
                ],
            },
            // 选择部门下的树结构的数据
            treeData: [],
            // 是否显示树结构
            isShowTree: false,
            // 控制树的显示或者隐藏进度条
            loading: false,
        };
    },
    created() {
        // this.getDepartments()
    },
    props: {
        showDialog: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        async getDepartments() {
            this.loading = true;
            let rel = await getDepartments();
            this.treeData = tranListToTreeData(rel.depts, "");
            this.isShowTree = true;
            this.loading = false;
        },
        selectNode(nodeData) {
            this.formData.departmentName = nodeData.name;
            this.isShowTree = false;
        },
        async btnOk() {
            try {
                // 校验表单
                await this.$refs.add_employee.validate()
                // 新增员工
                await addEmployees(this.formData)
                // 重新获取数据
                // this.$parent: 父组件的实例，可以拿到父组件的一些属性和方法
                this.$parent.getUserList()
                // 关闭弹层
                this.$parent.dialog.isShowDialog = false

            } catch (error) {
                console.log(error)
            }

        },
        btnCancel() {
            // 重置数据
            this.formData = {
                username: "",
                mobile: "",
                formOfEmployment: "",
                workNumber: "",
                departmentName: "",
                timeOfEntry: "",
                correctionTime: "",
            }
            // 重置校验
            this.$refs.add_employee.resetFields()
            // 关闭弹层
            // 写法一
            // this.$parent.dialog.isShowDialog = false
            // 写法二
            // showDialog: 父组件使用,sync传递过来的属性
            this.$emit('update:showDialog', false)
        }
    },
    components: {
        treeTools,
    },
};
</script>

<style scoped>
</style>