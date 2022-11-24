import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import useTownController from '../../../../../../hooks/useTownController';
import WardrobePanel from './WardrobePanel';

export default function WardrobeButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const coveyTownController = useTownController();

  const openWardrobe = useCallback(() => {
    onOpen();
    coveyTownController.pause();
  }, [onOpen, coveyTownController]);

  return (
    <>
      <MenuItem data-testid='openMenuButton' onClick={openWardrobe}>
        <Typography variant='body1'>Changing Room</Typography>
      </MenuItem>
      <WardrobePanel
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        coveyTownController={coveyTownController}
      />
    </>
  );
}
