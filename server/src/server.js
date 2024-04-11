const express = require('express');
const path = require('path');

const { startServer } = require('./webSocket');
const { queryMediaList, queryVideos, AddList } = require('./service/MediaListService');

const app = express();
const port = 8080;

let videoPath = '';

//#region express代码
// 设置 CORS 头
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许来自所有域的请求
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // 允许的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // 允许的请求头
    res.setHeader('Access-Control-Allow-Credentials', true); // 允许发送身份验证凭据
    next();
});

app.use(express.json())

// 将本地文件提供给客户端
app.get('/video/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = path.join(videoPath, fileName);
    res.sendFile(filePath); // 本地文件路径
});

app.get('/query_media_lists', (req, res) => {
    queryMediaList('media_lists', (err, resObj) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: '查询错误'
            })
            return;
        }
        res.json(resObj)
    })
});

app.get('/query_videos', (req, res) => {
    const pid = req.query.pid;
    queryVideos(pid, (err, resObj) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: '查询错误'
            });
            return;
        }
        res.json(resObj);
    })
})

app.post('/add_list', (req, res) => {
    console.log(req.body);
    AddList(req.body, (err, resObj) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: '添加失败',
            });
            return;
        }
        res.status(200).json({
            message: '添加成功'
        })
    })
})
//#endregion

startServer(app, path => videoPath = path);

// 启动服务器
app.listen(3001, function () {
    console.log('Server is running on port 3001');
});
