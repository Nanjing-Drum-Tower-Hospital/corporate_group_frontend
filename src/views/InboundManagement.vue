<template>
  <div class="container">
    <div class="half">
<!--      <span style="width: 100%">-->
<!--      <el-form :model="form" :inline="true" style="display: inline-block">-->

<!--          <el-form-item label="订单号">-->
<!--            <el-input v-model="formInbound.name"></el-input>-->
<!--          </el-form-item>-->
<!--      </el-form>-->
<!--      </span>-->
<!--      <span style="width: 100%;">-->
<!--              <el-form :model="formInbound" :inline="true" style="display: inline-block;">-->
<!--          <el-form-item label="到货时间">-->
<!--            <el-row :gutter="10">-->
<!--              <el-col :span="11">-->
<!--                <el-date-picker type="date" placeholder="选择日期" v-model="formInbound.date1"-->
<!--                                style="width: 100%;"></el-date-picker>-->
<!--              </el-col>-->
<!--              <el-col class="line" :span="2" style="">-</el-col>-->
<!--              <el-col :span="11">-->
<!--                <el-date-picker type="date" placeholder="选择日期" v-model="formInbound.date1"-->
<!--                                style="width: 100%;"></el-date-picker>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </el-form-item>-->
<!--      </el-form>-->
<!--      </span>-->
      <el-button type="primary" @click="queryInboundList">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>

      <el-dialog title="添加入库信息" :visible.sync="dialogFormInboundVisible" :before-close="handleInboundClose"
                 :close-on-click-modal="false">
        <el-form :model="formInbound">

<!--          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">-->
<!--            <el-form-item label="订单号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">-->
<!--              <el-input v-model="formInbound.orderNo" autocomplete="off" style="width: 70%;"></el-input>-->
<!--            </el-form-item>-->
<!--          </div>-->

<!--          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">-->
<!--            <el-form-item label="到货日期" style="flex: 1; margin-right: 10px;" :label-width="'100px'">-->
<!--              <el-date-picker type="date" placeholder="选择日期"-->
<!--                              value-format="yyyy-MM-dd"-->
<!--                              v-model="formInbound.arrivalDate"-->
<!--                              style="width: 70%;">-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
<!--          </div>-->


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
            width="120">
        </el-table-column>


        <el-table-column
            prop="inboundInfo.remark"
            label="备注"
            width="120">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleInboundEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">冲红</el-button>
            <el-button @click="handleInboundDelete(scope.row)" type="text" size="small">删除</el-button>
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
  订单号：{{ currentInbound.inboundInfo.orderNo }}
<!--  <el-form :model="formInboundDetail" :inline="true" style="display: inline-block">-->
<!--    <el-form-item label="货品名称">-->
<!--      <el-input v-model="formInboundDetail.name"></el-input>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
</span>
<!--        <el-button type="primary">-->
<!--          搜索-->
<!--        </el-button>-->

        <el-button @click="openAddInboundDetailDialog" type="primary">
          添加
        </el-button>
      </div>
      <div>

      </div>

      <el-dialog title="添加入库货品信息" :visible.sync="dialogFormInboundDetailVisible"
                 :before-close="handleInboundDetailClose" :close-on-click-modal="false">

          <span v-if="currentInbound && currentInbound.inboundInfo">
            订单号：{{ currentInbound.inboundInfo.orderNo }}

          </span>
        <el-form :model="formInboundDetail">


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
            <div v-for="(machineNo, index) in machineNumbers" :key="index"
                 style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <el-form-item :label="'机器编号 ' + (index + 1)" style="flex: 1; margin-right: 10px;"
                            :label-width="'100px'">
                <!-- Use a method to handle input updates -->
                <el-input :value="machineNo" @input="updateMachineNo($event, index)" autocomplete="off"
                          style="width: 70%;"></el-input>
              </el-form-item>
              <el-button type="text" @click="removeMachine(index)">删除</el-button>
            </div>
            <el-button @click="addMachine">添加入库机器编号</el-button>
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
            width="120">
        </el-table-column>
        <el-table-column
            prop="item.itemDetail.model"
            label="货品型号"
            width="120">
        </el-table-column>

        <el-table-column
            prop="inboundItem.machineNoCount"
            label="数量"
            width="120">
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleInboundDetailEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleInboundDetailDelete(scope.row)" type="text" size="small">删除</el-button>
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


      machineNumbers: [],
      selectedItem: null,
      itemDetails: [],
      inboundDetailCurrentPage: 1,
      inboundDetailPageSize: 5,
      inboundDetailsCount: 0,

      inboundCurrentPage: 1,
      inboundPageSize: 5,
      inboundsCount: 0,
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
    handleInboundDelete(row) {
      MessageBox.confirm("请确认是否删除订单号为" + row.inboundInfo.orderNo + "的入库信息？该订单号下所有入库信息都将被删除！",
          '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteInbound', {
          params: {
            orderNo: row.inboundInfo.orderNo
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


    handleInboundCurrentChange(inboundCurrentPage){
      this.inboundCurrentPage = inboundCurrentPage;
      this.queryInboundList()
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

      service.get('/queryInboundItemListByOrderNoAndItemId', {
        params: {
          orderNo: this.formInboundDetail.orderNo,
          itemId: this.formInboundDetail.itemId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                this.machineNumbers = [];
                if (response.data && response.data.data) {
                  response.data.data.forEach(item => {
                    if (item.machineNo) {
                      this.machineNumbers.push(item.machineNo);
                    }
                  });
                }
              })
          .catch(
              (error) => {
                console.log(error);
              });


    },
    addMachine() {
      this.machineNumbers.push(''); // Add an empty string to the machineNumbers array
    },
    updateMachineNo(value, index) {
      // Update the value at the specific index
      this.$set(this.machineNumbers, index, value);
    },
    removeMachine(index) {
      this.machineNumbers.splice(index, 1); // Remove the string at the specified index
    },

    handleInboundDetailDelete(row) {
      this.formInboundDetail.itemId = row.inboundItem.itemId
      this.formInboundDetail.orderNo = this.currentInbound.inboundInfo.orderNo
      MessageBox.confirm("请确认是否删除订单号为" + this.formInboundDetail.orderNo +
          "编码为" + row.item.itemDetail.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteInboundItemListByOrderNoAndItemId', {
          params: {
            orderNo: this.formInboundDetail.orderNo,
            itemId: this.formInboundDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryInboundDetailMachineNoCount();
        }).then(() => {
          console.log(this.inboundDetailTableData)
          // After queryItemInformation is finished
          if (this.inboundDetailTableData.length === 0 && this.inboundDetailCurrentPage > 1) {
            this.inboundDetailCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryInboundDetailMachineNoCount();
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
      this.selectedItem = ""
      console.log(this.selectedItem)
      this.selectedItem = row.item.itemDetail.code + " - " + row.item.itemDetail.name
      this.formInboundDetail.itemId = row.inboundItem.itemId
      console.log(row)
      this.formInboundDetail.orderNo = this.currentInbound.inboundInfo.orderNo
      service.get('/queryInboundItemListByOrderNoAndItemId', {
        params: {
          orderNo: this.formInboundDetail.orderNo,
          itemId: this.formInboundDetail.itemId,
        }
      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                this.machineNumbers = [];
                if (response.data && response.data.data) {
                  response.data.data.forEach(item => {
                    if (item.machineNo) {
                      this.machineNumbers.push(item.machineNo);
                    }
                  });
                }
              })
          .catch(
              (error) => {
                console.log(error);
              });
      this.dialogFormInboundDetailVisible = true


    },
    handleInboundDetailSave() {

      const params = new URLSearchParams({
        orderNo: this.formInboundDetail.orderNo,
        itemId: this.formInboundDetail.itemId
      });

      // Append each machine number individually
      this.machineNumbers.forEach(machineNumber => {
        params.append('machineNumbers', machineNumber);
      });

      // Call the addOrUpdateInboundDetail endpoint with machineNumbers
      service.get(`/addOrUpdateInboundDetail?${params.toString()}`)
          .then(response => {
            console.log(response);
            this.queryInboundDetailMachineNoCount()
            this.dialogFormInboundDetailVisible = false
            this.selectedItem = ""
            this.machineNumbers = []
            this.formInboundDetail = {}
          })
          .catch(error => {
            console.log(error);
          });

    },


    openAddInboundDetailDialog() {
      this.selectedItem = ""
      this.formInboundDetail.orderNo = this.currentInbound.inboundInfo.orderNo
      this.dialogFormInboundDetailVisible = true
    },
    handleInboundDetailCurrentChange(inboundDetailCurrentPage) {
      this.inboundDetailCurrentPage = inboundDetailCurrentPage;
      this.queryInboundDetailMachineNoCount()
    },
    handleInboundSave() {
      console.log(this.formInbound);
      service.post('/addOrUpdateInbound', this.formInbound
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormInboundVisible = false;
            this.formInbound = {}
            this.currentInbound= {}
            this.inboundDetailTableData = []
            return this.queryInboundList();

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
    handleInboundDetailClose() {
      this.dialogFormInboundDetailVisible = false;
      this.selectedItem = ""
      this.machineNumbers = []
      this.formInboundDetail = {}
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
    queryInboundDetailMachineNoCount() {
      console.log(this.currentInbound.inboundInfo.orderNo);

      // Create a Promise for each service.get call
      const fetchInboundDetailData = service.get('/queryInboundDetailMachineNoCount', {
        params: {
          orderNo: this.currentInbound.inboundInfo.orderNo,
          currentPage: this.inboundDetailCurrentPage,
          pageSize: this.inboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.inboundDetailTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchInboundDetailsCount = service.get('/countInboundDetailMachineNoCount', {
        params: {
          orderNo: this.currentInbound.inboundInfo.orderNo,
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

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentInbound = row
      console.log("Row clicked:", row);
      this.queryInboundDetailMachineNoCount()

      // Additional logic here
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
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
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