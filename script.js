document.addEventListener('DOMContentLoaded', () => {
    const songListEl = document.getElementById('song-list');
    const jsonOutput = document.getElementById('json-output');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerCover = document.getElementById('player-cover');
    const audioPlayer = document.getElementById('audio-player');

    let allSongs = []; // 存储所有歌曲数据

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const requestedId = parseInt(urlParams.get('id'));

    // 加载播放列表
    async function loadPlaylist() {
        try {
            const response = await fetch('data/playlist.json');
            if (!response.ok) throw new Error('无法加载播放列表');
            allSongs = await response.json();
            renderSongList();
            handleInitialRequest();
        } catch (error) {
            console.error(error);
            jsonOutput.textContent = `错误: ${error.message}`;
        }
    }

    // 渲染歌曲列表到页面
    function renderSongList() {
        songListEl.innerHTML = '';
        allSongs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.dataset.id = song.id;
            li.addEventListener('click', () => selectSong(song.id));
            songListEl.appendChild(li);
        });
    }

    // 根据ID选择歌曲
    async function selectSong(id) {
        const song = allSongs.find(s => s.id === id);
        if (!song) {
            displayApiResponse({ error: "歌曲ID未找到" });
            updatePlayer(null);
            return;
        }

        // 高亮列表中的当前歌曲
        document.querySelectorAll('#song-list li').forEach(li => li.classList.remove('active'));
        document.querySelector(`#song-list li[data-id="${id}"]`)?.classList.add('active');

        // 获取详细信息
        try {
            const response = await fetch(song.detailUrl);
            const songDetails = await response.json();
            displayApiResponse(songDetails);
            updatePlayer(songDetails);
            // 更新URL，不刷新页面
            history.pushState(null, '', `?id=${id}`);
        } catch (error) {
            console.error('无法获取歌曲详情:', error);
            displayApiResponse({ error: "无法获取歌曲详情" });
        }
    }

    // 显示API响应
    function displayApiResponse(data) {
        jsonOutput.textContent = JSON.stringify(data, null, 2);
    }

    // 更新播放器
    function updatePlayer(music) {
        if (music) {
            playerTitle.textContent = music.title;
            playerArtist.textContent = music.artist;
            playerCover.src = music.cover || 'https://via.placeholder.com/80x80.png?text=No+Cover';
            audioPlayer.src = music.url;
            audioPlayer.load();
        } else {
            playerTitle.textContent = '未找到歌曲';
            playerArtist.textContent = '';
            playerCover.src = 'https://via.placeholder.com/80x80.png?text=Error';
            audioPlayer.src = '';
        }
    }

    // 处理页面初始加载时的请求
    function handleInitialRequest() {
        if (requestedId) {
            selectSong(requestedId);
        } else if (allSongs.length > 0) {
            // 如果没有ID，默认显示第一首歌
            selectSong(allSongs[0].id);
        }
    }

    // 启动应用
    loadPlaylist();
});
