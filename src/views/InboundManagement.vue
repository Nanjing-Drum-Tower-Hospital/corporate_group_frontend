<template>
  <div>
    <span style="width: 100%">
      <el-form :model="form"  :inline="true" style="display: inline-block">

          <el-form-item label="订单号">
            <el-input v-model="formInbound.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <span style="width: 100%;">
              <el-form :model="formInbound"  :inline="true" style="display: inline-block;">
          <el-form-item label="到货时间">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="formInbound.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="formInbound.date1" style="width: 100%;"></el-date-picker>
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

    <el-dialog title="添加入库信息" :visible.sync="dialogFormInboundVisible" :before-close="handleInboundClose" :close-on-click-modal="false">
      <el-form :model="formInbound">

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="订单号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="formInbound.orderNo" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="到货日期" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-date-picker type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            v-model="formInbound.arrivalDate"
                            style="width: 70%;">
            </el-date-picker>
          </el-form-item>
        </div>


        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">

          <el-form-item label="供应商" style="flex: 1;" :label-width="'100px'">
            <el-select v-model="formInbound.supplierId" placeholder="请选择制造商" style="width: 70%;">
              <!-- You can dynamically populate the options here -->
              <!-- For example, using a loop to iterate over a manufacturers array -->
              <el-option
                  v-for="supplier in supplierList"
                  :key="supplier.id"
                  :label="supplier.supplierName"
                  :value="supplier.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>


        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="formInbound.remark" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>

        </div>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleInboundClose">取 消</el-button>
        <el-button type="primary" @click="handleInboundSave">保 存</el-button>
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
          width="150"
>
      </el-table-column>
      <el-table-column
          prop="inboundInfo.arrivalDate"
          label="到货时间"
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
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button @click="handleOrderClickEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleOrderClickDelete(scope.row)" type="text" size="small">删除</el-button>
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
    <span v-if="currentInbound && currentInbound.inboundInfo">
  订单号：{{currentInbound.inboundInfo.orderNo}}
  <el-form :model="formInboundDetail" :inline="true" style="display: inline-block">
    <el-form-item label="货品名称">
      <el-input v-model="formInboundDetail.name"></el-input>
    </el-form-item>
  </el-form>
</span>
    <el-button type="primary">
      搜索
    </el-button>

    <el-button @click="openAddInboundDetailDialog" type="primary">
      添加
    </el-button>
    <el-dialog title="添加入库货品信息" :visible.sync="dialogFormInboundDetailVisible" :before-close="handleInboundDetailClose" :close-on-click-modal="false">
      <el-form :model="formInboundDetail">

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="编码" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="formInboundDetail.code" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>





        <div>
          <div v-for="(machineNo, index) in machineNumbers" :key="index" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item :label="'机器编号 ' + (index + 1)" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <!-- Use a method to handle input updates -->
              <el-input :value="machineNo" @input="updateMachineNo($event, index)" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
            <el-button type="text" @click="removeMachine(index)">Remove</el-button>
          </div>
          <el-button @click="addMachine">Add Machine</el-button>
        </div>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleInboundDetailClose">取 消</el-button>
        <el-button type="primary" @click="handleInboundDetailSave">保 存</el-button>
      </div>
    </el-dialog>
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
          prop="inboundItem.machineNoCount"
          label="数量"
          width="120">
      </el-table-column>

      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleClickDelete(scope.row)" type="text" size="small">删除</el-button>
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
import service from "@/main";

export default {
  name: "inboundManagement",
  data() {
    return {
      formInbound: {

      },
      formInboundDetail: {

      },
      inboundTableData: [],
      currentInbound:{},
      inboundDetailTableData: [],
      dialogFormInboundVisible:false,
      dialogFormInboundDetailVisible:false,
      supplierList:[],



      machineNumbers: [],

    }

  },
  mounted() {
    // Call your backend API to fetch the list of manufacturers
    service.get('/querySupplierList')
        .then(response => {
          // Assign the received data to the manufacturers array
          this.supplierList = response.data.data;
          console.log(this.supplierList)
        })
        .catch(error => {
          console.error('Error fetching manufacturer list:', error);
          // Handle errors if needed
        });
  },
  methods: {
    addMachine() {
      this.machineNumbers.push(''); // Add an empty string to the machineNumbers array
    },
    updateMachineNo(value, index) {
      // Update the value at the specific index
      this.$set(this.machineNumbers, index, value);
    },
    removeMachine(index) {
      this.machineNumbers.splice(index, 1); // Remove the string at the specified index
    },
    handleInboundDetailSave() {
      console.log(this.machineNumbers);
      service.get('/queryItemByCode', {
        params: {
          code: this.formInboundDetail.code,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                this.formInboundDetail.itemId = response.data.data.id;

                // Iterate over each element in machineNumbers
                this.machineNumbers.forEach((machine) => {
                  this.formInboundDetail.machineNo = machine.machineNo; // Set formInboundDetail.machineNo to the current machine number
                  service.post('/addOrUpdateInboundDetail', this.formInboundDetail)
                      .then((response) => {
                        console.log(response.data.data[0].itemDetail.id);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                });
              })
          .catch(
              (error) => {
                console.log(error);
              });
    },



    openAddInboundDetailDialog(){
      this.formInboundDetail.orderNo=this.currentInbound.inboundInfo.orderNo
      this.dialogFormInboundDetailVisible= true
    },
    handleInboundSave(){
      console.log(this.formInbound);
      service.post('/addOrUpdateInbound', this.formInbound
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormInboundVisible = false;
            this.formInbound={}
          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    handleInboundClose(){
      this.formInbound={}
      this.dialogFormInboundVisible = false;
    },
    handleInboundDetailClose(){
      this.formInboundDetail={}
      this.dialogFormInboundDetailVisible = false;
    },
    handleOrderClickEdit(row){
      console.log(row);
      this.formInbound = JSON.parse(JSON.stringify(row.inboundInfo));
      this.dialogFormInboundVisible = true;
    },
    openAddDialog(){
      //the dialog should contain all the fields above
      this.dialogFormInboundVisible= true
    },
    queryInboundDetail() {
      console.log(this.currentInbound.inboundInfo.orderNo)
      service.get('/queryInboundDetailCount', {
        params: {
          orderNo: this.currentInbound.inboundInfo.orderNo

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
      this.currentInbound=row
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