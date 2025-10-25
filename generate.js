const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

// --- 配置 ---
const AUDIO_DIR = path.join(__dirname, 'audio');
const DATA_DIR = path.join(__dirname, 'data');
const IMG_DIR = path.join(__dirname, 'img');
// -------------

// 确保输出文件夹存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

// 清理文件名，移除不合法字符
function sanitizeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

async function processFiles() {
    try {
        const files = fs.readdirSync(AUDIO_DIR).filter(file => path.extname(file).toLowerCase() === '.mp3');
        if (files.length === 0) {
            console.log('在 audio/ 文件夹中没有找到MP3文件。');
            return;
        }

        const playlist = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(AUDIO_DIR, file);
            console.log(`正在处理: ${file}...`);

            const metadata = await mm.parseFile(filePath);

            // 提取信息，如果元数据中没有，则使用文件名
            const title = metadata.common.title || path.basename(file, path.extname(file));
            const artist = metadata.common.artist || '未知艺术家';
            const album = metadata.common.album || '未知专辑';

            // 创建一个基于“歌手 - 歌曲名”的唯一标识符
            const uniqueIdentifier = `${artist} - ${title}`;
            const cleanBaseName = sanitizeFilename(uniqueIdentifier);

            const jsonFileName = `${cleanBaseName}.json`;
            const jsonFilePath = path.join(DATA_DIR, jsonFileName);

            // 提取封面
            let coverPath = '';
            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0];
                const coverExtension = picture.format.split('/')[1];
                const coverFileName = `${cleanBaseName}.${coverExtension}`;
                
                // 【核心修改】使用 path.posix.join 生成Web标准路径
                coverPath = path.posix.join('img', coverFileName);
                const coverFilePath = path.join(IMG_DIR, coverFileName);
                
                fs.writeFileSync(coverFilePath, picture.data);
                console.log(`  -> 封面已保存: ${coverFilePath}`);
            }

            // 创建歌曲信息对象
            const songInfo = {
                id: i + 1,
                title: title,
                artist: artist,
                album: album,
                year: metadata.common.year || '',
                // 【核心修改】使用 path.posix.join 生成Web标准路径
                url: path.posix.join('audio', file),
                cover: coverPath,
                // 【核心修改】使用 path.posix.join 生成Web标准路径
                detailUrl: path.posix.join('data', jsonFileName)
            };

            // 写入单个歌曲的JSON文件
            fs.writeFileSync(jsonFilePath, JSON.stringify(songInfo, null, 2), 'utf8');
            console.log(`  -> 元数据已保存: ${jsonFilePath}`);

            // 添加到播放列表
            playlist.push(songInfo);
        }

        // 生成总的播放列表文件
        const playlistPath = path.join(DATA_DIR, 'playlist.json');
        fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2), 'utf8');
        console.log(`\n🎉 所有文件处理完成！播放列表已生成: ${playlistPath}`);

    } catch (error) {
        console.error('处理文件时发生错误:', error);
    }
}

processFiles();
