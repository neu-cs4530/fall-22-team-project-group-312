import { Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import TownSelection from '../../../../Login/TownSelection';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import IntroContainer from '../IntroContainer/IntroContainer';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <Heading as='h2' size='xl'>
        Welcome to Covey.Town!
      </Heading>
      <Text p='4'>
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat. To
        get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      <DeviceSelectionScreen />
      <TownSelection />
    </IntroContainer>
  );
}
