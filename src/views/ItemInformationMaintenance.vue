<template>
  <div>
    <span style="width: 100%">
      <el-form :model="form"  :inline="true" style="display: inline-block">

          <el-form-item label="货品名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <span style="width: 100%;">
              <el-form :model="form"  :inline="true" style="display: inline-block;">
          <el-form-item label="创建时间">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
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

    <el-dialog title="添加货品信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="编码" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货品名称" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="型号" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="售价" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="制造商" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="销售公司" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账单码" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行标准" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="批准文号" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="有效期" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="code"
          label="编码"
          width="150">
      </el-table-column>
      <el-table-column
          prop="name"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="model"
          label="型号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="unitName"
          label="单位"
          width="120">
      </el-table-column>
      <el-table-column
          prop="sellingPrice"
          label="售价"
          width="120">
      </el-table-column>
      <el-table-column
          prop="manufacturer"
          label="制造商"
          width="120">
      </el-table-column>
      <el-table-column
          prop="company"
          label="销售公司"
          width="120">
      </el-table-column>

      <el-table-column
          prop="billItem"
          label="账单码"
          width="120">
      </el-table-column>
      <el-table-column
          prop="standards"
          label="执行标准"
          width="120">
      </el-table-column>
      <el-table-column
          prop="approvalNo"
          label="批准文号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型"
          width="120">
      </el-table-column>
      <el-table-column
          prop="expireDate"
          label="有效期"
          width="120">
      </el-table-column>
      <el-table-column
          prop="createDate"
          label="创建时间"
          width="120">
      </el-table-column>


      <el-table-column
          label="操作"
>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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

      form:[],
      tableData:[],
      dialogFormVisible: false,
    }
  },
  methods:{
    openAddDialog(){
      //the dialog should contain all the fields above
      this.dialogFormVisible= true



    },
    queryItemInformation(){

      service.get('/itemList', {
        params:{
          code: '%',
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