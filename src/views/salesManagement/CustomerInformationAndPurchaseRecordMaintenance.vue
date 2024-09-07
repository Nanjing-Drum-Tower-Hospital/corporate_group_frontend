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
    <div class="half">
      <div v-if="currentCustomer ">
              <span  >
  入库单号：{{ currentCustomer.customerNo }}

</span>


        <el-button @click="openAddCustomerDetailDialog" type="primary"
                   :disabled="currentCustomer.checkOut   || currentCustomer.accountingReversalCustomerNo !== null">
          添加
        </el-button>

      </div>
      <div>

      </div>

      <el-dialog title="添加修改入库货品信息" :visible.sync="dialogFormCustomerDetailVisible"
                 :before-close="handleCustomerDetailClose" :close-on-click-modal="false">


        <el-form :model="formCustomerDetail">
          <el-form-item label="入库单号：" style="flex: 1; margin-right: 10px;" :label-width="'100px'" v-if="currentCustomer">
            {{ currentCustomer.customerNo }}
          </el-form-item>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="货品编码名称" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-autocomplete
                  v-model="selectedItem"
                  :fetch-suggestions="querySearchItemDetail"
                  placeholder="搜索选择对应货品编码名称"
                  style="width: 100%;"
                  @select="handleItemDetailSelection"
                  :value-key="'label'"

              >

              </el-autocomplete>
            </el-form-item>

          </div>

          <div >
            <el-form-item label="数量" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input-number v-model="dialogCustomerDetailNew.itemAmount"  :precision="1"></el-input-number>
            </el-form-item>

          </div>

          <div  style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="dialogCustomerDetailNew.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>

          </div>



        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCustomerDetailClose">取 消</el-button>
          <el-button type="primary" @click="handleCustomerDetailSave">保 存</el-button>
        </div>
      </el-dialog>
      <el-table
          :data="customerDetailTableData"
          border
          style="width: 100%;">
        <el-table-column
            prop="item.code"
            label="编码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="item.name"
            label="货品名称"
            width="240">
        </el-table-column>
        <el-table-column
            prop="item.model"
            label="货品型号"
            width="120">
        </el-table-column>

        <el-table-column
            prop="itemAmount"
            label="数量"
            width="120">
        </el-table-column>
        <el-table-column
            prop="customerDetailPriceExcludingTax"
            label="金额"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.customerDetailPriceExcludingTax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="customerDetailPriceIncludingTax"
            label="价税合计"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.customerDetailPriceIncludingTax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            width="360">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleCustomerDetailEdit(scope.row)" type="text" size="small"
                       :disabled="currentCustomer.checkOut || !!currentCustomer.accountingReversalCustomerNo">编辑</el-button>
            <el-button @click="handleCustomerDetailDelete(scope.row)" type="text" size="small"
                       :disabled="currentCustomer.checkOut || !!currentCustomer.accountingReversalCustomerNo">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleCustomerDetailCurrentChange"
            :current-page="customerDetailCurrentPage"
            :page-sizes="[customerDetailPageSize]"
            :page-size="customerDetailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="customerDetailListCount">
        </el-pagination>
      </div>
    </div>


  </div>
</template>
<script>
import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "CustomerInformationAndPurchaseRecordMaintenance",
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
      customerPageSize: 5,
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
    handleCustomerStatementExport(row){
      service.post('/customerStatement',
          row
      ).then(
          (response) => {

            if(response.data.code<400){
              const fileData = response.data.data; // Assuming this is the structure based on your backend
              const fileName = fileData.fileName; // Access the fileName
              const fileContent = fileData.fileContent; // Access the Base64 encoded content
              console.log("File Name:", fileName);
              console.log("File Content (Base64):", fileContent);
              // If you want to download the file on the client side
              this.downloadFile(fileName, fileContent);
            }
          })
          .catch(
              (error) => {
                console.log(error);
              });


    },

    formatNumber(value) {
      return Number(value).toFixed(10);
    },
    isCurrentMonth(dateStr) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // Note: January is 0
      const date = new Date(dateStr);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    },
    handleCustomerAccountingReversal(row){
      MessageBox.confirm("请确认是否对入库单号为" + row.customerNo + "的入库信息进行冲红？",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/customerAccountingReversal', {
          params: {
            customerNo: row.customerNo
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


    handleCustomerDetailDelete(row) {
      this.formCustomerDetail.itemId = row.itemId
      this.formCustomerDetail.customerNo = this.currentCustomer.customerNo
      MessageBox.confirm("请确认是否删除入库单号为" + this.formCustomerDetail.customerNo +
          "编码为" + row.item.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteCustomerDetailByCustomerNoAndItemId', {
          params: {
            customerNo: this.formCustomerDetail.customerNo,
            itemId: this.formCustomerDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryCustomerDetail();
        }).then(() => {
          console.log(this.customerDetailTableData)
          // After queryItemInformation is finished
          if (this.customerDetailTableData.length === 0 && this.customerDetailCurrentPage > 1) {
            this.customerDetailCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryCustomerDetail();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleCustomerDetailEdit(row) {

      console.log(row)
      this.openAddCustomerDetailDialog()
      let item={}
      item.value=row.itemId
      console.log(item)
      this.selectedItem=row.item.code+" - "+row.item.name
      this.handleItemDetailSelection(item)


    },
    handleCustomerDetailSave() {
      console.log("this.selectedItem");
      console.log(this.dialogCustomerDetailNew);
      const dialogCustomerDetail = [
        this.dialogCustomerDetailOld,
        this.dialogCustomerDetailNew
      ];
      console.log(this.dialogCustomerDetailOld)
      console.log(this.dialogCustomerDetailNew)




      // Call the addOrUpdateCustomerDetail endpoint with machineNumbers
      service.post('/addOrUpdateCustomerDetail',
          dialogCustomerDetail
      )
          .then(response => {
            console.log(response);
            if(response.data.code<400){
              this.queryCustomerDetail()
              this.queryCustomerList()
              this.handleCustomerDetailClose()
            }

          })
          .catch(error => {
            console.log(error);
          });

    },


    openAddCustomerDetailDialog() {
      this.selectedItem = ""
      this.formCustomerDetail.customerNo = this.currentCustomer.customerNo
      this.dialogFormCustomerDetailVisible = true
    },
    handleCustomerDetailCurrentChange(customerDetailCurrentPage) {
      this.customerDetailCurrentPage = customerDetailCurrentPage;
      this.queryCustomerDetail()
    },

    handleCustomerDetailClose() {
      this.dialogFormCustomerDetailVisible = false;
      this.selectedItem = ""
      this.formCustomerDetail = {}
      this.dialogCustomerDetailOld = {
        id: 0,
        customerNo:this.formCustomerDetail.customerNo,
        itemId:this.formCustomerDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
      this.dialogCustomerDetailNew = {
        id: 0,
        customerNo:this.formCustomerDetail.customerNo,
        itemId:this.formCustomerDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
      this.queryCustomerList();
    },

    queryCustomerDetail() {

      // Create a Promise for each service.get call
      const fetchCustomerDetailData = service.get('/queryCustomerDetailList', {
        params: {
          customerNo: this.currentCustomer.customerNo,
          currentPage: this.customerDetailCurrentPage,
          pageSize: this.customerDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.customerDetailTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchCustomerDetailListCount = service.get('/queryCustomerDetailListCount', {
        params: {
          customerNo: this.currentCustomer.customerNo,
          currentPage: this.customerDetailCurrentPage,
          pageSize: this.customerDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.customerDetailListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchCustomerDetailData, fetchCustomerDetailListCount]);
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

    querySearchItemDetail(queryString, cb) {
      // Make a GET request to your Spring Boot backend to fetch item details
      // You can use libraries like Axios for making HTTP requests
      service.get('/queryItemByCodeOrName', {
        params: {
          input: queryString,
        }
      })

          .then(response => {
            // Process the response and extract item details
            this.itemDetails = response.data.data;
            // Call the callback function with the results
            cb(this.itemDetails.map(item => ({value: item.id, label: item.code + " - " + item.name})));
          })
          .catch(error => {
            console.error('Error fetching item details:', error);
          });
    },
    handleItemDetailSelection(item) {

      // Handle the selection of an item from the autocomplete dropdown
      this.formCustomerDetail.itemId = item.value

      service.get('/queryCustomerItemListByCustomerNoAndItemId', {
        params: {
          customerNo: this.formCustomerDetail.customerNo,
          itemId: this.formCustomerDetail.itemId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                if(response.data.data===null) {
                  this.dialogCustomerDetailOld = {
                    id: 0,
                    customerNo:this.formCustomerDetail.customerNo,
                    itemId:this.formCustomerDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                  this.dialogCustomerDetailNew = {
                    id: 0,
                    customerNo:this.formCustomerDetail.customerNo,
                    itemId:this.formCustomerDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                }else{
                  //to deep copy
                  this.dialogCustomerDetailOld=JSON.parse(JSON.stringify(response.data.data));
                  this.dialogCustomerDetailNew=JSON.parse(JSON.stringify(response.data.data));
                  console.log("this.dialogCustomerDetailNew")
                  console.log(this.dialogCustomerDetailNew)
                }

              })
          .catch(
              (error) => {
                console.log(error);
              });


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