<template>
    <div>
        <el-row type="flex" justify="end">
            <el-select size="mini" v-model="newTimeYear">
                <el-option v-for="item in getLateYear" :key="item" :value="item" :label="item"></el-option>
            </el-select>
            <el-select size="mini" v-model="newTimeMonth">
                <el-option v-for="item in 12" :key="item" :value="item" :label="item"></el-option>
            </el-select>
        </el-row>
        <el-calendar :value="`${newTimeYear} ${newTimeMonth}`">
            <template slot="dateCell" slot-scope="{date, data}" class="content">
                <div class="date-content">
                    <span> {{ data.day.split('-')[2] }}</span>
                    <span v-if="isRestDay(date)" class="rest">休</span>
                </div>
            </template>

        </el-calendar>
    </div>
</template>

<script>
const year = new Date().getFullYear()
// new Date().getDay(): 星期几
// new Date().getDate() : 几日
export default ({
    created() {
        console.log(new Date().getDate())
    },
    data() {
        return {
            newTimeYear: new Date().getFullYear(),
            newTimeMonth: new Date().getMonth() + 1
        }
    },
    computed: {
        getLateYear() {
            let yearArr = []
            for (let index = year - 5; index < year + 5; index++) {
                yearArr.push(index)
            }
            return yearArr
        },

    },
    methods: {
        isRestDay(date) {
            return new Date(date).getDay() === 6 || new Date(date).getDay() === 0
        }
    },
    components: {

    }
})
</script>

<style  scoped>
/deep/ .el-calendar-day {
    height: auto;
}

/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
    border: none;
}

.date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
}

.date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
}

.date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;

}

/deep/ .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
}

/deep/ .el-calendar__header {
    display: none
}
</style>