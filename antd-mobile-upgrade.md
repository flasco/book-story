# antd-mobile upgrade plan

| old         | new         |
| ----------- | ----------- |
| Drawer      | ---         |
| NavBar      | NavBar      |
| Icon        | Icon        |
| button      | button      |
| Popover     | Popover     |
| actionSheet | actionSheet |
| slider      | slider      |
| toast       | toast       |
| searchBar   | search      |
| Modal       | Dialog      |
| SwipeAction | SwipeAction |

整体回顾了一下用到的组件，除开 Drawer 没有，其他的组件均可以迁移（不过不知道具体的展示效果）。

action：

- 寻找 Drawer 的单包 or 自己写一个
- 别的能换的都换掉

# why

主要是为了后续的 vite 替换打基础，antd-mobile@v2 的代码过于老旧，没办法迁移。

# 进度

- [ ] NavBar | NavBar
- [ ] Icon | Icon
- [ ] button | button
- [ ] Popover | Popover
- [ ] actionSheet | actionSheet
- [ ] slider | slider
- [ ] toast | toast
- [ ] searchBar | search
- [ ] Modal | Dialog
- [ ] SwipeAction | SwipeAction
