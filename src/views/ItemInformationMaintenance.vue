<template>
  <div>
    <span style="width: 100%">
      <el-form :model="searchInput"  :inline="true" style="display: inline-block">

          <el-form-item label="编码">
            <el-input v-model="searchInput.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <span style="width: 100%;">
              <el-form :model="searchInput"  :inline="true" style="display: inline-block;">
          <el-form-item label="创建时间">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchInput.beginDate" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchInput.beginDate" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>
      </el-form>
      </span>
    <el-button type="primary" @click="queryItemInformation">
搜索
    </el-button>


    <el-button type="primary" @click="openAddDialog">

      添加
    </el-button>

    <el-dialog title="添加货品信息" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="form">

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="编码" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.code" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="货品名称" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.name" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="型号" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.model" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="单位" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.unitName" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="售价" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.sellingPrice" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="制造商" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.manufacturerId" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="账单码" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.billItem" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="执行标准" style="flex: 1; " :label-width="'100px'">
            <el-input v-model="form.standards" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <el-form-item label="类型" style="flex: 1; margin-right: 10px;" :label-width="'100px'">
            <el-input v-model="form.type" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="批准文号" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.approvalNo" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">

          <el-form-item label="有效期" style="flex: 1;" :label-width="'100px'">
            <el-input v-model="form.expireDate" autocomplete="off" style="width: 70%;"></el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addItem">保 存</el-button>
      </div>
    </el-dialog>

    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="itemDetail.code"
          label="编码"
          width="150">
      </el-table-column>
      <el-table-column
          prop="itemDetail.name"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.model"
          label="型号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.unitName"
          label="单位"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.sellingPrice"
          label="售价"
          width="120">
      </el-table-column>
      <el-table-column
          prop="manufacturer.manufacturerName"
          label="制造商"
          width="120">
      </el-table-column>


      <el-table-column
          prop="itemDetail.billItem"
          label="账单码"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.standards"
          label="执行标准"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.approvalNo"
          label="批准文号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.type"
          label="类型"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.expireDate"
          label="有效期"
          width="120">
      </el-table-column>
      <el-table-column
          prop="itemDetail.createDate"
          label="创建时间"
          width="120">
      </el-table-column>


      <el-table-column
          label="操作"
>
        <template slot-scope="scope">
<!--          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleClickDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script >
import service from "@/main";

export default {
  name: "itemInformationMaintenance",
  data() {
    return {

      searchInput:{
        name:'',
        beginDate:'',
        endDate:''
      },
      tableData:{},
      dialogFormVisible: false,
      form:{}
    }
  },
  methods:{
    handleClose(){
      this.form={}
      this.dialogFormVisible = false;
    },
    handleClickEdit(row){
      console.log(row);
      this.form = JSON.parse(JSON.stringify(row.item));
      this.dialogFormVisible = true;
    },

    handleClickDelete(row){
      console.log(row);

      service.get('/deleteItem', {
        params:{
          id: row.id,
        }

      }).then(
          (response) => {
            console.log(response);
            this.queryItemInformation();
          })
          .catch(
              (error) => {
                console.log(error);
              });
    },



    addItem(){
      console.log(this.form);
      service.post('/addOrUpdateItem', this.form
      ).then(
          (response) => {
            console.log(response);
            this.dialogFormVisible = false;
            this.form={}
          })
          .catch(
              (error) => {
                console.log(error);
              });
    },
    openAddDialog(){
      //the dialog should contain all the fields above
      this.dialogFormVisible= true
    },
    queryItemInformation(){

      service.get('/queryItemList', {
        params:{
          code: this.searchInput.name,
        }

      })//axis后面的.get可以省略；
          .then(
              (response) => {
                console.log(response);
                this.tableData = response.data.data;



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

</style>