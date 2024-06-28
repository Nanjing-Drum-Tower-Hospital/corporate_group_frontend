<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div>
      <el-form :model="searchInput" :inline="true" style="display: inline-block">
        <el-form-item label="编码">
          <el-input v-model="searchInput.name"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="searchInput" :inline="true" style="display: inline-block;">
        <el-form-item label="创建时间">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="searchInput.beginDate"
                              style="width: 100%;">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="searchInput.endDate"
                              style="width: 100%;">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="queryItemInformation">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>
    </div>

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
          <el-form-item label="含税单价" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
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

    <div style="flex-grow: 1; overflow-y: auto;">
      <el-table
          :data="tableData"
          border
          class="custom-row-height"
          style="width: 100%; ">

        <el-table-column
            prop="itemDetail.code"
            label="编码"
            width="90">
        </el-table-column>
        <el-table-column
            prop="itemDetail.name"
            label="货品名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="itemDetail.model"
            label="型号"
            width="90">
        </el-table-column>
        <el-table-column
            prop="itemDetail.unitName"
            label="单位"
            width="90">
        </el-table-column>
        <el-table-column
            prop="itemDetail.sellingPriceBeforeTax"
            label="单价"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.itemDetail.sellingPriceBeforeTax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="itemDetail.tax"
            label="税额"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.itemDetail.tax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="itemDetail.sellingPrice"
            label="含税单价"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.itemDetail.sellingPrice) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="manufacturer.manufacturerName"
            label="制造商"
            width="150">
        </el-table-column>
        <el-table-column
            prop="itemDetail.createDate"
            label="创建时间"
            width="120">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClickDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[pageSize]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="itemsCount">
      </el-pagination>
    </div>
  </div>
</template>

<script >

import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "itemInformationMaintenance",
  data() {
    return {

      searchInput:{
        name:'',
        beginDate:'',
        endDate:''
      },
      tableData:{},
      dialogFormVisible: false,
      form:{},
      manufacturerList:[],
      currentPage:1,
      itemsCount:0,
      pageSize:10,
    }
  },
  mounted() {
    // Call your backend API to fetch the list of manufacturers
    service.get('/queryManufacturerList')
        .then(response => {
          // Assign the received data to the manufacturers array
          this.manufacturerList = response.data.data;
          console.log(this.manufacturerList)
        })
        .catch(error => {
          console.error('Error fetching manufacturer list:', error);
          // Handle errors if needed
        });
    this.queryItemInformation()
  },
  methods:{
    formatNumber(value) {
      return Number(value).toFixed(10);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryItemInformation()
    },
    handleClose(){
      this.form={}
      this.dialogFormVisible = false;
    },
    handleClickEdit(row){
      console.log(row);
      this.form = JSON.parse(JSON.stringify(row.itemDetail));
      this.dialogFormVisible = true;
    },

    handleClickDelete(row) {
      MessageBox.confirm('请确认是否删除该货品信息?', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteItem', {
          params: {
            id: row.itemDetail.id,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryItemInformation();
        }).then(() => {
          console.log(this.tableData)
          // After queryItemInformation is finished
          if (this.tableData.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryItemInformation();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },



    addItem(){
      console.log(this.form);
      service.post('/addOrUpdateItem', this.form
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormVisible = false;
            this.form={}
            return this.queryItemInformation();
          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    openAddDialog(){
      //the dialog should contain all the fields above
      this.dialogFormVisible= true
    },
    queryItemInformation() {
      // Create a Promise for each service.get call
      const fetchItemList = service.get('/queryItemList', {
        params: {
          code: this.searchInput.name,
          beginDate: this.searchInput.beginDate,
          endDate: this.searchInput.endDate,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
      }).then(response => {
        console.log(response);
        this.tableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchItemsCount = service.get('/queryItemsCount', {
        params: {
          code: this.searchInput.name,
          beginDate: this.searchInput.beginDate,
          endDate: this.searchInput.endDate,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
      }).then(response => {
        console.log(response);
        this.itemsCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchItemList, fetchItemsCount]);
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 96vh;
}



.content {
  flex: 1;
  padding: 20px 0;
}

.footer {
  margin-top: auto;
  padding: 10px 0;
}
.custom-row-height .el-table .el-table__row {
  height: 20px !important; /* Ensures this style overrides any existing styles */
  line-height: 20px !important; /* Adjust this as necessary to align text vertically */
}

.custom-row-height .el-table .cell {
  padding: 2px 0 !important; /* Reduces cell padding to fit the smaller height */
}


</style>