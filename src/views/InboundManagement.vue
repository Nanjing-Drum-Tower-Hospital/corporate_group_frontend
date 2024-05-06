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

    <el-button type="primary" @click="openAddDialog">
      添加
    </el-button>

    <el-dialog title="添加货品信息" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="form">

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="编码" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.code" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="货品名称" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.name" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="型号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.model" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="单位" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.unitName" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="售价" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.sellingPrice" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="制造商" style="flex: 1;" :label-width="'100px'">
            <el-select v-model="form.manufacturerId" placeholder="请选择制造商" style="width: 70%;">
              <!-- You can dynamically populate the options here -->
              <!-- For example, using a loop to iterate over a manufacturers array -->
              <el-option
                  v-for="manufacturer in manufacturerList"
                  :key="manufacturer.id"
                  :label="manufacturer.manufacturerName"
                  :value="manufacturer.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="账单码" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.billItem" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="执行标准" style="flex: 1; " :label-width="'100px'">
            <el-input v-model="form.standards" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="类型" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.type" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="批准文号" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.approvalNo" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">

          <el-form-item label="有效期" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.expireDate" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addItem">保 存</el-button>
      </div>
    </el-dialog>
    <el-table
        :data="inboundTableData"
        border
        style="width: 100%"
        @row-click="handleRowClick"
    >
      <el-table-column
          prop="inboundInfo.orderNo"
          label="订单号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="supplier.supplierName"
          label="供应商"
          width="120">
      </el-table-column>


      <el-table-column
          prop="inboundInfo.remark"
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
          prop="item.itemDetail.code"
          label="编码"
          width="150">
      </el-table-column>
      <el-table-column
          prop="item.itemDetail.name"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="item.itemDetail.model"
          label="货品型号"
          width="120">
      </el-table-column>

      <el-table-column
          prop="inboundItem.machineNo"
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
      inboundDetailTableData: [],
      dialogFormVisible:false
    }

  },
  methods: {
    openAddDialog(){
      //the dialog should contain all the fields above
      this.dialogFormVisible= true
    },
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