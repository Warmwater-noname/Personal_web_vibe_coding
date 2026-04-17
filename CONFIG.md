# 个人网站配置文档

本文档说明如何自定义网站的头像、个性签名、相册、音乐和笔记等内容。  
所有资源文件均放在 `public/` 目录下，**无需修改代码**即可完成大部分个性化配置。

---

## 目录结构

```
public/
├── profile/          # 头像 & 个性签名
│   ├── 头像.png      # 头像图片
│   └── 个性签名.txt   # 个性签名文本
├── album/            # 相册照片
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
├── music/            # 背景音乐
│   ├── Close To You.mp3
│   └── ...
└── notes/            # Markdown 笔记
    ├── welcome.md
    └── study.md
```

---

## 1. 修改头像

**文件路径：** `public/profile/头像.png`

将你的头像图片命名为 `头像.png`，替换该文件即可。

- **推荐格式：** PNG / JPG / WebP
- **推荐尺寸：** 200×200 像素以上的正方形图片（会自动裁剪为圆形）
- **注意：** 文件名必须是 `头像.png`，如果想改用其他文件名，需要同时修改以下两个文件中的路径：
  - `src/components/AvatarCard.tsx` → 第 29 行 `src="/profile/头像.png"`
  - `src/components/NotesCard.tsx` → 第 93 行 `src="/profile/头像.png"`

---

## 2. 修改个性签名

**文件路径：** `public/profile/个性签名.txt`

打开该文件，写入你想显示的签名文字，保存即可。

- **示例内容：**
  ```
  I'm Youyi, Nice to meet you!
  ```
- 签名中包含 **Youyi** 这个词时，会自动高亮为品牌色（#35bfab）
- 如果该文件不存在或加载失败，会显示默认签名：`I'm Youyi, Nice to meet you!`
- 如果想修改默认签名或高亮关键词，编辑 `src/components/AvatarCard.tsx`：
  - 第 4 行：默认签名文字
  - 第 46 行：高亮匹配的正则 `/(\bYouyi\b)/i`

---

## 3. 修改侧边栏昵称

**文件路径：** `src/components/NotesCard.tsx`

在第 86 行找到昵称文字，直接修改：

```tsx
<span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>lvy-neko</span>
```

将 `Youyi` 替换为你的昵称。

---

## 4. 修改相册照片

**文件夹：** `public/album/`

将照片放入该文件夹，然后编辑 `src/components/AlbumCard.tsx` 顶部的数组：

```tsx
const ALBUM_IMAGES = [
  '/album/photo1.jpg',
  '/album/photo2.jpg',
  '/album/photo3.jpg',
  // 添加更多...
]
```

- **推荐格式：** JPG / PNG / WebP
- 首页最多展示 **5** 张（散落拍立得风格），点击可查看大图
- 如果没有图片，会显示"暂无照片"提示

---

## 5. 修改音乐列表

**文件夹：** `public/music/`

将 `.mp3` 文件放入该文件夹，然后编辑 `src/components/MusicPlayer.tsx` 顶部的数组：

```tsx
const MUSIC_FILES: Track[] = [
  { name: 'Close To You', src: '/music/Close To You.mp3' },
  { name: '示例音乐', src: '/music/sample.mp3' },
  // 添加更多...
]
```

- `name`：显示在播放器上的歌曲名
- `src`：音乐文件在 `public/music/` 中的路径
- 如果列表为空，会显示"暂无音乐"提示

---

## 6. 修改笔记

**文件夹：** `public/notes/`

将 `.md`（Markdown）文件放入该文件夹，然后编辑 `src/components/NotesCard.tsx` 顶部的数组：

```tsx
const NOTE_FILES: NoteFile[] = [
  { name: '欢迎笔记', path: '/notes/welcome.md', date: '2026/4/18', desc: '个人网站使用指南' },
  { name: '学习笔记', path: '/notes/study.md', date: '2026/4/1', desc: 'Linux基础学习记录' },
  // 添加更多...
]
```

- `name`：侧边栏显示的笔记标题
- `path`：Markdown 文件路径
- `date`（可选）：显示在阅读页右上角的日期
- `desc`（可选）：笔记描述（当前布局中未展示，留作扩展用）
- 支持完整 Markdown 语法：标题、列表、代码块、表格、引用、图片等

---

## 7. 修改社交链接

**文件路径：** `src/App.tsx`

在第 31-43 行找到社交链接区域，修改 `href` 属性：

```tsx
<a href="https://github.com/你的用户名" ...>Github</a>
<a href="https://space.bilibili.com/你的UID" ...>Bilibili</a>
<a href="mailto:你的邮箱@example.com" ...>邮件图标</a>
```

---

## 8. 修改主题颜色

**文件路径：** `src/index.css`

在文件顶部的 `:root` 中修改 CSS 变量：

```css
:root {
  --color-brand: #35bfab;      /* 品牌色（高亮、按钮） */
  --color-primary: #334f52;    /* 主文字色 */
  --color-secondary: #7b888e;  /* 次要文字色 */
  --color-bg: #eeeeee;         /* 页面背景色 */
  --color-card: rgba(255, 255, 255, 0.4);  /* 卡片背景 */
}
```

---

## 快速上手

1. 把头像放到 `public/profile/头像.png`
2. 编辑 `public/profile/个性签名.txt` 写入签名
3. 把照片放到 `public/album/` 并更新 `AlbumCard.tsx` 中的数组
4. 把音乐放到 `public/music/` 并更新 `MusicPlayer.tsx` 中的数组
5. 运行 `npm run dev` 预览效果
