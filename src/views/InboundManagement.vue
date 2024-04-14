<template>
  <div>
    <span style="width: 100%">
      <el-form :model="form"  :inline="true" style="display: inline-block">

          <el-form-item label="订单号">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <span style="width: 100%;">
              <el-form :model="form"  :inline="true" style="display: inline-block;">
          <el-form-item label="到货时间">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>
      </el-form>
      </span>
    <el-button type="primary">
      搜索
    </el-button>

    <el-button type="primary">
      添加
    </el-button>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="code"
          label="订单号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="model"
          label="到货时间"
          width="120">
      </el-table-column>
      <el-table-column
          prop="name"
          label="供货商"
          width="120">
      </el-table-column>

      <el-table-column
          prop="unit_name"
          label="验收状态"
          width="120">
      </el-table-column>
      <el-table-column
          prop="selling_price"
          label="金额"
          width="120">
      </el-table-column>
      <el-table-column
          prop="manufacturer"
          label="备注"
          width="120">
      </el-table-column>


      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
      </el-pagination>
    </div>
    <span style="width: 100%">
      <el-form :model="form"  :inline="true" style="display: inline-block">

          <el-form-item label="货品名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <el-button type="primary">
      搜索
    </el-button>

    <el-button type="primary">
      添加
    </el-button>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="code"
          label="编码"
          width="150">
      </el-table-column>
      <el-table-column
          prop="model"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="name"
          label="货品单位"
          width="120">
      </el-table-column>

      <el-table-column
          prop="unit_name"
          label="厂家"
          width="120">
      </el-table-column>
      <el-table-column
          prop="selling_price"
          label=""
          width="120">
      </el-table-column>
      <el-table-column
          prop="manufacturer"
          label="备注"
          width="120">
      </el-table-column>


      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script >
export default {
  name: "inboundManagement",
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333
      }]
    }
  },
}
</script>



<style scoped>

</style>