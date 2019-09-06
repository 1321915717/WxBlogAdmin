<template>
  <el-container v-loading="loading" class="post-article">
    <el-header class="header">
      <el-select v-model="categoryid" @change="changecategoryid" placeholder="请选择文章栏目" style="width: 150px;">
        <el-option
          v-for="item in categories"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId">
        </el-option>
      </el-select>
		
      <el-input v-model="article.articleTitle" placeholder="请输入标题..." style="width: 400px;margin-left: 10px"></el-input>
						<el-tag style="margin-left:20px ;">上传封面</el-tag>
						<el-input v-model="article.articleImg" placeholder="请直接把上传的封面地址粘贴过来,我实在是不想写上传按钮" style="width: 450px;margin-left: 10px"></el-input>
						
    </el-header>
    <el-main class="main">
				
       <!-- <div id="editor">
        <mavon-editor style="height: 100%;width: 100%;" ref=md @imgAdd="imgAdd"
                      @imgDel="imgDel" v-model="article.articleContent"></mavon-editor> 
      </div> -->
			 
		<!-- 	<div id="editor"></div> -->
				<vue-wangeditor id="editor" ref=vw  v-model="article.articleContent"> </vue-wangeditor>
			
			<div class="tag-box">
				<div class="title">
					标签选择
				</div>
				<el-checkbox-group v-model="checkList">
								<el-checkbox v-for="item in tags" :key="item.tagId"  :label="item.tagId"  >{{item.tagName}}</el-checkbox>						
				</el-checkbox-group>
				
				
			</div>
			
      <div style="display: flex;align-items: center;margin-top: 15px;justify-content: flex-end">
        <el-button @click="cancelEdit" v-if="from!=undefined">放弃修改</el-button>
        <template v-if="from==undefined || from=='draft'">
          <el-button @click="saveBlog(0)">保存到草稿箱</el-button>
          <el-button type="primary" @click="saveBlog(1)">发表文章</el-button> 
        </template>
        <template v-else="from==post">
          <el-button type="primary" @click="saveBlog(1)">保存修改</el-button>
        </template>
      </div>
    </el-main>
		
  </el-container>
</template>
<script>
  import {postRequest} from '../utils/api'
  import {putRequest} from '../utils/api'
  import {deleteRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  import {uploadFileRequest} from '../utils/api'
  // Local Registration
 // import {mavonEditor} from 'mavon-editor'
  // 可以通过 mavonEditor.markdownIt 获取解析器markdown-it对象
 // import 'mavon-editor/dist/css/index.css'
  import {isNotNullORBlank} from '../utils/utils'
//	import EditorBar from 'wangeditor'
	//import 'wangeditor/release/wangEditor.min.css'
	import vueWangeditor from 'vue-wangeditor'


  export default {
		
    mounted: function () {
				/* 	var editor = new EditorBar('#editor')
    editor.customConfig.onchange = (html) => {
      this.formArticle.content = html
    }
		editor.customConfig.zIndex = 100;
    editor.create() */
			
			
			
			/*-------------------------*/
      this.getCategories();
			this.gettags();
      var from = this.$route.query.from;
      this.from = from;
      var _this = this;
      if (from != null && from != '' && from != undefined) {
        var id = this.$route.query.id;
        this.id = id;
        this.loading = true;
        getRequest("/Article/intoArticle/" + id).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            _this.article = resp.data.article;
            var tags = resp.data.tag;
						_this.categoryid=resp.data.category.categoryId;
            _this.article.dynamicTags = [];
						_this.checkList=[];
						_this.article.tagsValue=[];
            for (var i = 0; i < tags.length; i++) {
              _this.article.dynamicTags.push(tags[i].tagName);
							_this.article.tagsValue.push(tags[i].tagId);
							_this.checkList.push(tags[i].tagId)
            }
          } else {
            _this.$message({type: 'error', message: '页面加载失败!'})
          }
        }, resp=> {
          _this.loading = false;
          _this.$message({type: 'error', message: '页面加载失败!'})
        })
      }
    },
    components: {
      
			 vueWangeditor
		
    },
		
    methods: {
			changecategoryid(){
				console.log(this.categoryid);
			},
      cancelEdit(){
        this.$router.go(-1)
      },
      saveBlog(state){
				console.log(this.$refs.vw.getHtml());
        if (!(isNotNullORBlank(this.article.articleTitle))) {
          this.$message({type: 'error', message: '数据不能为空!'});
          return;
        }
        var _this = this;
        _this.loading = true;
        postRequest("/Article/editArticle/", {
          id: this.id,
          title: this.article.articleTitle,
					htmlContent: this.$refs.vw.getHtml(),
          state: state,
          checkList: this.checkList,
					categoryid:this.categoryid,
					articleImg:this.article.articleImg
					
        }).then(resp=> {
          _this.loading = false;
          if (resp.status == 200 && resp.data.status == '1') {
            _this.article.id = resp.data.msg;
            _this.$message({type: 'success', message: state == 0 ? '保存成功!' : '发布成功!'});
//            if (_this.from != undefined) {
            window.bus.$emit('blogTableReload')
//            }
            if (state == 1) {
              _this.$router.replace({path: '/articleList'});
            }
          }
        }, resp=> {
          _this.loading = false;
          _this.$message({type: 'error', message: state == 0 ? '保存草稿失败!' : '博客发布失败!'});
        })
      },
      imgAdd(pos, $file){
        var _this = this;
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
				console.log($file);
        uploadFileRequest("/Article/uploadimg", formdata).then(resp=> {
          var json = resp.data;
           if (json.code == 'success') {
//            _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
            _this.$refs.md.$imglst2Url([[pos, json.url]])
          } else {
            _this.$message({type: json.status, message: json.msg});
          }
        });
      },
      imgDel(pos){

      },
      getCategories(){
        let _this = this;
        getRequest("/category/allCategory").then(resp=> {
          _this.categories = resp.data;
        });
      },
			gettags(){
				let _this=this;
				getRequest("/tag/allTags").then(resp=>{
					_this.tags=resp.data;
				});
			},
      handleClose(tag) {
        this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1);
      },
			addtags(){
				
				let _this=this;
				console.log(this.tagName);
				 _this.article.dynamicTags.push(this.tagName);
			
				
			},
      showInput() {
        this.tagInputVisible = true;
        this.$nextTick(_ => {
         // this.$refs.saveTagInput.$refs.input.focus();
				
        });
      },
      handleInputConfirm() {
        let tagValue = this.tagName;
        if (tagName) {
          this.article.dynamicTags.push(tagName);
        }
        this.tagInputVisible = false;
        this.tagName = '';
      },
			/*点击上传图片封面的函数*/
		
    },
    data() {
      return {
				 fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
				 checkList: [],
        categories: [],
				tags:[],
				id:-1,
				categoryid:'',
				tagid:'',
				tagName:'',
        tagInputVisible: false,
        tagValue: '',
        loading: false,
        from: '',
        article: {
          articleId: -1,
          dynamicTags: [],
					tagsValue:[],
          articleTitle: '',
					articleImg:''
         
        }
      }
    }
  }
</script>
<style>

	.tag-box{
		margin-top: 20px;
		font-size: 20px;
		font-weight: bold;	
		
	}

	


  .post-article > .header {
    background-color: #ececec;
    margin-top: 10px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .post-article > .main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    
    padding-top: 0px;
  }

  .post-article > .header > .el-tag + .el-tag {
    margin-left: 10px;
  }

  .post-article > .header > .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .post-article > .header > .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .post-article {
  }
</style>
