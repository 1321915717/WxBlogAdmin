<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <div style="text-align: left;">
        <el-button type="text" icon="el-icon-back" @click="goBack" style="padding-bottom: 0px;">返回</el-button>
      </div>
    </el-col>
    <el-col :span="24">
      <div>
        <div><h3 style="margin-top: 0px;margin-bottom: 0px">{{article.articleTitle}}</h3></div>
        <div style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center">
          <div style="display: inline; color: #20a0ff;margin-left: 50px;margin-right:20px;font-size: 12px;">
            {{article.articleTitle}}
          </div>
					
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">浏览 {{article.articleViewCount==null?0:article.articleViewCount}}</span>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;"> {{article.articleUpdateTime | formatDateTime}}</span>
          <el-tag type="success" v-for="(item,index) in tag" :key="index" size="small"
                  style="margin-left: 8px">{{item.tagName}}
          </el-tag>
          <span style="margin:0px 50px 0px 0px"></span>
        </div>
      </div>
    </el-col>
    <el-col>
      <div style="text-align: left" v-html="article.articleContent">
      </div>
    </el-col>
  </el-row>
</template>
<script>
	 import 'mavon-editor/dist/css/index.css'
  import {getRequest} from '../utils/api'
  export default{
    methods: {
      goBack(){
        this.$router.go(-1);
      }
    },
    mounted: function () {
      var aid = this.$route.query.id;
      this.activeName = this.$route.query.an
      var _this = this;
      this.loading = true;
      getRequest("/Article/intoArticle/" + 11).then(resp=> {
        if (resp.status == 200) {
          _this.article = resp.data.article;
        }
        _this.loading = false;
      }, resp=> {
        _this.loading = false;
        _this.$message({type: 'error', message: '页面加载失败!'});
      });
    },
    data(){
      return {
        article: {},
        loading: false,
        activeName: ''
      }
    }
  }
</script>
