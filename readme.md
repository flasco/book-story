# book-story

Create by react 16.12 and webpack 4.x

## TODO

- [ ] 排行页
- [ ] 用户权限
- [x] 书架
- [x] 阅读页
- [x] 目录页
- [x] 搜索页
- [x] 详情页
- [x] 主题方案
- [x] 应用存储方案设计（localstorage）

### 阅读页

- [x] 分页方案
- [x] 左右滑动 + 翻页
- [x] 处理数据交互
- [x] 记录阅读进度
- [x] 串联书架与阅读页
- [x] prefetch chapter [queue]
- [x] chapter cached
- [x] list && record cached
- [ ] menu 绘制 - 换源，夜间，设置（字体大小设置 【1 - 8 级拖动】）
  - [x] 进度
  - [x] 目录
  - [x] 夜间
  - [ ] 下载
  - [ ] 换源
  - [ ] 设置

### 书架页

- [x] 导航条
- [x] 书架样式
- [x] 书籍数据结构设计
- [x] 与阅读页串联
- [x] 下拉刷新
- [x] 书籍持久化
- [x] 点击排序
- [ ] 操作按钮
  - [x] 删除
  - [ ] 养肥
- [ ] 养肥区

## 数据结构说明

原来：book 有 plantFormId + source，通过`source[plantFormId]`的方式来判断当前的目录页

不足：有的小说网站是简介页一个 url，全的列表页在另一个 url，原先的写法已经无法满足

现在：新增了一个 catalogUrl，`source[plantFormId]`拿到的是简介页，用来获取小说的详细信息，比如封面，名称，作者，最新章节之类的，全列表从 catalogUrl 里去取

## 后续维护计划

- [ ] 排行 **TOP** 
- [ ] 换源（查询最新章节的时候接口也要带回 catalogUrl，方便选择的时候 fetch）  **TOP** 
- [ ] 下载
- [ ] 设置
- [ ] hox 优化翻页性能，书架代码结构
- [ ] 添加用户统计模块，增加 api 限制，防止有不认识的人白嫖，顺便加一个字数统计之类的
