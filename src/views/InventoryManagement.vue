<template>
  <div>
    <span style="width: 100%">
      <el-form :model="form"  :inline="true" style="display: inline-block">

          <el-form-item label="货品名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
      </el-form>
      </span>
    <el-button type="primary">
      搜索
    </el-button>

    <el-button type="primary">
      添加
    </el-button>
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
          prop="model"
          label="货品名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="name"
          label="货品单位"
          width="120">
      </el-table-column>

      <el-table-column
          prop="unit_name"
          label="厂家"
          width="120">
      </el-table-column>
      <el-table-column
          prop="selling_price"
          label=""
          width="120">
      </el-table-column>
      <el-table-column
          prop="manufacturer"
          label="备注"
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
export default {
  name: "inventoryManagement",
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },

    }
  },
}
</script>



<style scoped>

</style>