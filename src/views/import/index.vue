<template>
    <upload-excel :onSuccess="success" />
</template>

<script>
import { importEmployees } from "@/api/employees"


export default ({
    methods: {
        async success({ header, results }) {
            console.log(results)
            // 把 results 中的键改为英文
            const userRelations = {
                '入职日期': 'timeOfEntry',
                '手机号': 'mobile',
                '姓名': 'username',
                '转正日期': 'correctionTime',
                '工号': 'workNumber'
            }
            let newArr = results.map(item => {
                let arrItem = {}
                header.forEach(key => {
                    // 把时间转换成正确的格式
                    if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
                        arrItem[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
                    } else {
                        arrItem[userRelations[key]] = item[key]
                    }

                });
                return arrItem
            })
            await importEmployees(newArr)
            this.$message.success('导入成功')
            this.$router.back()
        },
        formatDate(numb, format) {
            const time = new Date((numb - 1) * 24 * 3600000 + 1)
            time.setYear(time.getFullYear() - 70)
            const year = time.getFullYear() + ''
            const month = time.getMonth() + 1 + ''
            const date = time.getDate() - 1 + ''
            if (format && format.length === 1) {
                return year + format + month + format + date
            }
            return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        }
    },


})
</script>

<style scoped>
</style>