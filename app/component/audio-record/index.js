/**
 * 组件测试
 * @Author: centerm.gaohan
 * @Date: 2020-10-23 14:45:23
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-26 12:00:58
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {Toast} from 'teaset';

const Audio = () => {
  // 当前录音状态 record stop
  const [recordStatus, setRecordStatus] = useState('');

  // 校验是否有权限
  useEffect(() => {
    const options = {
      sampleRate: 16000, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: 'test.wav', // default 'audio.wav'
    };
    AudioRecord.init(options);

    AudioRecord.on('data', (data) => {
      console.log('data', data);
    });
  }, []);

  useEffect(() => {
    // 开始录音
    if (recordStatus === 'record') {
      AudioRecord.start();
    }
    // 结束录音
    if (recordStatus === 'stop') {
      AudioRecord.stop();
    }
  }, [recordStatus]);

  // 开始录音
  const onRecord = () => {
    if (recordStatus === 'record') {
      Toast.fail('正在录音');
      return;
    }

    setRecordStatus('record');
    console.log('onRecord');
  };

  const onStop = () => {
    setRecordStatus('stop');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={onRecord}>
        Record(开始录音)
      </Text>
      <Text style={styles.text} onPress={onStop}>
        Stop(停止录音)
      </Text>
      <Text style={styles.text}>
        {recordStatus === 'record' ? '正在录音' : '未开始'}
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
