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
        <el-form :inline="true" style="display: inline-block;">
          <el-form-item  style="flex: 1;"  label="合计单位：">
            <el-select v-model="mainUnitName" placeholder="请选择" >
              <el-option
                  v-for="unitName in unitNameList"
                  :key="unitName"
                  :label="unitName"
                  :value="unitName">
              </el-option>
            </el-select>
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




      <el-dialog title="添加修改入库信息" :visible.sync="dialogFormVisible" :before-close="handleUnitRatioClose"
                 :close-on-click-modal="false">
        <el-form :model="formUnitRatio">

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">


            <el-form-item  style="flex: 1; ">
              <el-select v-model="formUnitRatio.unitNameLeft" placeholder="左侧单位" >
                <el-option
                    v-for="unitName in unitNameList"
                    :key="unitName"
                    :label="unitName"
                    :value="unitName">
                </el-option>
              </el-select>
            </el-form-item>
            <span style="font-size: 24px; align-self: center;">
    =
  </span>

            <el-form-item  style="flex: 1;" :label-width="'100px'">
              <el-form-item  style="flex: 1; margin-right: 10px;">
                <el-input-number v-model="formUnitRatio.ratio" :min="0" ></el-input-number>
              </el-form-item>
            </el-form-item>

            <el-form-item  style="flex: 1;" >
              <el-select v-model="formUnitRatio.unitNameRight" placeholder="右侧单位" >
                <el-option
                    v-for="unitName in unitNameList"
                    :key="unitName"
                    :label="unitName"
                    :value="unitName">
                </el-option>
              </el-select>
            </el-form-item>
          </div>





        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleUnitRatioClose">取 消</el-button>
          <el-button type="primary" @click="handleUnitRatioSave">保 存</el-button>
        </div>
      </el-dialog>



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
import {MessageBox} from "element-ui";

export default {
  name: "StatementManagement",
  data() {
    return {
      dateRange: {},
      formUnitRatio: {
        unitNameLeft: null,
        unitNameRight: null,
        ratio: 0
      },

      dialogFormVisible:false,

      unitRatioCurrentPage: 1,
      unitRatioPageSize: 5,
      unitRatioListCount: 0,
      unitRatioTableData: [],
      unitNameList:[],
      mainUnitName:null


    }
  },
  mounted() {
    this.queryUnitRatioList()
    this.queryUnitNameList()
  },

  methods: {
    handleUnitRatioSave(){
      service.post('/addUnitRatio', this.formUnitRatio).then(response => {
        console.log(response);
        if(response.data.code<400){
          this.queryUnitRatioList()
          this.handleUnitRatioClose()
        }
      }).catch(error => {
        console.error(error);
      });
    },
    queryUnitNameList(){
      service.get('/queryItemList', {
        params: {
          code: null,
          beginDate: null,
          endDate: null,
          currentPage: 1,
          pageSize: 2147483647,
        }
      }).then(response => {
        console.log(response);
        this.unitNameList = Array.from(new Set(response.data.data.map(item => item.unitName)));
        console.log(this.unitNameList)
      }).catch(error => {
        console.error(error);
      });
    },
    handleUnitRatioClose(){
      this.formUnitRatio = {}
      this.dialogFormVisible = false;
    },
    openAddDialog(){
      this.dialogFormVisible=true
    },
    handleUnitRatioDelete(row){
      console.log(row);
      MessageBox.confirm("请确认是否删除"+ row.unitNameLeft + "与" + row.unitNameRight + "的比例？",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteUnitRatio', {
          params:{
            id: row.id
          }

        }).then(response => {
          console.log(response);
          this.queryUnitRatioList()
        }).catch(error => {
          console.error(error);
        }).then(() => {
          this.unitRatioCurrentPage = 1;
          this.unitRatioTableData = [];
          console.log(this.unitRatioTableData)
          // After queryItemInformation is finished
          if (this.unitRatioTableData.length === 0 && this.unitRatioTableData > 1) {
            this.unitRatioCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryUnitRatioList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });




    },
    handleUnitRatioCurrentChange(unitRatioCurrentPage){
      this.inboundCurrentPage = unitRatioCurrentPage;
      this.queryUnitRatioList()
    },

    queryUnitRatioList(){
      // Create a Promise for each service.get call
      const queryUnitRatioList = service.get('/queryUnitRatioList', {
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

      const queryUnitRatioListCount = service.get('/queryUnitRatioListCount', {
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
      return Promise.all([queryUnitRatioList, queryUnitRatioListCount]);
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
          mainUnitName: this.mainUnitName
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