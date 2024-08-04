<template>
  <div class="container">
    <div class="half">

      <el-button type="primary" @click="queryOutboundList">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>

      <el-dialog title="添加修改入库信息" :visible.sync="dialogFormOutboundVisible" :before-close="handleOutboundClose"
                 :close-on-click-modal="false">
        <el-form :model="formOutbound">



          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="formOutbound.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>

          </div>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleOutboundClose">取 消</el-button>
          <el-button type="primary" @click="handleOutboundSave">保 存</el-button>
        </div>
      </el-dialog>
      <el-table
          :data="outboundTableData"
          border
          style="width: 100%"
          @row-click="handleRowClick"
      >
        <el-table-column
            prop="outboundNo"
            label="入库单号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="outboundDate"
            label="入库时间"
            width="150">
        </el-table-column>
        <el-table-column
            prop="outboundPriceExcludingTax"
            label="金额"
            width="150">
        </el-table-column>
        <el-table-column
            prop="outboundPriceIncludingTax"
            label="价税合计"
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
            <el-button @click="handleOutboundEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleOutboundDelete(scope.row)" type="text" size="small"
                       :disabled="scope.row.checkOut" >删除</el-button>
            <el-button @click="handleOutboundAccountingReversal(scope.row)" type="text" size="small"
                       :disabled="!scope.row.checkOut || !!(scope.row.accountingReversalOutboundNo)">
              冲红
            </el-button>
            <el-button @click="handleOutboundStatementExport(scope.row)" type="text" size="small"
                       :disabled="!scope.row.checkOut ">
              导出</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleOutboundCurrentChange"
            :current-page="outboundCurrentPage"
            :page-sizes="[outboundPageSize]"
            :page-size="outboundPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="outboundsCount">
        </el-pagination>
      </div>
    </div>
    <div class="half">
      <div v-if="currentOutbound">
              <span  >
  入库单号：{{ currentOutbound.outboundNo }}

</span>


        <el-button @click="openAddOutboundDetailDialog" type="primary"
                   :disabled="currentOutbound.checkOut || !!currentOutbound.accountingReversalOutboundNo">
          添加
        </el-button>
      </div>
      <div>

      </div>

      <el-dialog title="添加修改入库货品信息" :visible.sync="dialogFormOutboundDetailVisible"
                 :before-close="handleOutboundDetailClose" :close-on-click-modal="false">


        <el-form :model="formOutboundDetail">
          <el-form-item label="入库单号：" style="flex: 1; margin-right: 10px;" :label-width="'100px'" v-if="currentOutbound ">
            {{ currentOutbound.outboundNo }}
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
          <div>
            <el-form-item label="现有库存：" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              {{ existingInventoryAmount }}
            </el-form-item>

          </div>
          <div >
            <el-form-item label="数量" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input-number v-model="dialogOutboundDetailNew.itemAmount"  ></el-input-number>
            </el-form-item>

          </div>

          <div  style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="备注" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-input v-model="dialogOutboundDetailNew.remark" autocomplete="off" style="width: 70%;"></el-input>
            </el-form-item>

          </div>



        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="handleOutboundDetailClose">取 消</el-button>
          <el-button type="primary" @click="handleOutboundDetailSave">保 存</el-button>
        </div>
      </el-dialog>
      <el-table
          :data="outboundDetailTableData"
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
            width="180">
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
            prop="outboundDetailPriceExcludingTax"
            label="金额"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.outboundDetailPriceExcludingTax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="outboundDetailPriceIncludingTax"
            label="价税合计"
            width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.outboundDetailPriceIncludingTax) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            width="120">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleOutboundDetailEdit(scope.row)" type="text" size="small"
                       :disabled="currentOutbound.checkOut || !!currentOutbound.accountingReversalOutboundNo">编辑</el-button>
            <el-button @click="handleOutboundDetailDelete(scope.row)" type="text" size="small"
                       :disabled="currentOutbound.checkOut || !!currentOutbound.accountingReversalOutboundNo">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="block">
        <el-pagination
            @current-change="handleOutboundDetailCurrentChange"
            :current-page="outboundDetailCurrentPage"
            :page-sizes="[outboundDetailPageSize]"
            :page-size="outboundDetailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="outboundDetailsCount">
        </el-pagination>
      </div>
    </div>


  </div>
</template>
<script>
import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "OutboundManagement",
  data() {
    return {
      formOutbound: {},
      formOutboundDetail: {},
      outboundTableData: [],
      currentOutbound: {},
      outboundDetailTableData: [],
      dialogFormOutboundVisible: false,
      dialogFormOutboundDetailVisible: false,
      supplierList: [],


      selectedItem: null,
      itemDetails: [],
      outboundDetailCurrentPage: 1,
      outboundDetailPageSize: 5,
      outboundDetailsCount: 0,

      outboundCurrentPage: 1,
      outboundPageSize: 5,
      outboundsCount: 0,


      dialogOutboundDetailOld:[],
      dialogOutboundDetailNew:[],
      existingInventoryAmount:0
    }

  },
  mounted() {
    this.queryOutboundList()
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
    handleOutboundStatementExport(row){
      service.post('/exportOutboundStatement',
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
    queryExistingInventoryAmount(){
      service.get('/queryExistingInventoryAmount', {
        params: {
          itemId: this.formOutboundDetail.itemId,
        }
      }).then(response => {
        console.log(response);
        this.existingInventoryAmount = response.data.data;
      }).catch(error => {
        console.error(error);
      });
    },
    isCurrentMonth(dateStr) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // Note: January is 0
      const date = new Date(dateStr);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    },
    handleOutboundAccountingReversal(row){
      MessageBox.confirm("请确认是否对入库单号为" + row.outboundNo + "的入库信息进行冲红？",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/outboundAccountingReversal', {
          params: {
            outboundNo: row.outboundNo
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryOutboundList();
        }).then(() => {
          this.currentOutbound = {};
          this.outboundDetailTableData = [];
          console.log(this.outboundTableData)
          // After queryItemInformation is finished
          if (this.outboundTableData.length === 0 && this.outboundCurrentPage > 1) {
            this.outboundCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryOutboundList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });

    },
    handleOutboundDelete(row) {
      MessageBox.confirm("请确认是否删除入库单号为" + row.outboundNo + "的入库信息？该出库单号下所有入库信息都将被删除！",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteOutboundByOutboundNo', {
          params: {
            outboundNo: row.outboundNo
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryOutboundList();
        }).then(() => {
          this.currentOutbound = {};
          this.outboundDetailTableData = [];
          console.log(this.outboundTableData)
          // After queryItemInformation is finished
          if (this.outboundTableData.length === 0 && this.outboundCurrentPage > 1) {
            this.outboundCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryOutboundList();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleOutboundSave() {

      console.log(this.formOutbound);
      service.post('/addOrUpdateOutbound', this.formOutbound
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormOutboundVisible = false;
            this.formOutbound = {}
            this.currentOutbound = {}
            this.outboundDetailTableData = []
            return this.queryOutboundList();

          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    handleOutboundClose() {
      this.formOutbound = {}
      this.dialogFormOutboundVisible = false;
    },
    handleOutboundEdit(row) {
      console.log(row);
      this.formOutbound = JSON.parse(JSON.stringify(row));
      this.dialogFormOutboundVisible = true;
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormOutboundVisible = true
    },

    handleOutboundCurrentChange(outboundCurrentPage) {
      this.outboundCurrentPage = outboundCurrentPage;
      this.queryOutboundList()
    },

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentOutbound = row
      console.log("Row clicked:", row);
      this.queryOutboundDetail()

      // Additional logic here
    },


    handleOutboundDetailDelete(row) {
      this.formOutboundDetail.itemId = row.itemId
      this.formOutboundDetail.outboundNo = this.currentOutbound.outboundNo
      MessageBox.confirm("请确认是否删除入库单号为" + this.formOutboundDetail.outboundNo +
          "编码为" + row.item.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteOutboundDetailByOutboundNoAndItemId', {
          params: {
            outboundNo: this.formOutboundDetail.outboundNo,
            itemId: this.formOutboundDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryOutboundDetail();
        }).then(() => {
          console.log(this.outboundDetailTableData)
          // After queryItemInformation is finished
          if (this.outboundDetailTableData.length === 0 && this.outboundDetailCurrentPage > 1) {
            this.outboundDetailCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryOutboundDetail();
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Deletion cancelled');
      });
    },
    handleOutboundDetailEdit(row) {

      console.log(row)
      this.openAddOutboundDetailDialog()
      let item = {}
      item.value = row.itemId
      console.log(item)
      this.selectedItem = row.item.code + " - " + row.item.name
      this.handleItemDetailSelection(item)


    },
    handleOutboundDetailSave() {
      console.log("this.selectedItem");
      console.log(this.selectedItem);
      const dialogOutboundDetail = [
        this.dialogOutboundDetailOld,
        this.dialogOutboundDetailNew
      ];
      console.log(this.dialogOutboundDetailOld)
      console.log(this.dialogOutboundDetailNew)


      // Call the addOrUpdateOutboundDetail endpoint with machineNumbers
      service.post('/addOrUpdateOutboundDetail',
          dialogOutboundDetail
      )
          .then(response => {
            console.log(response);
            if (response.data.code < 400) {
              this.queryOutboundDetail()
              this.handleOutboundDetailClose()
            }

          })
          .catch(error => {
            console.log(error);
          });

    },


    openAddOutboundDetailDialog() {
      this.selectedItem = ""
      this.formOutboundDetail.outboundNo = this.currentOutbound.outboundNo
      this.dialogFormOutboundDetailVisible = true
    },
    handleOutboundDetailCurrentChange(outboundDetailCurrentPage) {
      this.outboundDetailCurrentPage = outboundDetailCurrentPage;
      this.queryOutboundDetail()
    },

    handleOutboundDetailClose() {
      this.existingInventoryAmount=0
      this.dialogFormOutboundDetailVisible = false;
      this.selectedItem = ""
      this.formOutboundDetail = {}
      this.dialogOutboundDetailOld = {
        id: 0,
        outboundNo: this.formOutboundDetail.outboundNo,
        itemId: this.formOutboundDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
      this.dialogOutboundDetailNew = {
        id: 0,
        outboundNo: this.formOutboundDetail.outboundNo,
        itemId: this.formOutboundDetail.itemId,
        itemAmount: 0,
        remark: ""
      }
    },

    queryOutboundDetail() {

      // Create a Promise for each service.get call
      const fetchOutboundDetailData = service.get('/queryOutboundDetailList', {
        params: {
          outboundNo: this.currentOutbound.outboundNo,
          currentPage: this.outboundDetailCurrentPage,
          pageSize: this.outboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.outboundDetailTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchOutboundDetailsCount = service.get('/queryOutboundDetailListCount', {
        params: {
          outboundNo: this.currentOutbound.outboundNo,
          currentPage: this.outboundDetailCurrentPage,
          pageSize: this.outboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.outboundDetailsCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchOutboundDetailData, fetchOutboundDetailsCount]);
    },


    queryOutboundList() {
      console.log("queryOutboundList");

      // Create a Promise for each service.get call
      const fetchOutboundListData = service.get('/queryOutboundList', {
        params: {
          currentPage: this.outboundCurrentPage,
          pageSize: this.outboundPageSize,
        }
      }).then(response => {
        console.log(response);
        this.outboundTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchOutboundCount = service.get('/queryOutboundListCount', {
        params: {
          currentPage: this.outboundCurrentPage,
          pageSize: this.outboundPageSize,
        }
      }).then(response => {
        console.log(response);
        this.outboundsCount = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      // Return a Promise that resolves when both requests are completed
      return Promise.all([fetchOutboundListData, fetchOutboundCount]);
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
      this.formOutboundDetail.itemId = item.value

      service.get('/queryOutboundItemListByOutboundNoAndItemId', {
        params: {
          outboundNo: this.formOutboundDetail.outboundNo,
          itemId: this.formOutboundDetail.itemId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                if (response.data.data === null) {
                  this.existingInventoryAmount=0
                  this.dialogOutboundDetailOld = {
                    id: 0,
                    outboundNo: this.formOutboundDetail.outboundNo,
                    itemId: this.formOutboundDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                  this.dialogOutboundDetailNew = {
                    id: 0,
                    outboundNo: this.formOutboundDetail.outboundNo,
                    itemId: this.formOutboundDetail.itemId,
                    itemAmount: 0,
                    remark: ""
                  }
                } else {
                  //to deep copy
                  this.dialogOutboundDetailOld = JSON.parse(JSON.stringify(response.data.data));
                  this.dialogOutboundDetailNew = JSON.parse(JSON.stringify(response.data.data));
                  this.queryExistingInventoryAmount()
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