/**
 * 组件测试
 * @Author: centerm.gaohan
 * @Date: 2020-10-23 14:45:23
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-26 11:36:54
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AudioUtils, AudioRecorder} from 'react-native-audio'; //录音组件
import Sound from 'react-native-sound';
import {Toast} from 'teaset';
import invariant from 'invariant';

const Audio = () => {
  // 保存音频地址
  const [audioPath] = useState(
    AudioUtils.DocumentDirectoryPath + '/service.aac',
  );
  // 权限
  const [hasPermisstion, setHasPermisstion] = useState(false);

  // 当前录音状态 record pause stop
  const [recordStatus, setRecordStatus] = useState('');

  // 校验是否有权限
  useEffect(() => {
    AudioRecorder.checkAuthorizationStatus().then((permisstion) => {
      // 未授权
      setHasPermisstion(permisstion);
    });
    setHasPermisstion(true);
  }, []);

  /**
   * AudioRecorder.prepareRecordingAtPath(path,option)
   * 录制路径
   * path 路径
   * option 参数
   */
  useEffect(() => {
    if (!hasPermisstion) {
      return;
    }
    if (!audioPath) {
      return;
    }
    const option = {
      SampleRate: 44100.0, //采样率
      Channels: 2, //通道
      AudioQuality: 'High', //音质
      AudioEncoding: 'aac', //音频编码
      // OutputFormat: 'mpeg_4', //输出格式
      MeteringEnabled: false, //是否计量
      MeasurementMode: false, //测量模式
      AudioEncodingBitRate: 32000, //音频编码比特率
      IncludeBase64: true, //是否是base64格式
      // AudioSource: 0, //音频源
    };
    AudioRecorder.prepareRecordingAtPath(audioPath, option);
  }, [audioPath, hasPermisstion]);

  useEffect(() => {
    // 开始录音
    if (recordStatus === 'record') {
      AudioRecorder.startRecording();
    }
    // 暂停录音
    if (recordStatus === 'pause') {
      AudioRecorder.pauseRecording();
    }
    // 结束录音
    if (recordStatus === 'stop') {
      AudioRecorder.stopRecording();
    }
  }, [recordStatus]);

  // 开始录音
  const onRecord = () => {
    if (!hasPermisstion) {
      Toast.fail('请先授权');
      return;
    }
    if (recordStatus === 'record') {
      Toast.fail('正在录音');
      return;
    }

    setRecordStatus('record');
    console.log('onRecord');
  };

  // 暂停录音
  const onPause = () => {
    if (recordStatus !== 'record') {
      Toast.fail('尚未录音');
      return;
    }
    setRecordStatus('pause');
  };

  // 恢复录音
  const onResume = () => {
    if (recordStatus !== 'pause') {
      Toast.fail('尚未未暂停');
      return;
    }
    setRecordStatus('record');
  };

  const onStop = () => {
    setRecordStatus('stop');
  };

  // 播放
  const onPlay = () => {
    try {
      invariant(recordStatus !== 'record', '正在录音！');
      const sound = new Sound(audioPath, '', (error) => {
        if (error) {
          console.log('error: ', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          console.log('success', success);
        });
      }, 100);
    } catch (error) {
      Toast.fail(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={onRecord}>
        Record(开始录音)
      </Text>
      <Text style={styles.text} onPress={onPause}>
        Pause(暂停录音)
      </Text>
      <Text style={styles.text} onPress={onResume}>
        Resume(恢复录音)
      </Text>
      <Text style={styles.text} onPress={onStop}>
        Stop(停止录音)
      </Text>
      <Text style={styles.text} onPress={onPlay}>
        Play(播放录音)
      </Text>
      <Text style={styles.text}>
        {recordStatus === 'record'
          ? '正在录音'
          : recordStatus === 'pause'
          ? '已暂停'
          : '未开始'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
export default Audio;
