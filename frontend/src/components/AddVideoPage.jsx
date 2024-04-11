import { useEffect, useState, useRef } from "react";
import { AddList, QueryMediaLists, QueryVideos } from "../services/Query";
import './AddVideoPage.css'

const AddVideoPage = () => {
    const [mediaLists, setMediaLists] = useState([]);
    const [videos, setVideos] = useState([]);

    const mnameRef = useRef(null);
    const pathRef = useRef(null);

    const [checkMname, setCheckMname] = useState(false);
    const [checkPath, setCheckPath] = useState(false);

    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

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
        if (e.target.value != 'add-a-list') {
            QueryVideos(e.target.value)
                .then(res => {
                    setVideos(res);
                }).catch(err => {
                    console.error(err);
                })
            console.log(videos);
        }
        else {
            const addWindow = document.getElementById('add-window');
            addWindow.style.display = 'flex'
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

    const handleClose = () => {
        document.getElementById('add-window').style.display = 'none'
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
                        </optgroup>
                    </select>

                </form>
            </div>
            <div>
                <ul>
                    {videos.map((item, index) => (
                        <li key={item.vid}>{getTitle(item.filename)}</li>
                    ))}
                </ul>
            </div>
            <div id="add-window">
                <div className="close-button" onClick={handleClose}>
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
        </div>
    )
}
export default AddVideoPage