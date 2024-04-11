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