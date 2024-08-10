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
      <el-button type="primary" >出库汇总表</el-button>
      <el-button type="primary" @click="inventoryManagementStatement">收发存汇总表</el-button>
    </div>



    <div class="half">

      <el-button type="primary" @click="queryInboundList">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>




<!--      <el-dialog title="添加修改入库信息" :visible.sync="dialogFormInboundVisible" :before-close="handleInboundClose"-->
<!--                 :close-on-click-modal="false">-->
<!--        <el-form :model="formInbound">-->

<!--          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">-->

<!--            <el-form-item label="供应商" style="flex: 1;" :label-width="'100px'">-->
<!--              <el-select v-model="formInbound.supplierId" placeholder="请选择制造商" style="width: 70%;">-->
<!--                <el-option-->
<!--                    v-for="supplier in supplierList"-->
<!--                    :key="supplier.id"-->
<!--                    :label="supplier.supplierName"-->
<!--                    :value="supplier.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </div>-->


<!--          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">-->
<!--            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">-->
<!--              <el-input v-model="formInbound.remark" autocomplete="off" style="width: 70%;"></el-input>-->
<!--            </el-form-item>-->

<!--          </div>-->


<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="handleInboundClose">取 消</el-button>-->
<!--          <el-button type="primary" @click="handleInboundSave">保 存</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->



      <el-table
          :data="inboundTableData"
          border
          style="width: 100%"
          @row-click="handleRowClick"
      >
        <el-table-column
            prop="inboundNo"
            label="入库单号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="inboundDate"
            label="入库时间"
            width="150">
        </el-table-column>

        <el-table-column
            prop="supplier.supplierName"
            label="供应商"
            width="150">
        </el-table-column>
        <el-table-column
            prop="inboundPriceExcludingTax"
            label="金额"
            width="150">
        </el-table-column>
        <el-table-column
            prop="inboundPriceIncludingTax"
            label="价税合计"
            width="150">
        </el-table-column>



        <el-table-column
            prop="remark"
            label="备注"
            width="150">
        </el-table-column>
<!--        <el-table-column-->
<!--            label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button @click="handleInboundEdit(scope.row)" type="text" size="small">编辑</el-button>-->
<!--            <el-button @click="handleInboundDelete(scope.row)" type="text" size="small"-->
<!--                       :disabled="scope.row.checkOut">删除</el-button>-->
<!--            <el-button @click="handleInboundAccountingReversal(scope.row)" type="text" size="small"-->
<!--                       :disabled="!scope.row.checkOut || !!(scope.row.accountingReversalInboundNo)">-->
<!--              冲红</el-button>-->
<!--            <el-button @click="handleInboundStatementExport(scope.row)" type="text" size="small"-->
<!--                       :disabled="!scope.row.checkOut ">-->
<!--              导出</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->


      </el-table>
<!--      <div class="block">-->
<!--        <el-pagination-->
<!--            @current-change="handleInboundCurrentChange"-->
<!--            :current-page="inboundCurrentPage"-->
<!--            :page-sizes="[inboundPageSize]"-->
<!--            :page-size="inboundPageSize"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            :total="inboundsCount">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
  </div>

</template>

<script>



import service from "@/main";

export default {
  name: "StatementManagement",
  data() {
    return {
      dateRange: {},



      formInbound: {},
      formInboundDetail: {},
      inboundTableData: [],
      currentInbound: {},
      inboundDetailTableData: [],
      dialogFormInboundVisible: false,
      dialogFormInboundDetailVisible: false,
      supplierList: [],


      selectedItem: null,
      itemDetails: [],
      inboundDetailCurrentPage: 1,
      inboundDetailPageSize: 5,
      inboundDetailListCount: 0,

      inboundCurrentPage: 1,
      inboundPageSize: 5,
      inboundsCount: 0,


      dialogInboundDetailOld:[],
      dialogInboundDetailNew:[],
    }
  },
  mounted() {

  },

  methods: {
    downloadFile(fileName, base64Content) {
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${base64Content}`;
      link.download = fileName;
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    },
    inventoryManagementStatement(){
      service.get('/inventoryManagementStatement', {
        params: {
          beginDate: this.dateRange.beginDate,
          endDate: this.dateRange.endDate,
        }
      }).then(response => {
        if(response.data.code<400){
          const fileData = response.data.data; // Assuming this is the structure based on your backend
          const fileName = fileData.fileName; // Access the fileName
          const fileContent = fileData.fileContent; // Access the Base64 encoded content
          console.log("File Name:", fileName);
          console.log("File Content (Base64):", fileContent);
          // If you want to download the file on the client side
          this.downloadFile(fileName, fileContent);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>

</style>