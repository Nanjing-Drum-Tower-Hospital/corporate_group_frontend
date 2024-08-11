<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div>


      <el-button type="primary" @click="queryInformation">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>
    </div>

    <el-dialog title="添加供应商信息" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="form">

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="供应商名称" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.manufacturerName" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>

        </div>





      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addManufacturer">保 存</el-button>
      </div>
    </el-dialog>

    <div style="flex-grow: 1; overflow-y: auto;">
      <el-table
          :data="tableData"
          border
          style="width: 100%;">
        <el-table-column
            prop="manufacturerName"
            label="供应商名称"
            width="150">
        </el-table-column>

        <el-table-column
            label="操作">
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
          :total="manufacturerListCount">
      </el-pagination>
    </div>
  </div>
</template>

<script >

import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "ManufacturerInformationMaintenance",
  data() {
    return {


      tableData: {},
      dialogFormVisible: false,
      form: {},
      manufacturerList: [],
      currentPage: 1,
      manufacturerListCount: 0,
      pageSize: 10,
    }
  },
  mounted() {
    this.queryManufacturerInformation()
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryManufacturerInformation()
    },
    handleClose() {
      this.form = {}
      this.dialogFormVisible = false;
    },
    handleClickEdit(row) {
      console.log(row);
      this.form = JSON.parse(JSON.stringify(row));
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
        service.get('/deleteManufacturer', {
          params: {
            id: row.id,
          }
        }).then(response => {
          console.log(response);
          // Call queryManufacturerInformation and wait for it to finish
          return this.queryManufacturerInformation();
        }).then(() => {
          console.log(this.tableData)
          // After queryManufacturerInformation is finished
          if (this.tableData.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            // Call queryManufacturerInformation again after updating currentPage
            return this.queryManufacturerInformation();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },


    addManufacturer() {
      console.log(this.form);
      service.post('/addOrUpdateManufacturer', this.form
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormVisible = false;
            this.form = {}
            return this.queryManufacturerInformation();
          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormVisible = true
    },
    queryManufacturerInformation() {
      // Create a Promise for each service.get call
      const fetchManufacturerList = service.get('/queryManufacturerList', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
      }).then(response => {
        console.log(response);
        this.tableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchManufacturerListCount = service.get('/queryManufacturerListCount', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
      }).then(response => {
        console.log(response);
        this.manufacturerListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchManufacturerList, fetchManufacturerListCount]);
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
</style>