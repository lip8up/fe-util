# fe-util

前端工具库

https://www.npmjs.com/package/fe-util

https://www.npmmirror.com/sync/fe-util

## 原则

- 不要将与业务逻辑有关的代码放在本库
- 若 lodash 等优秀开源库中已有相应函数，直接使用之，不要重复造轮子
- 所有工具方法，都要提供单元测试代码

## 单元测试

单元测试会在提交时自动执行，若不通过，则阻止提交，若要手动执行，运行：

```bash
pnpm test
```

## TODOs

- 解决 ajax.ts 自定义的问题
