import { useEffect, useState, useRef } from "react";
import { AddList, QueryMediaLists, QueryVideos, DelList, AddAVideo, DelVideo } from "../services/Query";
import './AddVideoPage.css'
import DisplayWindow from "./DisplayWindow";

const AddVideoPage = () => {
    const [mediaLists, setMediaLists] = useState([]);
    const [videos, setVideos] = useState([]);

    const [currentPid, setCurrentPid] = useState(-1);

    const mnameRef = useRef(null);
    const pathRef = useRef(null);

    const videoFilenameRef = useRef(null);
    const videoAidRef = useRef(null);

    const [checkMname, setCheckMname] = useState(false);
    const [checkPath, setCheckPath] = useState(false);

    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

    const [isAddVideoWindowVisible, setIsAddVideoWindowVisible] = useState(false);

    useEffect(() => {
        QueryMediaLists()
            .then(res => {
                setMediaLists(res);
            }).catch(err => {
                console.error(err);
            });
        QueryVideos(1).then(res => {
            setVideos(res);
        }).catch(err => {
            console.error(err);
        })
    }, [])

    const handleMediaListChange = (e) => {
        if (e.target.value == 'add-a-list') {
            const addWindow = document.getElementById('add-window');
            addWindow.style.display = 'flex'
        }
        else if (e.target.value == 'del-a-list') {
            const delWindow = document.getElementById('del-window');
            delWindow.style.display = 'flex';
        }
        else {
            QueryVideos(e.target.value)
                .then(res => {
                    setVideos(res);
                    setCurrentPid(e.target.value);
                }).catch(err => {
                    console.error(err);
                })
            console.log(videos);
        }
    }

    const getTitle = filename => filename.substring(0, filename.indexOf('.'));

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: mnameRef.current.value,
            path: pathRef.current.value
        }
        AddList(data);
    }

    const handlePathCheck = (e) => {
        const pathRegex = /^(?:\/|\\|[a-zA-Z]:\\)(?:[^\\/:*?"<>|\r\n]+[\\/])*[^\\/:*?"<>|\r\n]*$/;

        if (pathRegex.test(e.target.value) === true) {
            document.getElementById('path-warn-block').style.display = 'none';
        }
        else {
            document.getElementById('path-warn-block').style.display = 'flex';
            setCheckPath(true);
        }
        handleInput()
    }

    const handleMnameChange = (e) => {
        if (e.target.value !== '')
            setCheckMname(true);
        handleInput()
    }

    const handleInput = () => {
        if (checkMname === true && checkPath === true) {
            setIsButtonEnabled(false);
        }
    }

    const handleCloseAdd = () => {
        document.getElementById('add-window').style.display = 'none'
    }

    const handleCloseDel = () => {
        document.getElementById('del-window').style.display = 'none'
    }

    const handleDel = (pid, name) => {
        let flag = confirm("确定删除“" + name + "”吗？");
        if (flag) {
            DelList(pid)
        }
    }

    const handleOpenAddAVideoWindow = () => {
        setIsAddVideoWindowVisible(true);
    }

    const handleCloseAddVideoWindow = () => {
        setIsAddVideoWindowVisible(false);
    }

    const handleAddAVideo = (e) => {
        e.preventDefault();
        if (currentPid == -1) {
            alert("当前未设置播放列表！");
            return
        }
        const videoInfo = {
            filename: videoFilenameRef.current.value,
            aid: videoAidRef.current.value,
            pid: currentPid
        }
        AddAVideo(videoInfo);
    }

    const handleDelVideo = (item) => {
        let flag = confirm("确定删除“" + item.filename + "”吗？");
        if (flag) {
            DelVideo(item.vid);
        }
    }

    return (
        <div id="add-video-page">
            <div>
                <span>选择播放列表</span>
                <form action="">
                    <select
                        name="media-lists"
                        id="media-lists"
                        onChange={handleMediaListChange}>
                        <optgroup label="媒体列表">
                            {mediaLists.map((item, index) => (
                                <option key={item.pid} value={item.pid}>{item.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="--------------">
                            <option value='add-a-list'>添加一个</option>
                            <option value="del-a-list">删除...</option>
                        </optgroup>
                    </select>

                </form>
            </div>
            <div id="media-list-box">
                <ul>
                    {videos.map((item, index) => (
                        <li key={item.vid}>
                            <div>
                                <div>
                                    <p style={{fontWeight: "bold"}}>
                                        {getTitle(item.filename)}
                                    </p>
                                    <p style={{fontSize: "0.8em"}}>
                                        <a href={"http://www.bilibili.com/video/av" + item.aid}>
                                            av{item.aid}
                                        </a>
                                    </p>
                                </div>
                                <div id="del-video" onClick={() => handleDelVideo(item)}>
                                    删除
                                </div>
                            </div>
                        </li>
                    ))}
                    <li id="add-a-video">
                        <div onClick={handleOpenAddAVideoWindow}>
                            + 添加一个视频...
                        </div>
                    </li>
                </ul>
            </div>
            <div id="add-window">
                <div className="close-button" onClick={handleCloseAdd}>
                    <span>X</span>
                </div>
                <form method="post" onSubmit={handleSubmit}>
                    <label htmlFor="mname">列表名称</label>
                    <input type="mname" name="mname" id="mname" placeholder="不是BV号" ref={mnameRef} onChange={handleMnameChange} />
                    <br />
                    <label htmlFor="file-path">文件路径</label>
                    <input type="text" name="file-path" id="file-path" placeholder="请输入文件路径" ref={pathRef} onChange={handlePathCheck} />
                    <div className="warn-block" id="path-warn-block">
                        <span id='path-warn-message'>路径不合法</span>
                    </div>
                    <br />
                    <input type="submit" id='submit-button' value="添加" disabled={isButtonEnabled} />
                </form>
            </div>
            <div id="del-window">
                <div className="close-button" onClick={handleCloseDel}>
                    <span>X</span>
                </div>
                <form method="post" onSubmit={handleSubmit}>
                    <div id="del-list">
                        <ul>
                            {mediaLists.map((item, index) => (
                                <li key={item.pid} value={item.pid}>
                                    <div>
                                        <span>{item.name}</span>
                                        <span>
                                            <div className="del-button" onClick={() => handleDel(item.pid, item.name)}>x</div>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </form>
            </div>
            <DisplayWindow title="添加一个视频..." isVisible={isAddVideoWindowVisible} onClose={handleCloseAddVideoWindow}>
                <form method="post" onSubmit={handleAddAVideo}>
                    视频名称：<input type="text" ref={videoFilenameRef}/><br />
                    视频av号：<input type="text" ref={videoAidRef}/><br />
                    <input type="submit" value="确定" />
                </form>
            </DisplayWindow>
        </div>
    )
}
export default AddVideoPage