import axios from "axios"

const serverUrl = 'http://localhost:3001';

export const QueryMediaLists = async () => {
    return await axios.get(serverUrl + '/query_media_lists').then(res => {
        return res.data
    }).catch(err => {
        console.error('error: ', err);
        return []
    })
}

export const QueryVideos = async (pid) => {
    return await axios.get(serverUrl + '/query_videos?pid=' + pid).then(res => {
        return res.data;
    }).catch(err => {
        console.error('error: ', err);
        return [];
    })
}

export const AddList = async (data) => {
    let message = ''
    await axios.post(serverUrl + '/add_list', data)
        .then(res => {
            console.log('数据添加成功：', res.data);
            alert('添加成功');
        }).catch(err => {
            console.error('error: ', err);
            alert('添加失败');
        })
}

export const DelList = async (pid) => {
    let message = '';
    
    await axios.post(serverUrl + '/del_list?pid=' + pid)
        .then(res => {
            console.log('删除成功', res.data);
            alert('删除成功');
            location.reload();
        }).catch(err => {
            console.error('error: ', err);
            alert('删除失败');
        })
}

export const AddAVideo = async (videoInfo) => {
    let message = '';

    await axios.post(serverUrl + '/add_a_video', videoInfo)
        .then(res => {
            console.log('添加成功', res.data);
            alert('添加成功');
            location.reload();
        }).catch(err => {
            console.error('error: ', err);
            alert('添加失败');
        })
}

export const DelVideo = async (vid) => {
    let message = '';
    
    await axios.delete(serverUrl + '/del_video?vid=' + vid)
        .then(res => {
            console.log('删除成功', res.data);
            alert('删除成功');
            location.reload();
        }).catch(err => {
            console.error('error: ', err);
            alert('删除失败');
        })
}