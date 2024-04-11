import { QueryVideos } from "./Query";

let socket;

export const initWebSocket = () => {
    socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
        console.log('建立与ws://localhost:8080的连接');
    }
    socket.onclose = () => {
        console.log('失去连接');
    }
    
}

export const setWebSocketMessageHandler = (setPid, setVideos) => {
    socket.onmessage = e => {
        console.log(`发来消息：${e.data}`);
        setPid(e.data);
        QueryVideos(JSON.parse(e.data).pid).then(res => {
            setVideos(res);
        }).catch(err => {
            console.error(err);
        })
    }
}

export const sendWebSocketMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
    else {
        console.log('服务器没打开');
    }
}