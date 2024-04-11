const WebSocketServer = require('websocket').server;
const http = require('http');
const readline = require('readline');
const { queryPath } = require('./service/MediaListService');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let wss;

exports.startServer = (app, pathCallback) => {
    const server = http.createServer(app);

    server.listen(8080, () => console.log('8080端口监听中'));

    wss = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: true
    });
    console.log(`等待连接`);
    
    wss.on('connect', ws => {
        console.log('建立连接');
        ws.on('message', message => {
            console.log('接收消息', message);
        })
    })

    wss.on('close', ws => console.log('客户端关闭连接'));

    controlList(path => pathCallback(path));
}

const controlList = (pathCallBack) => {
    console.log('请输入播单列表号: ');
    const getInput = () => {
        rl.question('请输入播单列表号: \n', input => {
            if (input.trim().toLowerCase === 'exit')    {
                rl.close();
                return;
            }
            const newPid = parseInt(input.trim());
            wss.connections.forEach(connection => {
                let path;
                queryPath(newPid, (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    path = res[0]?.path
                    // console.log('视频路径', path);
                    pathCallBack(path)
                    // console.log(res);
                    connection.sendUTF(JSON.stringify({ pid: newPid, message: `已设置路径：${path}` }));
                })
            });
            getInput();
        })
    }
    getInput();
}