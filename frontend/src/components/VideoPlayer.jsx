import { useState, useRef, useEffect } from 'react'
import './VideoPlayer.css'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { QueryVideos } from '../services/Query'
import { initWebSocket, sendWebSocketMessage, setWebSocketMessageHandler } from '../services/WebSocketService'

const serverFileUrl = 'http://localhost:3001/video/'

const VideoPlayer = () => {
    const [videos, setVideos] = useState([
        []
    ]);
    const [videoInfo, setVideoInfo] = useState({
        title: null,
        aid: null,
        author: null
    });
    const [playing, setPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [pid, setPid] = useState(1);
    const playerRef = useRef(null);

    useEffect(() => {
        initWebSocket();
        setWebSocketMessageHandler(setPid, setVideos);
    }, [])

    useEffect(() => {
        playerRef.current.seekTo(0);
    }, []);

    useEffect(() => {
        if (currentVideoIndex !== 0) {
            playerRef.current.seekTo(0);
        }
    }, [currentVideoIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPlaying(true);
        }, 1000);
    }, [])

    useEffect(() => {
        sendWebSocketMessage(videoInfo.title);
    }, [videoInfo]);

    const handleEnded = () => {
        setCurrentVideoIndex(prevIndex => (prevIndex + 1) % videos.length);
    }

    const handleStart = async () => {
        let json = await axios.get("/api/web-interface/view?aid=" + videos[currentVideoIndex].aid)
            .then(res => {
                const resData = res.data.data;
                setVideoInfo({
                    title: resData.title,
                    aid: videos[currentVideoIndex].aid,
                    author: resData.owner.name,
                    face: resData.owner.face
                });

            }).catch(err => {
                setVideoInfo({
                    title: '网络错误呜呜呜',
                    aid: 114514,
                    author: '网络错误呜呜呜'
                })
            })
    }
    return (
        <div id="video-container">
            <div id="video-player">
                <ReactPlayer
                    controls
                    ref={playerRef}
                    url={videos[currentVideoIndex]?.filename ? serverFileUrl + videos[currentVideoIndex]?.filename : '出错'}
                    width={'100%'}
                    height={'auto'}
                    playing={playing}
                    onEnded={handleEnded}
                    onStart={handleStart} />
            </div>
            <div id="video-info">
                <div id="video-title">{videoInfo.title}</div>
                <div id="video-aid">{'av' + videoInfo.aid}</div>
            </div>
            <div id="author-info">
                <span><img src={videoInfo.face} alt="" id="avatar" /></span>
                <span>{videoInfo.author}</span>
            </div>
        </div>
    )
}

export default VideoPlayer;