<template>
  <div class="container">
    <div class="half">

      <el-button type="primary" @click="queryOutboundList">
        搜索
      </el-button>

      <el-button type="primary" @click="openAddDialog">
        添加
      </el-button>

      <el-dialog title="添加出库信息" :visible.sync="dialogFormOutboundVisible" :before-close="handleOutboundClose"
                 :close-on-click-modal="false">
        <el-form :model="formOutbound">

<!--          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">-->
<!--            <el-form-item label="订单号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">-->
<!--              <el-input v-model="formOutbound.orderNo" autocomplete="off" style="width: 70%;"></el-input>-->
<!--            </el-form-item>-->
<!--          </div>-->

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <el-form-item label="出库日期" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
              <el-date-picker type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              v-model="formOutbound.outboundDate"
                              style="width: 70%;">
              </el-date-picker>
            </el-form-item>
          </div>
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
            prop="outboundInfo.orderNo"
            label="订单号"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="outboundInfo.outboundDate"
            label="出库时间"
            width="150">
        </el-table-column>

        <el-table-column
            prop="outboundInfo.remark"
            label="备注"
            width="120">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleOutboundEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">冲红</el-button>
            <el-button @click="handleOutboundDelete(scope.row)" type="text" size="small">删除</el-button>
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
      <div v-if="currentOutbound && currentOutbound.outboundInfo">
              <span  >
  订单号：{{ currentOutbound.outboundInfo.orderNo }}
                <!--  <el-form :model="formOutboundDetail" :inline="true" style="display: inline-block">-->
                <!--    <el-form-item label="货品名称">-->
                <!--      <el-input v-model="formOutboundDetail.name"></el-input>-->
                <!--    </el-form-item>-->
                <!--  </el-form>-->
</span>
        <!--        <el-button type="primary">-->
        <!--          搜索-->
        <!--        </el-button>-->

        <el-button @click="openAddOutboundDetailDialog" type="primary">
          添加
        </el-button>
      </div>
      <div>

      </div>

      <el-dialog title="添加出库货品信息" :visible.sync="dialogFormOutboundDetailVisible"
                 :before-close="handleOutboundDetailClose" :close-on-click-modal="false">

          <span v-if="currentOutbound && currentOutbound.outboundInfo">
            订单号：{{ currentOutbound.outboundInfo.orderNo }}

          </span>
        <el-form :model="formOutboundDetail">


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
          <el-button @click="handleOutboundDetailClose">取 消</el-button>
          <el-button type="primary" @click="handleOutboundDetailSave">保 存</el-button>
        </div>
      </el-dialog>
      <el-table
          :data="outboundDetailTableData"
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
            prop="outboundItem.machineNoCount"
            label="数量"
            width="120">
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleOutboundDetailEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleOutboundDetailDelete(scope.row)" type="text" size="small">删除</el-button>
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
  name: "outboundManagement",
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


      machineNumbers: [],
      selectedItem: null,
      itemDetails: [],
      outboundDetailCurrentPage: 1,
      outboundDetailPageSize: 5,
      outboundDetailsCount: 0,

      outboundCurrentPage: 1,
      outboundPageSize: 5,
      outboundsCount: 0,
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
    this.queryOutboundList()
  },
  methods: {
    handleOutboundDelete(row) {
      MessageBox.confirm("请确认是否删除订单号为" + row.outboundInfo.orderNo + "的入库信息？该订单号下所有入库信息都将被删除！",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteOutbound', {
          params: {
            orderNo: row.outboundInfo.orderNo
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryOutboundList();
        }).then(() => {
          this.currentOutbound = {};
          this.outboundDetailTableData= [];
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


    handleOutboundCurrentChange(outboundCurrentPage){
      this.outboundCurrentPage = outboundCurrentPage;
      this.queryOutboundList()
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

      service.get('/queryOutboundItemListByOrderNoAndItemId', {
        params: {
          orderNo: this.formOutboundDetail.orderNo,
          itemId: this.formOutboundDetail.itemId,
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

    handleOutboundDetailDelete(row) {
      this.formOutboundDetail.itemId = row.outboundItem.itemId
      this.formOutboundDetail.orderNo = this.currentOutbound.outboundInfo.orderNo
      MessageBox.confirm("请确认是否删除订单号为" + this.formOutboundDetail.orderNo +
          "编码为" + row.item.itemDetail.code + "的所有入库信息？", '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/deleteOutboundItemListByOrderNoAndItemId', {
          params: {
            orderNo: this.formOutboundDetail.orderNo,
            itemId: this.formOutboundDetail.itemId,
          }
        }).then(response => {
          console.log(response);
          // Call queryItemInformation and wait for it to finish
          return this.queryOutboundDetailMachineNoCount();
        }).then(() => {
          console.log(this.outboundDetailTableData)
          // After queryItemInformation is finished
          if (this.outboundDetailTableData.length === 0 && this.outboundDetailCurrentPage > 1) {
            this.outboundDetailCurrentPage--;
            // Call queryItemInformation again after updating currentPage
            return this.queryOutboundDetailMachineNoCount();
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
      this.selectedItem = ""
      console.log(this.selectedItem)
      this.selectedItem = row.item.itemDetail.code + " - " + row.item.itemDetail.name
      this.formOutboundDetail.itemId = row.outboundItem.itemId
      console.log(row)
      this.formOutboundDetail.orderNo = this.currentOutbound.outboundInfo.orderNo
      service.get('/queryOutboundItemListByOrderNoAndItemId', {
        params: {
          orderNo: this.formOutboundDetail.orderNo,
          itemId: this.formOutboundDetail.itemId,
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
      this.dialogFormOutboundDetailVisible = true


    },
    handleOutboundDetailSave() {

      const params = new URLSearchParams({
        orderNo: this.formOutboundDetail.orderNo,
        itemId: this.formOutboundDetail.itemId
      });

      // Append each machine number individually
      this.machineNumbers.forEach(machineNumber => {
        params.append('machineNumbers', machineNumber);
      });

      // Call the addOrUpdateOutboundDetail endpoint with machineNumbers
      service.get(`/addOrUpdateOutboundDetail?${params.toString()}`)
          .then(response => {
            console.log(response);
            this.queryOutboundDetailMachineNoCount()
            this.dialogFormOutboundDetailVisible = false
            this.selectedItem = ""
            this.machineNumbers = []
            this.formOutboundDetail = {}
          })
          .catch(error => {
            console.log(error);
          });

    },


    openAddOutboundDetailDialog() {
      this.selectedItem = ""
      this.formOutboundDetail.orderNo = this.currentOutbound.outboundInfo.orderNo
      this.dialogFormOutboundDetailVisible = true
    },
    handleOutboundDetailCurrentChange(outboundDetailCurrentPage) {
      this.outboundDetailCurrentPage = outboundDetailCurrentPage;
      this.queryOutboundDetailMachineNoCount()
    },
    handleOutboundSave() {
      console.log("this.formOutbound");
      console.log(this.formOutbound);
      console.log("this.formOutbound");
      service.post('/addOrUpdateOutbound', this.formOutbound
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormOutboundVisible = false;
            this.formOutbound = {}
            this.currentOutbound= {}
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
    handleOutboundDetailClose() {
      this.dialogFormOutboundDetailVisible = false;
      this.selectedItem = ""
      this.machineNumbers = []
      this.formOutboundDetail = {}
    },
    handleOutboundEdit(row) {
      console.log(row);
      this.formOutbound = JSON.parse(JSON.stringify(row.outboundInfo));
      this.dialogFormOutboundVisible = true;
    },
    openAddDialog() {
      //the dialog should contain all the fields above
      this.dialogFormOutboundVisible = true
    },
    queryOutboundDetailMachineNoCount() {
      console.log(this.currentOutbound.outboundInfo.orderNo);

      // Create a Promise for each service.get call
      const fetchOutboundDetailData = service.get('/queryOutboundDetailMachineNoCount', {
        params: {
          orderNo: this.currentOutbound.outboundInfo.orderNo,
          currentPage: this.outboundDetailCurrentPage,
          pageSize: this.outboundDetailPageSize,
        }
      }).then(response => {
        console.log(response);
        this.outboundDetailTableData = response.data.data;
      }).catch(error => {
        console.error(error);
      });

      const fetchOutboundDetailsCount = service.get('/countOutboundDetailMachineNoCount', {
        params: {
          orderNo: this.currentOutbound.outboundInfo.orderNo,
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

    // eslint-disable-next-line no-unused-vars
    handleRowClick(row, column, event) {
      this.currentOutbound = row
      console.log("Row clicked:", row);
      this.queryOutboundDetailMachineNoCount()

      // Additional logic here
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

      const fetchOutboundCount = service.get('/queryOutboundCount', {
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