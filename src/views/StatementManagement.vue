<template>
  <div>
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
    <div style="padding-top: 50px">
      <el-button type="primary" >入库汇总表</el-button>
    </div>
    <div style="padding-top: 50px">
      <el-button type="primary" >出库汇总表</el-button>
    </div>
    <div style="padding-top: 50px">
      <el-button type="primary" @click="inventoryManagementStatement">收发存汇总表</el-button>
    </div>
  </div>
</template>

<script>



import service from "@/main";

export default {
  name: "StatementManagement",
  data() {
    return {
      dateRange: {}
    }
  },
  mounted() {

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
    inventoryManagementStatement(){
      service.get('/inventoryManagementStatement', {
        params: {
          beginDate: this.dateRange.beginDate,
          endDate: this.dateRange.endDate,
        }
      }).then(response => {
        if(response.data.code<400){
          const fileData = response.data.data; // Assuming this is the structure based on your backend
          const fileName = fileData.fileName; // Access the fileName
          const fileContent = fileData.fileContent; // Access the Base64 encoded content
          console.log("File Name:", fileName);
          console.log("File Content (Base64):", fileContent);
          // If you want to download the file on the client side
          this.downloadFile(fileName, fileContent);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>

</style>