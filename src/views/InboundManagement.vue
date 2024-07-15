<template>
  <div class="container">
    <div class="half">

      <el-button type="primary" @click="queryInboundList">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>

      <el-dialog title="添加修改入库信息" :visible.sync="dialogFormInboundVisible" :before-close="handleInboundClose"
                 :close-on-click-modal="false">
        <el-form :model="formInbound">




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
            prop="inboundInfo.inboundNo"
            label="入库单号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="inboundInfo.inboundDate"
            label="入库时间"
            width="150">
        </el-table-column>
        <el-table-column
            prop="supplier.supplierName"
            label="供应商"
            width="150">
        </el-table-column>


        <el-table-column
            prop="inboundInfo.remark"
            label="备注"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleInboundEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleInboundDelete(scope.row)" type="text" size="small"
                       :disabled="!isCurrentMonth(scope.row.inboundInfo.inboundDate)">删除</el-button>
            <el-button @click="handleInboundAccountingReversal(scope.row)" type="text" size="small"
                       :disabled="isCurrentMonth(scope.row.inboundInfo.inboundDate) || (scope.row.inboundInfo.accountingReversalInboundNo)">
              冲红</el-button>

          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleInboundCurrentChange"
            :current-page="inboundCurrentPage"
            :page-sizes="[inboundPageSize]"
            :page-size="inboundPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="inboundsCount">
        </el-pagination>
      </div>
    </div>
    <div class="half">
      <div v-if="currentInbound && currentInbound.inboundInfo">
              <span  >
  入库单号：{{ currentInbound.inboundInfo.inboundNo }}

</span>


        <el-button @click="openAddInboundDetailDialog" type="primary"
                   :disabled="!isCurrentMonth(currentInbound.inboundInfo.inboundDate) || currentInbound.inboundInfo.accountingReversalInboundNo">
          添加
        </el-button>
      </div>
      <div>

      </div>

      <el-dialog title="添加修改入库货品信息" :visible.sync="dialogFormInboundDetailVisible"
                 :before-close="handleInboundDetailClose" :close-on-click-modal="false">


        <el-form :model="formInboundDetail">
          <el-form-item label="入库单号：" style="flex: 1; margin-right: 10px;" :label-width="'100px'" v-if="currentInbound && currentInbound.inboundInfo">
            {{ currentInbound.inboundInfo.inboundNo }}
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
              <el-input-number v-model="dialogInboundDetailNew.itemAmount"  ></el-input-number>
            </el-form-item>

          </div>

          <div  style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="dialogInboundDetailNew.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>

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
          style="width: 100%;">
        <el-table-column
            prop="item.itemDetail.code"
            label="编码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="item.itemDetail.name"
            label="货品名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="item.itemDetail.model"
            label="货品型号"
            width="120">
        </el-table-column>

        <el-table-column
            prop="inboundItem.itemAmount"
            label="数量"
            width="120">
        </el-table-column>
        <el-table-column
            prop="inboundItem.remark"
            label="备注"
            width="120">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleInboundDetailEdit(scope.row)" type="text" size="small"
                       :disabled="!isCurrentMonth(currentInbound.inboundInfo.inboundDate) || currentInbound.inboundInfo.accountingReversalInboundNo">编辑</el-button>
            <el-button @click="handleInboundDetailDelete(scope.row)" type="text" size="small"
                       :disabled="!isCurrentMonth(currentInbound.inboundInfo.inboundDate) || currentInbound.inboundInfo.accountingReversalInboundNo">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleInboundDetailCurrentChange"
            :current-page="inboundDetailCurrentPage"
            :page-sizes="[inboundDetailPageSize]"
            :page-size="inboundDetailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="inboundDetailsCount">
        </el-pagination>
      </div>
    </div>


  </div>
</template>
<script>
import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "inboundManagement",
  data() {
    return {
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
      inboundDetailsCount: 0,

      inboundCurrentPage: 1,
      inboundPageSize: 5,
      inboundsCount: 0,


      dialogInboundDetailOld:[],
      dialogInboundDetailNew:[]
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
    this.queryInboundList()
  },
  methods: {
    isCurrentMonth(dateStr) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // Note: January is 0
      const date = new Date(dateStr);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    },
    handleInboundAccountingReversal(row){
      MessageBox.confirm("请确认是否对入库单号为" + row.inboundInfo.inboundNo + "的入库信息进行冲红？",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/inboundAccountingReversal', {
          params: {
            inboundNo: row.inboundInfo.inboundNo
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryInboundList();
        }).then(() => {
          this.currentInbound = {};
          this.inboundDetailTableData= [];
          console.log(this.inboundTableData)
          // After queryItemInformation is finished
          if (this.inboundTableData.length === 0 && this.inboundCurrentPage > 1) {
            this.inboundCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryInboundList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });

    },
    handleInboundDelete(row) {
      MessageBox.confirm("请确认是否删除入库单号为" + row.inboundInfo.inboundNo + "的入库信息？该出库单号下所有入库信息都将被删除！",
          '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteInbound', {
          params: {
            inboundNo: row.inboundInfo.inboundNo
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryInboundList();
        }).then(() => {
          this.currentInbound = {};
          this.inboundDetailTableData= [];
          console.log(this.inboundTableData)
          // After queryItemInformation is finished
          if (this.inboundTableData.length === 0 && this.inboundCurrentPage > 1) {
            this.inboundCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryInboundList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleInboundSave() {

      console.log(this.formInbound);
      service.post('/addOrUpdateInbound', this.formInbound
      ).then(
          (response) => {
            console.log(response);
            if(response.data.code<400){
              this.dialogFormInboundVisible = false;
              this.formInbound = {}
              this.currentInbound= {}
              this.inboundDetailTableData = []
              return this.queryInboundList();
            }

          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    handleInboundClose() {
      this.formInbound = {}
      this.dialogFormInboundVisible = false;
    },
    handleInboundEdit(row) {
      console.log(row);
      this.formInbound = JSON.parse(JSON.stringify(row.inboundInfo));
      this.dialogFormInboundVisible = true;
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormInboundVisible = true
    },

    handleInboundCurrentChange(inboundCurrentPage){
      this.inboundCurrentPage = inboundCurrentPage;
      this.queryInboundList()
    },

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentInbound = row
      console.log("Row clicked:", row);
      this.queryInboundDetail()

      // Additional logic here
    },


    handleInboundDetailDelete(row) {
      this.formInboundDetail.itemId = row.inboundItem.itemId
      this.formInboundDetail.inboundNo = this.currentInbound.inboundInfo.inboundNo
      MessageBox.confirm("请确认是否删除入库单号为" + this.formInboundDetail.inboundNo +
          "编码为" + row.item.itemDetail.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteInboundItemListByInboundNoAndItemId', {
          params: {
            inboundNo: this.formInboundDetail.inboundNo,
            itemId: this.formInboundDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryInboundDetail();
        }).then(() => {
          console.log(this.inboundDetailTableData)
          // After queryItemInformation is finished
          if (this.inboundDetailTableData.length === 0 && this.inboundDetailCurrentPage > 1) {
            this.inboundDetailCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryInboundDetail();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleInboundDetailEdit(row) {

      console.log(row)
      this.openAddInboundDetailDialog()
      let item={}
      item.value=row.inboundItem.itemId
      console.log(item)
      this.selectedItem=row.item.itemDetail.code+" - "+row.item.itemDetail.name
      this.handleItemDetailSelection(item)


    },
    handleInboundDetailSave() {
      console.log("this.selectedItem");
      console.log(this.selectedItem);
      const dialogInboundDetail = [
        this.dialogInboundDetailOld,
        this.dialogInboundDetailNew
      ];
      console.log(this.dialogInboundDetailOld)
      console.log(this.dialogInboundDetailNew)




      // Call the addOrUpdateInboundDetail endpoint with machineNumbers
      service.post('/addOrUpdateInboundDetail',
          dialogInboundDetail
      )
          .then(response => {
            console.log(response);
            if(response.data.code<400){
              this.queryInboundDetail()
              this.handleInboundDetailClose()
            }

          })
          .catch(error => {
            console.log(error);
          });

    },


    openAddInboundDetailDialog() {
      this.selectedItem = ""
      this.formInboundDetail.inboundNo = this.currentInbound.inboundInfo.inboundNo
      this.dialogFormInboundDetailVisible = true
    },
    handleInboundDetailCurrentChange(inboundDetailCurrentPage) {
      this.inboundDetailCurrentPage = inboundDetailCurrentPage;
      this.queryInboundDetail()
    },

    handleInboundDetailClose() {
      this.dialogFormInboundDetailVisible = false;
      this.selectedItem = ""
      this.formInboundDetail = {}
      this.dialogInboundDetailOld = {
        id: 0,
        inboundNo:this.formInboundDetail.inboundNo,
        itemId:this.formInboundDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
      this.dialogInboundDetailNew = {
        id: 0,
        inboundNo:this.formInboundDetail.inboundNo,
        itemId:this.formInboundDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
    },

    queryInboundDetail() {

      // Create a Promise for each service.get call
      const fetchInboundDetailData = service.get('/queryInboundDetailList', {
        params: {
          inboundNo: this.currentInbound.inboundInfo.inboundNo,
          currentPage: this.inboundDetailCurrentPage,
          pageSize: this.inboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.inboundDetailTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchInboundDetailsCount = service.get('/countInboundDetailList', {
        params: {
          inboundNo: this.currentInbound.inboundInfo.inboundNo,
          currentPage: this.inboundDetailCurrentPage,
          pageSize: this.inboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.inboundDetailsCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchInboundDetailData, fetchInboundDetailsCount]);
    },


    queryInboundList() {
      console.log("queryInboundList");

      // Create a Promise for each service.get call
      const fetchInboundListData = service.get('/queryInboundList', {
        params: {
          currentPage: this.inboundCurrentPage,
          pageSize: this.inboundPageSize,
        }
      }).then(response => {
        console.log(response);
        this.inboundTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchInboundCount = service.get('/queryInboundCount', {
        params: {
          currentPage: this.inboundCurrentPage,
          pageSize: this.inboundPageSize,
        }
      }).then(response => {
        console.log(response);
        this.inboundsCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchInboundListData, fetchInboundCount]);
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
      this.formInboundDetail.itemId = item.value

      service.get('/queryInboundItemListByInboundNoAndItemId', {
        params: {
          inboundNo: this.formInboundDetail.inboundNo,
          itemId: this.formInboundDetail.itemId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                if(response.data.data===null) {
                  this.dialogInboundDetailOld = {
                    id: 0,
                    inboundNo:this.formInboundDetail.inboundNo,
                    itemId:this.formInboundDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                  this.dialogInboundDetailNew = {
                    id: 0,
                    inboundNo:this.formInboundDetail.inboundNo,
                    itemId:this.formInboundDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                }else{
                  //to deep copy
                  this.dialogInboundDetailOld=JSON.parse(JSON.stringify(response.data.data));
                  this.dialogInboundDetailNew=JSON.parse(JSON.stringify(response.data.data));
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