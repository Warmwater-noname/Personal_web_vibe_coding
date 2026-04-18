# 学习笔记

## Linux 基础

### 常用命令

- `ls -la` — 列出所有文件
- `grep -r "pattern" .` — 递归搜索
- `chmod +x script.sh` — 添加执行权限

### 网络配置

```bash
ip addr show
ping -c 4 google.com
ss -tulnp
```

## 编程语言

### Python

Python 是一种简洁优雅的编程语言，适合快速原型开发。

```python
# 列表推导式
squares = [x**2 for x in range(10)]
print(squares)
```

### JavaScript

```javascript
const greeting = (name) => `Hello, ${name}!`
console.log(greeting('World'))
```

## 待学习

- [ ] Docker 容器化
- [ ] Kubernetes 集群管理
- [ ] CI/CD 流水线
- [x] Git 版本控制
- [x] Markdown 语法
