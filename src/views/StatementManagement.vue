<template>
  <div>
    <div>
      <template>
        <el-form :model="dateRange" :inline="true" style="display: inline-block;">
          <el-form-item label="结算时间范围：">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                v-model="dateRange.beginDate"
                                style="width: 100%;">
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                v-model="dateRange.endDate"
                                style="width: 100%;">
                </el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </template>
    </div>
    <div style="padding-top: 50px">
      <el-button type="primary" >入库汇总表</el-button>
    </div>
    <div style="padding-top: 50px">
      <el-button type="primary" >出库汇总表</el-button>
    </div>
    <div style="padding-top: 50px">
      <el-button type="primary" >收发存汇总表</el-button>
    </div>
  </div>
</template>

<script>



export default {
  name: "StatementManagement",
  data() {
    return {
      dateRange: {}
    }
  },
  mounted() {

  },

  methods: {
  }
}
</script>

<style scoped>

</style>