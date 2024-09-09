<template>
  <div class="container">
    <div class="half">



      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>




      <el-dialog title="添加修改购买记录信息" :visible.sync="dialogFormPurchaseRecordVisible" :before-close="handlePurchaseRecordClose"
                 :close-on-click-modal="false">
        <el-form :model="formPurchaseRecord">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="购买时间" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="formPurchaseRecord.purchaseDate"
                              style="width: 70%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户信息" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-autocomplete
                  v-model="selectedCustomer"
                  :fetch-suggestions="querySearchCustomerDetail"
                  placeholder="搜索选择对应客户信息"
                  style="width: 70%;"
                  @select="handleCustomerSelection"
                  :value-key="'label'"
              >
              </el-autocomplete>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="助听器品牌" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input v-model="formPurchaseRecord.itemBrand" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
            <el-form-item label="助听器型号" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input v-model="formPurchaseRecord.itemModel" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="验配数量" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input-number v-model="formPurchaseRecord.itemAmount"  :precision="1"></el-input-number>
            </el-form-item>
            <el-form-item label="机身编码" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input v-model="formPurchaseRecord.machineNo" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="机身出厂日期" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="formPurchaseRecord.machineManufactureDate"
                              style="width: 70%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="充电器数量" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input-number v-model="formPurchaseRecord.chargerAmount"  :precision="0"></el-input-number>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="受话器数量" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <label>
                <span style="color: red;">*</span>
              </label>
              <el-input-number v-model="formPurchaseRecord.receiverAmount"  :precision="0"></el-input-number>
            </el-form-item>
            <el-form-item label="付款人姓名" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <el-input v-model="formPurchaseRecord.payerName" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="付款人电话号码" style="flex: 1; margin-right: 10px;" :label-width="'120px'">
              <el-input v-model="formPurchaseRecord.payerPhoneNumber" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formPurchaseRecord.paymentMethod" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>


          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="付款时间" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="formPurchaseRecord.paymentDate"
                              style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="付款金额" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input-number v-model="formPurchaseRecord.paymentAmount"  :precision="2"></el-input-number>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="推荐人工号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formPurchaseRecord.recommendationStaffId" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
            <el-form-item label="推荐人姓名" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formPurchaseRecord.recommendationStaffName" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formPurchaseRecord.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>
          </div>



        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handlePurchaseRecordClose">取 消</el-button>
          <el-button type="primary" @click="handlePurchaseRecordSave">保 存</el-button>
        </div>
      </el-dialog>



      <el-table
          :data="purchaseRecordTableData"
          border
          style="width: 100%"
          @row-click="handleRowClick"
      >
        <el-table-column
            prop="id"
            label="购买序号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="purchaseDate"
            label="购买时间"
            width="150">
        </el-table-column>
        <el-table-column
            prop="customer.name"
            label="客户姓名"
            width="150">
        </el-table-column>
        <el-table-column
            prop="itemBrand"
            label="助听器品牌"
            width="150">
        </el-table-column>
        <el-table-column
            prop="itemModel"
            label="助听器型号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="itemAmount"
            label="验配数量"
            width="150">
        </el-table-column>
        <el-table-column
            prop="machineNo"
            label="机身编码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="machineManufactureDate"
            label="机身出厂日期"
            width="150">
        </el-table-column>
        <el-table-column
            prop="chargerAmount"
            label="充电器数量"
            width="150">
        </el-table-column>
        <el-table-column
            prop="receiverAmount"
            label="受话器数量"
            width="150">
        </el-table-column>
        <el-table-column
            prop="receiverAmount"
            label="备注"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handlePurchaseRecordEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handlePurchaseRecordDelete(scope.row)" type="text" size="small"
                       >删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handlePurchaseRecordCurrentChange"
            :current-page="purchaseRecordCurrentPage"
            :page-sizes="[purchaseRecordPageSize]"
            :page-size="purchaseRecordPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="purchaseRecordListCount">
        </el-pagination>
      </div>
    </div>



  </div>
</template>
<script>
import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "PurchaseRecordManagement",
  data() {
    return {
      formPurchaseRecord : {
        id: 0,
        purchaseDate: "",
        customerId: 0,
        itemBrand: "",
        itemModel: "",
        itemAmount: 0,
        machineNo: "",
        machineManufactureDate: "",
        chargerAmount: 0,
        receiverAmount: 0,
        payerName: "",
        payerPhoneNumber: "",
        paymentMethod: "",
        paymentDate: "",
        paymentAmount: 0,
        customer:{},
        remark: ""
      },
      formPurchaseRecordEmpty: {
        id: 0,
        purchaseDate: "",
        customerId: 0,
        itemBrand: "",
        itemModel: "",
        itemAmount: 0,
        machineNo: "",
        machineManufactureDate: "",
        chargerAmount: 0,
        receiverAmount: 0,
        payerName: "",
        payerPhoneNumber: "",
        paymentMethod: "",
        paymentDate: "",
        paymentAmount: 0,
        customer:{},
        remark: ""
      },
      purchaseRecordTableData: [],
      currentPurchaseRecord: {},
      purchaseRecordDetailTableData: [],
      dialogFormPurchaseRecordVisible: false,
      dialogFormPurchaseRecordDetailVisible: false,
      supplierList: [],


      selectedCustomer: null,
      customerList: [],


      purchaseRecordCurrentPage: 1,
      purchaseRecordPageSize: 10,
      purchaseRecordListCount: 0,


      dialogPurchaseRecordOld: [],
      dialogPurchaseRecordNew: [],


    }

  },
  mounted() {
    this.queryPurchaseRecordList()
    this.querySupplierInformation()
  },
  methods: {
    querySupplierInformation() {
      // Create a Promise for each service.get call
      const fetchSupplierList = service.get('/querySupplierList', {
        params: {
          currentPage: 1,
          pageSize: 2 ** 31 - 1,
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
          pageSize: 2 ** 31 - 1,
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


    formatNumber(value) {
      return Number(value).toFixed(10);
    },

    handlePurchaseRecordDelete(row) {
      MessageBox.confirm("请确认是否删除入库单号为" + row.id + "的入库信息？该出库单号下所有入库信息都将被删除！",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deletePurchaseRecordById', {
          params: {
            id: row.id
          }
        }).then(response => {
          console.log(response);
          // Call queryCustomerInformation and wait for it to finish
          return this.queryPurchaseRecordList();
        }).then(() => {
          this.currentPurchaseRecord = {};
          this.purchaseRecordDetailTableData = [];
          console.log(this.purchaseRecordTableData)
          // After queryCustomerInformation is finished
          if (this.purchaseRecordTableData.length === 0 && this.purchaseRecordCurrentPage > 1) {
            this.purchaseRecordCurrentPage--;
            // Call queryCustomerInformation again after updating currentPage
            return this.queryPurchaseRecordList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handlePurchaseRecordSave() {
      console.log(this.formPurchaseRecord);
      service.post('/addOrUpdatePurchaseRecord', this.formPurchaseRecord
      ).then(
          (response) => {
            console.log(response);
            if (response.data.code < 400) {
              this.handlePurchaseRecordClose()
              this.currentPurchaseRecord = {}
              this.purchaseRecordDetailTableData = []
              return this.queryPurchaseRecordList();
            }

          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    handlePurchaseRecordClose() {
      this.selectedCustomer = ""
      this.formPurchaseRecord = JSON.parse(JSON.stringify(this.formPurchaseRecordEmpty))
      this.dialogFormPurchaseRecordVisible = false;
    },
    handlePurchaseRecordEdit(row) {
      console.log(row);
      let customer = {}
      customer.value = row.customerId
      console.log(customer)
      this.selectedCustomer = row.customer.id + " - " + row.customer.name
      this.handleCustomerSelection(customer)
      this.formPurchaseRecord = JSON.parse(JSON.stringify(row));

      this.dialogFormPurchaseRecordVisible = true;
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormPurchaseRecordVisible = true
    },

    handlePurchaseRecordCurrentChange(purchaseRecordCurrentPage) {
      this.purchaseRecordCurrentPage = purchaseRecordCurrentPage;
      this.queryPurchaseRecordList()
    },

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentPurchaseRecord = row
      console.log("Row clicked:", row);
      // this.queryPurchaseRecordDetail()

      // Additional logic here
    },


    handlePurchaseRecordDetailDelete(row) {
      this.formPurchaseRecordDetail.itemId = row.itemId
      this.formPurchaseRecordDetail.purchaseRecordNo = this.currentPurchaseRecord.purchaseRecordNo
      MessageBox.confirm("请确认是否删除入库单号为" + this.formPurchaseRecordDetail.purchaseRecordNo +
          "编码为" + row.item.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deletePurchaseRecordDetailByPurchaseRecordNoAndCustomerId', {
          params: {
            purchaseRecordNo: this.formPurchaseRecordDetail.purchaseRecordNo,
            itemId: this.formPurchaseRecordDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryCustomerInformation and wait for it to finish
          return this.queryPurchaseRecordDetail();
        }).then(() => {
          console.log(this.purchaseRecordDetailTableData)
          // After queryCustomerInformation is finished
          if (this.purchaseRecordDetailTableData.length === 0 && this.purchaseRecordDetailCurrentPage > 1) {
            this.purchaseRecordDetailCurrentPage--;
            // Call queryCustomerInformation again after updating currentPage
            return this.queryPurchaseRecordDetail();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handlePurchaseRecordDetailEdit(row) {

      console.log(row)
      this.openAddPurchaseRecordDetailDialog()
      let item = {}
      item.value = row.itemId
      console.log(item)
      this.selectedCustomer = row.item.code + " - " + row.item.name
      this.handleCustomerSelection(item)


    },
    handlePurchaseRecordDetailSave() {
      console.log("this.selectedCustomer");
      console.log(this.dialogPurchaseRecordNew);
      const dialogPurchaseRecordDetail = [
        this.dialogPurchaseRecordOld,
        this.dialogPurchaseRecordNew
      ];
      console.log(this.dialogPurchaseRecordOld)
      console.log(this.dialogPurchaseRecordNew)


      // Call the addOrUpdatePurchaseRecordDetail endpoint with machineNumbers
      service.post('/addOrUpdatePurchaseRecordDetail',
          dialogPurchaseRecordDetail
      )
          .then(response => {
            console.log(response);
            if (response.data.code < 400) {
              this.queryPurchaseRecordDetail()
              this.queryPurchaseRecordList()
              this.handlePurchaseRecordDetailClose()
            }

          })
          .catch(error => {
            console.log(error);
          });

    },









    queryPurchaseRecordList() {
      console.log("queryPurchaseRecordList");

      // Create a Promise for each service.get call
      const fetchPurchaseRecordListData = service.get('/queryPurchaseRecordList', {
        params: {
          currentPage: this.purchaseRecordCurrentPage,
          pageSize: this.purchaseRecordPageSize,
        }
      }).then(response => {
        console.log(response);
        this.purchaseRecordTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchPurchaseRecordCount = service.get('/queryPurchaseRecordListCount', {
        params: {
          currentPage: this.purchaseRecordCurrentPage,
          pageSize: this.purchaseRecordPageSize,
        }
      }).then(response => {
        console.log(response);
        this.purchaseRecordListCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchPurchaseRecordListData, fetchPurchaseRecordCount]);
    },

    querySearchCustomerDetail(queryString, cb) {
      // Make a GET request to your Spring Boot backend to fetch item details
      // You can use libraries like Axios for making HTTP requests
      service.get('/queryCustomerByIdOrName', {
        params: {
          input: queryString,
        }
      })

          .then(response => {
            // Process the response and extract item details
            this.customerList = response.data.data;
            // Call the callback function with the results
            cb(this.customerList.map(customer => ({value: customer.id, label: customer.id + " - " + customer.name})));
          })
          .catch(error => {
            console.error('Error fetching item details:', error);
          });
    },
    handleCustomerSelection(customer) {
      console.log(this.formPurchaseRecord)

      // Handle the selection of an item from the autocomplete dropdown
      this.formPurchaseRecord.customerId = customer.value

      service.get('/queryPurchaseRecordByIdAndCustomerId', {
        params: {
          id: this.formPurchaseRecord.id,
          customerId: this.formPurchaseRecord.customerId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                if (response.data.data === null) {
                  this.dialogPurchaseRecordOld = JSON.parse(JSON.stringify(this.formPurchaseRecordEmpty))

                  this.dialogPurchaseRecordNew = JSON.parse(JSON.stringify(this.formPurchaseRecordEmpty))
                } else {
                  //to deep copy
                  this.dialogPurchaseRecordOld = JSON.parse(JSON.stringify(response.data.data));
                  this.dialogPurchaseRecordNew = JSON.parse(JSON.stringify(response.data.data));
                  console.log("this.dialogPurchaseRecordNew")
                  console.log(this.dialogPurchaseRecordNew)
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