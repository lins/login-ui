# login-ui (Node.js)

一个“漂亮大气”的登录界面示例：Node.js + Express，零构建（Tailwind CDN）。

## 运行

```bash
cd login-ui
npm install
npm run dev
```

打开： http://127.0.0.1:3000/login

## 演示账号

默认：`admin / admin123`

可用环境变量覆盖：

```bash
DEMO_USER=lins DEMO_PASS=19881989 PORT=3000 npm run dev
```

## 下一步（可扩展）

- 接入 Session（cookie）或 JWT
- 接入数据库（用户表 + bcrypt）
- 加验证码/限流/2FA
- 前后端分离（React/Vite/Next.js）
