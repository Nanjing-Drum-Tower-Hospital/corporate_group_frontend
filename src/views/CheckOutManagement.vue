<template>
  <div>
    <template>
      <el-select v-model="typeValue" placeholder="请选择" @change="handleTypeValueChange">
        <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </template>
    <el-button type="primary" @click="handleAddCheckOutOpen">
      新增结账
    </el-button>

    <el-table
        :data="checkOutData"
        border
        style="width: 100%"

    >
      <el-table-column
          prop="id"
          label="序号"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型"
          width="150"
      >
        <!-- Display "入库" for "inbound" and "出库" for others -->
        <template slot-scope="scope">
          {{ scope.row.type === 'inbound' ? '入库' : '出库' }}
        </template>
      </el-table-column>
      <el-table-column
          prop="valid"
          label="状态"
          width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.validity === "valid" ? '有效' : '失效' }}
        </template>
      </el-table-column>
      <el-table-column
          prop="checkOutBeginDate"
          label="结算开始时间"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="checkOutEndDate"
          label="结算结束时间"
          width="150">
      </el-table-column>
      <el-table-column
          prop="createDate"
          label="创建时间"
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
          <el-button @click="handleInboundCancel(scope.row)" type="text" size="small"
                     :disabled="scope.row.validity==='invalid'">取消结算</el-button>


        </template>
      </el-table-column>


    </el-table>

    <div class="block">
      <el-pagination
          @current-change="handleCheckOutCurrentChange"
          :current-page="checkOutCurrentPage"
          :page-sizes="[checkOutPageSize]"
          :page-size="checkOutPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="checkOutListCount">
      </el-pagination>
    </div>
    <el-dialog title="添加入出库结账" :visible.sync="dialogAddCheckOutVisible" :before-close="handleAddCheckOutClose"
               :close-on-click-modal="false">
      <div>
        <div>
          <template>
            <el-form >
              <el-form-item label="结算类型：">
                <el-select v-model="dialogTypeValue" placeholder="请选择" @change="handleDialogTypeValueChange">
                  <el-option
                      v-for="item in dialogTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>

        </div>
        <div>
          <template>
            <el-form >
              <el-form-item label="上次结算时间范围：">
                <span v-if="lastCheckOut && Object.keys(lastCheckOut).length > 0">
                  {{lastCheckOut.checkOutBeginDate}} - {{lastCheckOut.checkOutEndDate}}
                </span>
                <span v-else>
                  无
                </span>
              </el-form-item>
            </el-form>
          </template>
        </div>
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
          </template>
        </div>
        <div>
          <template>
            <el-form :inline="true" style="display: inline-block;">
              <el-form-item label="备注：">
                <el-input v-model="remark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>




      </div>



      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCheckOutClose">取 消</el-button>
        <el-button type="primary" @click="handleAddCheckOutSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script >



import service from "@/main";
import {MessageBox} from "element-ui";

export default {
  name: "CheckOutManagement",
  data() {
    return {
      typeOptions: [{
        value: '%',
        label: '全部'
      }, {
        value: 'inbound',
        label: '入库'
      }, {
        value: 'outbound',
        label: '出库'
      }, ],
      typeValue: '%',

      dialogTypeOptions: [ {
        value: 'inbound',
        label: '入库'
      }, {
        value: 'outbound',
        label: '出库'
      }, ],
      dialogTypeValue: '',

      dialogAddCheckOutVisible: false,
      checkOutData:[],
      checkOutCurrentPage: 1,
      checkOutPageSize: 10,
      checkOutListCount: 0,

      dateRange:{},
      remark:'',
      lastCheckOut: {},
    }
  },
  mounted() {
    this.queryCheckOutList();
  },

  methods: {
    handleInboundCancel(row){
      MessageBox.confirm("请确认是否取消序号" + row.id + "的结算记录？",
          '警告', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
        // User confirmed deletion
        console.log(row);
        service.get('/cancelCheckOut', {
          params: {
            type: row.type,
            id: row.id,
          }
        }).then(response => {
          console.log(response);
          this.queryCheckOutList()
          // Call queryItemInformation and wait for it to finish
        });
      }).catch(() => {
        // User cancelled the deletion
        console.log('Update cancelled');
      });
    },
    handleDialogTypeValueChange() {
      service.get('/queryLastValidCheckOut', {
        params: {
          type: this.dialogTypeValue,
        }
      }).then(response => {
        console.log(response);
        if(response.data.data!==null ){
          this.lastCheckOut=response.data.data;
        }else{
          this.lastCheckOut={};
        }

        // Call queryItemInformation and wait for it to finish
      });

    },

    handleTypeValueChange() {
      this.queryCheckOutList();
    },
    handleAddCheckOutSave() {
      service.get('/addCheckOut', {
        params: {
          type: this.dialogTypeValue,
          beginDate: this.dateRange.beginDate,
          endDate: this.dateRange.endDate,
          remark:this.remark,
        }
      }).then(response => {
        console.log(response);


        if(response.data.code<400){
          this.handleAddCheckOutClose()

          }

        // Call queryItemInformation and wait for it to finish
      });




    },
    handleAddCheckOutOpen() {
      if(this.typeValue!=='%'){
        this.dialogTypeValue=this.typeValue
      }
      this.handleDialogTypeValueChange()
      this.dialogAddCheckOutVisible = true;
    },
    handleAddCheckOutClose() {
      this.dialogAddCheckOutVisible = false
      this.dialogTypeValue =""
      this.dateRange={}
      this.remark=""
      this.lastCheckOut={}
      this.queryCheckOutList()
    },
    handleCheckOutCurrentChange(checkOutCurrentPage) {
      this.checkOutCurrentPage = checkOutCurrentPage;
      this.queryCheckOutList()
    },
    queryCheckOutList(){

      const fetchCheckOutListData =service.get('/queryCheckOutList', {
        params: {
          type: this.typeValue,
          currentPage: this.checkOutCurrentPage,
          pageSize: this.checkOutPageSize,
        }
      }).then(response => {
        console.log(response);
        this.checkOutData=response.data.data;
        // Call queryItemInformation and wait for it to finish
      });
      const fetchCheckOutListCount =service.get('/queryCheckOutListCount', {
        params: {
          type: this.typeValue,
          currentPage: this.checkOutCurrentPage,
          pageSize: this.checkOutPageSize,
        }
      }).then(response => {
        console.log(response);
        this.checkOutListCount=response.data.data;
        // Call queryItemInformation and wait for it to finish
      });
      return Promise.all([fetchCheckOutListData, fetchCheckOutListCount]);
    },
  }
  }
</script>



<style scoped>

</style>