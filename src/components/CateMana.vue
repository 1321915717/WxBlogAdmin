<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入栏目名称"
        v-model="addcateName" style="width: 200px;">
      </el-input>
			<el-input
			  placeholder="请输入描述"
			  v-model="addcatemiaosu" style="width: 200px; margin-left:5px ;">
			</el-input>
      <el-button type="primary" size="medium" style="margin-left: 10px" @click="addNewCate">新增栏目</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="categories"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"
          width="55" align="left">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="categoryId"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="分类名称"
          prop="categoryName"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          prop="categoryDescription"
          label="描述" align="left">
         
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
							@click="turnupeditbox(scope.$index, scope.row)" >编辑 
              
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" :disabled="this.selItems.length==0" style="margin-top: 10px;width: 100px;"
                 @click="deleteAll" v-if="this.categories.length>0">批量删除
      </el-button>
			
							<el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total,sizes,  prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
    </el-main>
		

	<div class="loginbox" v-show="this.isshow">
		 <form >
		 
		    <input type="text" required placeholder="请输入名称" v-model="cateName">
		   
		    <br>
		    <input type="text" required placeholder="请输出描述" v-model="catemiaosu">
		    <br>
		    
				 <el-button type="success" @click="editinfo()">确认</el-button>
				<el-button type="info" @click="closeeditbox()">取消</el-button>
		</form>
	
	</div>
  </el-container>
</template>
<script>
  import {postRequest} from '../utils/api'
  import {putRequest} from '../utils/api'
  import {deleteRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  export default{
    methods: {
			
			refreshs(val){
				 let _this = this;
								_this.loading = true;
								postRequest("/category/allCategorys", {pageNum: this.pageNum, pageSize: this.pageSize}).then(resp=> {
								 _this.categories = resp.data.list;
								 _this.loading = false;
								 _this.totalCount=resp.data.total;
								 console.log("刷新")
								
								}, resp=> {
								  if (resp.response.status == 403) {
								    _this.$message({
								      type: 'error',
								      message: "加载失败"
								    });
								  }
								  _this.loading = false;
								});
									
			},
			//操作每页显示几条
			handleSizeChange(val) {
				 let _this = this;
                 _this.pageSize=val;
							
															_this.loading = true;
															postRequest("/category/allCategorys", {pageNum: _this.pageNum, pageSize: _this.pageSize}).then(resp=> {
															 _this.categories = resp.data.list;
															 _this.loading = false;
															 _this.totalCount=resp.data.total;
															 console.log("刷新")
															
															}, resp=> {
															  if (resp.response.status == 403) {
															    _this.$message({
															      type: 'error',
															      message: "加载失败"
															    });
															  }
															  _this.loading = false;
															});
																
								
            },
			handleCurrentChange(val) {
							 
							  let _this = this;
                _this.pageNum = val;
								
          _this.loading = true;
          postRequest("/category/allCategorys", {pageNum: _this.pageNum, pageSize: _this.pageSize}).then(resp=> {
           _this.categories = resp.data.list;
           _this.loading = false;
           _this.totalCount=resp.data.total;
           console.log("刷新")
          
          }, resp=> {
            if (resp.response.status == 403) {
              _this.$message({
                type: 'error',
                message: "加载失败"
              });
            }
            _this.loading = false;
          });
          	
            },
			
			editinfo(){
				console.log(this.pageNum);
						let _this = this;
								_this.loading = true;
								postRequest("/category/editCategory", {id: this.categoryid, categoryName: this.cateName,categoryDescription:this.catemiaosu}).then(resp=> {
								  var json = resp.data;
								  _this.$message({
								    type: json.status,
								    message: json.msg
								  });
								  _this.refresh();
								}, resp=> {
								  if (resp.response.status == 403) {
								    _this.$message({
								      type: 'error',
								      message: resp.response.data
								    });
								  }
								  _this.loading = false;
								});
									this.isshow=false;
			},
			turnupeditbox(index,row){
				this.cateName=row.categoryName;
				this.catemiaosu=row.categoryDescription;
				this.isshow=true;
				this.categoryid=row.categoryId;
				
				
			},
		closeeditbox(){
			this.cateName="";
			this.catemiaosu="";
			this.categoryid="";
			this.isshow=false;
		},
      addNewCate(){
        this.loading = true;
        let _this = this;
        postRequest('/category/addCategory', {addcateName: this.addcateName,addcatemiaosu:this.addcatemiaosu}).then(resp=> {
          if (resp.status == 200) {
            var json = resp.data;
            _this.$message({type: json.status, message: json.msg});
            _this.cateName = '';
            _this.refresh();
          }
          _this.loading = false;
        }, resp=> {
          if (resp.response.status == 403) {
            _this.$message({
              type: 'error',
              message: resp.response.data
            });
          }
          _this.loading = false;
        });
				
				this.addcateName="";
				this.addcatemiaosu="";
      },
      deleteAll(){
        var _this = this;
        this.$confirm('确认删除这 ' + this.selItems.length + ' 条数据?', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=> {
          var selItems = _this.selItems;
          var ids = '';
					console.log(selItems)
          for (var i = 0; i < selItems.length; i++) {
            ids += selItems[i].categoryId + ",";
          }
          _this.deleteCate(ids.substring(0, ids.length - 1));
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },
      handleEdit(index, row){
        var _this = this;
        this.$prompt('请输入新名称', '编辑', {
          confirmButtonText: '确定',
          inputValue: row.categoryName,
          cancelButtonText: '取消'
        }
				).then(({value}) => {
          //value就是输入值
						   if (value == null || value.length == 0) {
						  _this.$message({
						    type: 'info',
						    message: '数据不能为空!'
						  });
						} else {
						
									
									_this.loading = true;
									postRequest("/category/editCategory", {id: row.categoryId, categoryName: value}).then(resp=> {
									  var json = resp.data;
									  _this.$message({
									    type: json.status,
									    message: json.msg
									  });
									  _this.refresh();
									}, resp=> {
									  if (resp.response.status == 403) {
									    _this.$message({
									      type: 'error',
									      message: resp.response.data
									    });
									  }
									  _this.loading = false;
									});
															
						}
			
        });
			
      },
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.categoryName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(row.categoryId);
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      deleteCate(ids){
        var _this = this;
        this.loading = true;
        //删除
        postRequest("/category/deleteCategory/" + ids).then(resp=> {
          var json = resp.data;
          _this.$message({
            type: json.status,
            message: json.msg
          });
          _this.refresh();
        }, resp=> {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({
              type: 'error',
              message: resp.response.data
            });
          } else if (resp.response.status == 500) {
            _this.$message({
              type: 'error',
              message: '该栏目下尚有文章，删除失败!'
            });
          }
        })
      },
      refresh(){
				
        let _this = this;
        getRequest("/category/allCategorys", {pageNum: this.pageNum, pageSize: this.pageSize}).then(resp=> {
					console.log(resp.data);
          _this.categories = resp.data.list;
          _this.loading = false;
					_this.totalCount=resp.data.total;
					
        }, resp=> {
          if (resp.response.status == 403) {
					
            _this.$message({
              type: 'error',
              message: resp.response.data,
						
            });
							
          }
          _this.loading = false;
        });
      }
    },
		
    mounted: function () {
      this.loading = true;
      this.refreshs();
    },
    data(){
      return {
        cateName: '',
				catemiaosu:'',
				isshow:false,  //弹出框的显示隐藏
				categoryid:'',
				addcateName:'',
				addcatemiaosu:'',
        selItems: [],
        categories: [],
        loading: false,
				pageNum:1,
				pageSize:5,
				totalCount:100
				
      }
    }
  }
</script>
<style scoped>
.loginbox{
	position: fixed;
	left: 0;
	right: 0;
	
	width: 300px;
	background: white;
	margin: 0 auto;
	margin-top:10% ;
	padding: 30px;
	font-size: 14px;
	color: #a7b1bd;
	border: 1px solid #13CE66;
	box-shadow: 10px 10px 5px #888888;
	
}	


.loginbox p {
    text-align: center;
}
input {
    height: 30px;
    margin-bottom: 8px;
    margin-top: 4px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid rgb(238, 239, 241);
    text-indent: 1em;
}
.logo {
    background: rgb(32, 167, 82);
    color: white;
    height: 35px;
}

	
  .cate_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cate_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>
