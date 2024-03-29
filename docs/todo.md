## TODO

- [ ] 排行页
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
  - [x] 下载
  - [x] 换源
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

- [x] 换源 **TOP**
- [x] 模拟 app 跳页体验(keep-alive)
- [x] 添加书籍时加入对已有书源的展示
- [x] services worker 逻辑梳理
- [x] 下载
- [ ] 换源时展示全部书源结果，支持更新书源
- [ ] 排行
- [ ] 设置
- [ ] 添加用户统计模块，增加 api 限制
- [ ] 加个字数统计

## 技术改造

- [ ] use `zustand` instead of context，减少不必要的渲染
- [x] 使用 @react-spring/web 优化 reader，修复滑动闪烁的 bug
- [x] 调研 `@node-rs/deno-lint` / `dprint`, ~~instead of eslint & prettier~~
  - deno_lint 作为 eslint 的替代品，目前仅支持校验，不支持 autofix，属于半残次品，暂且搁置
  - dprint 作为 deno 的专属 fmt，不支持 js，且生态对前端体系不友好。
  - 上面两种目测感觉都不太支持前端体系，估计仅可在 node 层使用，拉了。
