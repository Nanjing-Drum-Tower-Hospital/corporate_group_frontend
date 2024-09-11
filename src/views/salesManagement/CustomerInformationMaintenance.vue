<template>
  <div class="container">
    <div class="half">

<!--      <el-button type="primary" @click="queryCustomerList">-->
<!--        搜索-->
<!--      </el-button>-->

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>




      <el-dialog title="添加客户信息" :visible.sync="dialogFormCustomerVisible" :before-close="handleCustomerClose"
                 :close-on-click-modal="false">
        <el-form :model="formCustomer">


          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="姓名" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input v-model="formCustomer.name" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="性别" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formCustomer.gender" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="手机号码" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formCustomer.phoneNumber" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="邮箱地址" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formCustomer.emailAddress" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formCustomer.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCustomerClose">取 消</el-button>
          <el-button type="primary" @click="handleCustomerSave">保 存</el-button>
        </div>
      </el-dialog>



      <el-table
          :data="customerTableData"
          border
          style="width: 100%"
          @row-click="handleRowClick"
      >
        <el-table-column
            prop="id"
            label="序号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="150">
        </el-table-column>

        <el-table-column
            prop="gender"
            label="性别"
            width="150">

        </el-table-column>
        <el-table-column
            prop="phoneNumber"
            label="电话号码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="emailAddress"
            label="邮箱地址"
            width="150">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleCustomerEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleCustomerDelete(scope.row)" type="text" size="small"
                       :disabled="scope.row.checkOut">删除</el-button>

          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleCustomerCurrentChange"
            :current-page="customerCurrentPage"
            :page-sizes="[customerPageSize]"
            :page-size="customerPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="customerListCount">
        </el-pagination>
      </div>
    </div>



  </div>
</template>
<script>
import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "CustomerInformationMaintenance",
  data() {
    return {
      formCustomer: {},
      formCustomerDetail: {},
      customerTableData: [],
      currentCustomer: {},
      customerDetailTableData: [],
      dialogFormCustomerVisible: false,
      dialogFormCustomerDetailVisible: false,
      supplierList: [],


      selectedItem: null,
      itemDetails: [],
      customerDetailCurrentPage: 1,
      customerDetailPageSize: 5,
      customerDetailListCount: 0,

      customerCurrentPage: 1,
      customerPageSize: 10,
      customerListCount: 0,


      dialogCustomerDetailOld:[],
      dialogCustomerDetailNew:[],


    }

  },
  mounted() {
    this.queryCustomerList()
    this.querySupplierInformation()
  },
  methods: {
    querySupplierInformation() {
      // Create a Promise for each service.get call
      const fetchSupplierList = service.get('/querySupplierList', {
        params: {
          currentPage: 1,
          pageSize: 2**31 - 1,
        }
      }).then(response => {
        console.log(response);
        this.supplierList = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchSupplierListCount = service.get('/querySupplierListCount', {
        params: {
          currentPage: 1,
          pageSize: 2**31 - 1,
        }
      }).then(response => {
        console.log(response);
        this.supplierListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchSupplierList, fetchSupplierListCount]);
    },
    downloadFile(fileName, base64Content) {
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${base64Content}`;
      link.download = fileName;
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    },

    handleCustomerDelete(row) {
      MessageBox.confirm("请确认是否删除入库单号为" + row.id + "的入库信息？该出库单号下所有入库信息都将被删除！",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteCustomerById', {
          params: {
            id: row.id
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryCustomerList();
        }).then(() => {
          this.currentCustomer = {};
          this.customerDetailTableData= [];
          console.log(this.customerTableData)
          // After queryItemInformation is finished
          if (this.customerTableData.length === 0 && this.customerCurrentPage > 1) {
            this.customerCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryCustomerList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleCustomerSave() {
      console.log(this.formCustomer);
      service.post('/addOrUpdateCustomer', this.formCustomer
      ).then(
          (response) => {
            console.log(response);
            if(response.data.code<400){
              this.dialogFormCustomerVisible = false;
              this.formCustomer = {}
              this.currentCustomer= {}
              this.customerDetailTableData = []
              return this.queryCustomerList();
            }

          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    handleCustomerClose() {
      this.formCustomer = {}
      this.dialogFormCustomerVisible = false;
    },
    handleCustomerEdit(row) {
      console.log(row);
      this.formCustomer = JSON.parse(JSON.stringify(row));
      this.dialogFormCustomerVisible = true;
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormCustomerVisible = true
    },

    handleCustomerCurrentChange(customerCurrentPage){
      this.customerCurrentPage = customerCurrentPage;
      this.queryCustomerList()
    },

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentCustomer = row
      console.log("Row clicked:", row);
      this.queryCustomerDetail()

      // Additional logic here
    },



    queryCustomerList() {
      console.log("queryCustomerList");

      // Create a Promise for each service.get call
      const fetchCustomerListData = service.get('/queryCustomerList', {
        params: {
          currentPage: this.customerCurrentPage,
          pageSize: this.customerPageSize,
        }
      }).then(response => {
        console.log(response);
        this.customerTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchCustomerCount = service.get('/queryCustomerListCount', {
        params: {
          currentPage: this.customerCurrentPage,
          pageSize: this.customerPageSize,
        }
      }).then(response => {
        console.log(response);
        this.customerListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchCustomerListData, fetchCustomerCount]);
    },


  }



}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 96vh; /* Set container height to full viewport height */
}

.half {
  flex: 1;
  overflow-y: auto; /* Optional: Add scroll if content exceeds upper half */
}
</style>