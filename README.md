🎵 静态音乐 API
一个基于 Node.js 和前端技术的纯静态音乐 API 和播放器。它能自动处理你的本地 MP3 文件，提取元数据和专辑封面，生成一个可以通过 HTTP 请求访问的音乐库。

✨ 项目特色
🤖 自动化处理：一个 Node.js 脚本搞定所有 MP3 文件的元数据提取和封面保存。
🌐 纯静态部署：无需后端服务器，完美托管在 GitHub Pages 等静态网站服务上。
🧩 模块化设计：API 接口与前端播放器分离，方便你将 API 集成到任何项目中。
🌍 跨平台兼容：自动处理文件名中的特殊字符和中文，确保在任何系统上都能稳定运行。
📱 响应式界面：内置一个简洁美观的音乐播放器，支持桌面和移动设备。
🛠️ 技术栈
后端处理: Node.js, music-metadata
前端: HTML5, CSS3, Vanilla JavaScript
部署: GitHub Pages
📁 项目结构
my-music-api/
├── audio/                  # 存放你的 MP3 文件
├── data/                   # (由脚本生成) 存放歌曲元数据 JSON
│   ├── playlist.json       # 歌曲总索引
│   └── ...                 # 每首歌的详细 JSON 文件
├── img/                    # (由脚本生成) 存放专辑封面图片
├── generate.js             # Node.js 元数据提取脚本
├── index.html              # 网站入口 / API 演示页面
├── style.css               # 网站样式
├── script.js               # 网站核心逻辑
└── README.md               # 项目说明文件 (本文件)
🚀 快速开始 (搭建你自己的音乐库)
准备工作
确保你的电脑上已经安装了 Node.js 和 npm。
克隆项目
'''
git clone https://github.com/mlik-git/music_api.git
cd music_api
'''
安装依赖
'''
npm install
'''
准备音乐文件
将你所有的 MP3 文件放入 audio/ 文件夹中。
生成元数据
这是最关键的一步！运行以下脚本，它会自动完成所有工作：
'''
node generate.js
'''
脚本运行后，data/ 和 img/ 文件夹会自动生成，并填满处理好的文件。

本地预览
在项目根目录启动一个本地服务器来预览效果：
'''
# 如果你安装了 http-server
http-server -p 8000
'''
'''
# 或者使用 Python 3
python3 -m http.server 8000
'''
然后在浏览器中访问 http://localhost:8000。

部署到 GitHub Pages
将整个项目（除了 node_modules 文件夹）推送到你的 GitHub 仓库，并在仓库设置中启用 GitHub Pages 即可。
📖 API 使用指南
本项目的核心是生成的 JSON 文件，你可以通过标准的 HTTP GET 请求来获取数据。

基础 URL: https://mlik-git.github.io/music_api/

接口一：获取完整歌单
获取所有歌曲的基本信息列表。

端点: /data/playlist.json
方法: GET
示例请求:
'''
curl "https://mlik-git.github.io/music_api/data/playlist.json"
'''
返回数据: 一个 JSON 数组，包含每首歌的摘要信息。
接口二：获取单首歌曲详情
通过 playlist.json 中每首歌的 detailUrl 字段，可以获取该歌曲的完整元数据。

端点: /data/<歌曲文件名>.json
方法: GET
示例请求:
'''
curl "https://mlik-git.github.io/music_api/data/zhou-jie-lun-an-hao.json"
'''
返回数据: 一个 JSON 对象，包含该歌曲的所有信息。
接口三：获取资源文件
你可以直接通过 url 和 cover 字段提供的路径访问音频和图片文件。

音频示例:
https://mlik-git.github.io/music_api/audio/暗号 - 周杰伦.mp3
封面示例:
https://mlik-git.github.io/music_api/img/周杰伦 - 暗号.jpeg
🌐 在线演示
点击这里体验完整的在线音乐播放器：https://mlik-git.github.io/music_api/

🤝 贡献
欢迎提交 Issue 和 Pull Request 来改进这个项目！

📄 许可证
本项目采用 MIT 许可证。

🙏 致谢
感谢 music-metadata 库，它让元数据提取变得如此简单。