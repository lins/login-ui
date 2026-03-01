// Vercel Serverless Function (Node.js)
// Plain Node handler (no Express) to avoid body-parsing issues in serverless.

const DEMO_USER = process.env.DEMO_USER || "admin";
const DEMO_PASS = process.env.DEMO_PASS || "admin123";

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/" && req.method === "GET") {
    res.statusCode = 302;
    res.setHeader("Location", "/login");
    res.end();
    return;
  }

  if (url.pathname === "/healthz") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (url.pathname === "/login" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderLoginPage({ error: "" }));
    return;
  }

  if (url.pathname === "/login" && req.method === "POST") {
    const raw = await readBody(req);
    const params = new URLSearchParams(raw);
    const username = params.get("username") || "";
    const password = params.get("password") || "";

    if (username !== DEMO_USER || password !== DEMO_PASS) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(renderLoginPage({ error: "用户名或密码错误" }));
      return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderWelcomePage({ username }));
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("not found");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        // basic safety
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function renderLoginPage({ error }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign in · Portal</title>
  <meta name="color-scheme" content="dark" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          boxShadow: {
            glow: '0 0 0 1px rgba(255,255,255,0.08), 0 25px 80px rgba(0,0,0,0.55)',
          }
        }
      }
    }
  </script>
  <style>
    .noise:before{content:"";position:absolute;inset:0;background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="240" height="240" filter="url(%23n)" opacity="0.18"/></svg>');mix-blend-mode:overlay;opacity:.22;pointer-events:none}
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500/30 selection:text-slate-100">
  <main class="relative noise min-h-screen overflow-hidden">
    <div class="absolute -top-24 -left-40 h-[520px] w-[520px] rounded-full bg-fuchsia-600/25 blur-3xl"></div>
    <div class="absolute top-40 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-500/20 blur-3xl"></div>
    <div class="absolute bottom-0 left-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"></div>

    <div class="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <div class="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <section class="p-8 md:p-10">
            <div class="flex items-center gap-3">
              <div class="h-11 w-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400"></div>
              <div>
                <div class="text-lg font-semibold tracking-wide">PORTAL</div>
                <div class="text-xs text-slate-300/80">Secure access, beautiful UX</div>
              </div>
            </div>

            <h1 class="mt-10 text-3xl font-semibold leading-tight tracking-tight">
              欢迎回来
              <span class="block text-slate-300/90">登录以继续使用控制台</span>
            </h1>

            <p class="mt-4 text-sm text-slate-300/80 leading-relaxed">
              这是一个适配 Vercel 的 Serverless 版本（纯 Node handler）。
            </p>

            <div class="mt-10 grid gap-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-widest text-slate-300/70">Tips</div>
                <div class="mt-2 text-sm text-slate-200/90">
                  默认演示账号：<span class="font-mono">admin</span> / <span class="font-mono">admin123</span>
                </div>
                <div class="mt-1 text-xs text-slate-300/70">可用环境变量 DEMO_USER / DEMO_PASS 覆盖。</div>
              </div>
            </div>
          </section>

          <section class="p-8 md:p-10 border-t md:border-t-0 md:border-l border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-slate-300/80">Sign in</div>
                <div class="text-xl font-semibold">账号登录</div>
              </div>
              <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300/80">v1</span>
            </div>

            ${error ? `
              <div class="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">${escapeHtml(error)}</div>
            ` : ""}

            <form class="mt-6 space-y-4" method="POST" action="/login">
              <div>
                <label class="text-xs text-slate-300/80" for="username">用户名</label>
                <input id="username" name="username" autocomplete="username" required
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                  placeholder="输入用户名" />
              </div>

              <div>
                <label class="text-xs text-slate-300/80" for="password">密码</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-fuchsia-400/50 focus:ring-4 focus:ring-fuchsia-400/10"
                  placeholder="输入密码" />
              </div>

              <button type="submit"
                class="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-cyan-400/20">
                <span class="relative z-10">登录</span>
                <span class="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-0"></span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
}

function renderWelcomePage({ username }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
  <div class="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
    <div class="text-sm text-slate-300/80">Signed in</div>
    <h1 class="mt-2 text-2xl font-semibold">欢迎，${escapeHtml(username)}</h1>
    <p class="mt-3 text-slate-300/80 text-sm">这是演示的登录成功页面。</p>
    <div class="mt-6 flex gap-3">
      <a href="/login" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">返回登录页</a>
      <a href="/healthz" class="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110">健康检查</a>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
