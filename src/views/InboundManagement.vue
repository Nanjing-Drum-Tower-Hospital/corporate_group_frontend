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
    <el-button type="primary" @click="queryInboundList">
      搜索
    </el-button>

    <el-button type="primary">
      添加
    </el-button>
    <el-table
        :data="inboundTableData"
        border
        style="width: 100%"
        @row-click="handleRowClick"
    >
      <el-table-column
          prop="inbound.orderNo"
          label="订单号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="supplier.supplierName"
          label="供应商"
          width="120">
      </el-table-column>


      <el-table-column
          prop="inbound.remark"
          label="备注"
          width="120">
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
        :data="inboundDetailTableData"
        border
        style="width: 100%">
      <el-table-column
          prop="code"
          label="编码"
          width="150">
      </el-table-column>
      <el-table-column
          prop="name"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="model"
          label="货品型号"
          width="120">
      </el-table-column>

      <el-table-column
          prop="machineNo"
          label="机器编号"
          width="120">
      </el-table-column>



<!--      <el-table-column-->
<!--          label="操作"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
<!--          <el-button type="text" size="small">编辑</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
import service from "@/main";

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
      inboundTableData: [],
      inboundDetailTableData: []
    }

  },
  methods: {
    queryInboundDetail() {
      console.log("queryInboundList")
      service.get('/queryInboundDetail', {
        params: {
        }
      }).then(
          (response) => {
            console.log(response)
            this.inboundDetailTableData = response.data.data
          }
      ).catch(
          (error) => {
            console.log(error)
          }
      )
    },
    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      console.log("Row clicked:", row);
      this.queryInboundDetail()

      // Additional logic here
    },
    queryInboundList() {
      console.log("queryInboundList")
      service.get('/queryInboundList', {
        params: {
        }
      }).then(
          (response) => {
            console.log(response)
            this.inboundTableData = response.data.data
          }
      ).catch(
          (error) => {
            console.log(error)
          }
      )
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }


}
</script>



<style scoped>

</style>