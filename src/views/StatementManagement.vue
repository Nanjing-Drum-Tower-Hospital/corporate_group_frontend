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
          :data="unitRatioTableData"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="unitNameLeft"
            label="左"
            width="150"
        >
        </el-table-column>

        <el-table-column
            label="="
            width="150">
          <template>
            <!-- Display '=' for each row -->
            =
          </template>
        </el-table-column>

        <el-table-column
            prop="ratio"
            label="比例"
            width="150">
        </el-table-column>

        <el-table-column
            prop="unitNameRight"
            label="右"
            width="150">
        </el-table-column>


        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleUnitRatioDelete(scope.row)" type="text" size="small">删除</el-button>

          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleUnitRatioCurrentChange"
            :current-page="unitRatioCurrentPage"
            :page-sizes="[unitRatioPageSize]"
            :page-size="unitRatioPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="unitRatioListCount">
        </el-pagination>
      </div>
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




      unitRatioCurrentPage: 1,
      unitRatioPageSize: 5,
      unitRatioListCount: 0,
      unitRatioTableData: [],

      // dialogInboundDetailOld:[],
      // dialogInboundDetailNew:[],
    }
  },
  mounted() {
    this.queryUnitRatioList()
  },

  methods: {
    handleUnitRatioDelete(row){
      console.log(row);
      service.post('/deleteUnitRatio', {
        id: row.id
      }).then(response => {
        console.log(response);
        this.queryUnitRatioList()
      }).catch(error => {
        console.error(error);
      });
    },
    handleUnitRatioCurrentChange(unitRatioCurrentPage){
      this.inboundCurrentPage = unitRatioCurrentPage;
      this.queryUnitRatioList()
    },

    queryUnitRatioList(){
      // Create a Promise for each service.get call
      const fetchInboundDetailData = service.get('/queryUnitRatioList', {
        params: {
          currentPage: this.unitRatioCurrentPage,
          pageSize: this.unitRatioPageSize,
        }
      }).then(response => {
        console.log(response);
        this.unitRatioTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchInboundDetailListCount = service.get('/queryUnitRatioListCount', {
        params: {
          currentPage: this.unitRatioCurrentPage,
          pageSize: this.unitRatioPageSize,
        }
      }).then(response => {
        console.log(response);
        this.unitRatioListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchInboundDetailData, fetchInboundDetailListCount]);
    },


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